import { FormEvent, useState } from "react";
import StatusBanner from "@/components/StatusBanner";
import { valorantApi } from "@/api/endpoints";
import type { RiotPlatform, ValorantContentResponse, ValorantMatchHistoryResponse } from "@/api/types";
import { useApi } from "@/lib/useApi";

const platforms: RiotPlatform[] = ["Br1", "Na1", "Euw1", "Eun1", "Kr"];

export default function ValorantPage() {
  const [puuid, setPuuid] = useState("");
  const [platform, setPlatform] = useState<RiotPlatform>("Br1");

  const history = useApi(valorantApi.matchHistory);
  const content = useApi(valorantApi.content);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!puuid.trim()) return;
    history.run(puuid.trim(), { platform });
  }

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">VALORANT</p>
        <h1 className="text-2xl font-bold text-slate-900">Match history e conteúdo</h1>
        <p className="text-sm text-slate-600">
          Endpoints de Valorant exigem <strong>chave de produção</strong> da Riot — chaves dev geralmente retornam
          403. Use a página apenas após aprovar a aplicação em developer.riotgames.com.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-12"
      >
        <label className="sm:col-span-8">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">PUUID</span>
          <input
            value={puuid}
            onChange={(e) => setPuuid(e.target.value)}
            placeholder="cole o puuid (use a página de LoL/TFT/Account para obter)"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>
        <label className="sm:col-span-3">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Platform</span>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as RiotPlatform)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            {platforms.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
        <div className="flex items-end sm:col-span-1">
          <button
            type="submit"
            disabled={history.loading}
            className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {history.loading ? "..." : "Buscar"}
          </button>
        </div>
      </form>

      <StatusBanner
        loading={history.loading}
        error={history.error}
        empty={!history.loading && !history.error && !history.data}
        emptyMessage="Cole um PUUID e selecione a plataforma para listar partidas."
      />

      {history.data && <HistoryCard data={history.data} />}

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Conteúdo (mapas, agentes, modos)</h2>
          <button
            onClick={() => content.run({ platform })}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Atualizar
          </button>
        </div>
        <StatusBanner loading={content.loading} error={content.error} empty={!content.data} emptyMessage="Clique em Atualizar para sincronizar." />
        {content.data && <ContentSummary data={content.data} />}
      </article>
    </section>
  );
}

function HistoryCard({ data }: { data: ValorantMatchHistoryResponse }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Histórico</h2>
      <p className="mt-1 break-all text-xs text-slate-400">puuid: {data.puuid}</p>
      {data.history.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">Sem partidas no histórico.</p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {data.history.map((entry) => (
            <li key={entry.matchId} className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-slate-800">{entry.queueId || "—"}</p>
                <p className="text-xs text-slate-500">
                  {new Date(entry.gameStartUtc).toLocaleString("pt-BR")}
                </p>
              </div>
              <code className="break-all text-xs text-slate-500">{entry.matchId}</code>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function ContentSummary({ data }: { data: ValorantContentResponse }) {
  return (
    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
      <Field label="Versão" value={data.version} />
      <Field label="Agentes" value={data.characterCount} />
      <Field label="Mapas" value={data.mapCount} />
      <Field label="Modos" value={data.gameModeCount} />
      <Field label="Acts" value={data.actCount} />
    </dl>
  );
}

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="font-medium text-slate-800">{value}</dd>
    </div>
  );
}

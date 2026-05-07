import { useState } from "react";
import RiotIdSearch, { RiotIdSearchValue } from "@/components/RiotIdSearch";
import StatusBanner from "@/components/StatusBanner";
import { tftApi } from "@/api/endpoints";
import type { TftMatchResponse, TftPlayerResponse, TftRankedResponse } from "@/api/types";
import { useApi } from "@/lib/useApi";

export default function TftPage() {
  const [search, setSearch] = useState<RiotIdSearchValue | null>(null);
  const player = useApi(tftApi.playerByRiotId);
  const ranked = useApi(tftApi.ranked);
  const matches = useApi(tftApi.recentMatches);

  async function handleSubmit(value: RiotIdSearchValue) {
    setSearch(value);
    const p = (await player.run(value.gameName, value.tagLine, {
      platform: value.platform,
      cluster: value.cluster
    })) as TftPlayerResponse | undefined;
    if (!p) return;
    await Promise.allSettled([
      ranked.run(p.puuid, { platform: value.platform }),
      matches.run(p.puuid, { cluster: value.cluster, count: 5 })
    ]);
  }

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-600">Teamfight Tactics</p>
        <h1 className="text-2xl font-bold text-slate-900">Companions e ranked</h1>
        <p className="text-sm text-slate-600">
          Resolve Riot ID, busca o invocador TFT, ranked e as últimas 5 partidas (placement, level, gold left).
        </p>
      </header>

      <RiotIdSearch onSubmit={handleSubmit} loading={player.loading} />

      <StatusBanner
        loading={player.loading}
        error={player.error}
        empty={!search && !player.data}
        emptyMessage="Informe um Riot ID e clique em Buscar."
      />

      {player.data && (
        <>
          <PlayerCard player={player.data} />
          <RankedCard data={ranked.data} loading={ranked.loading} error={ranked.error} />
          <MatchesCard data={matches.data} loading={matches.loading} error={matches.error} />
        </>
      )}
    </section>
  );
}

function PlayerCard({ player }: { player: TftPlayerResponse }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        {player.gameName}
        <span className="text-slate-400">#{player.tagLine}</span>
      </h2>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600 sm:grid-cols-3">
        <Field label="Plataforma" value={player.platform} />
        <Field label="Nível" value={player.summonerLevel} />
        <Field label="Profile Icon" value={player.profileIconId} />
      </dl>
      <p className="mt-3 break-all text-xs text-slate-400">puuid: {player.puuid}</p>
    </article>
  );
}

function RankedCard({
  data, loading, error
}: {
  data: TftRankedResponse | undefined;
  loading: boolean;
  error: unknown;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Ranked</h2>
      <StatusBanner
        loading={loading}
        error={error}
        empty={!loading && !error && (data?.entries?.length ?? 0) === 0}
        emptyMessage="Sem entradas ranked."
      />
      {data && data.entries.length > 0 && (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {data.entries.map((e) => (
            <li key={e.queueType} className="rounded-lg border border-slate-100 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">{e.queueType.replace("RANKED_TFT_", "")}</span>
                <span className="text-slate-500">{e.tier} {e.rank} · {e.leaguePoints} LP</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {e.wins}W / {e.losses}L · {e.hotStreak ? "Hot streak" : "—"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function MatchesCard({
  data, loading, error
}: {
  data: TftMatchResponse[] | undefined;
  loading: boolean;
  error: unknown;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Últimas partidas</h2>
      <StatusBanner
        loading={loading}
        error={error}
        empty={!loading && !error && (data?.length ?? 0) === 0}
        emptyMessage="Sem partidas recentes."
      />
      {data && data.length > 0 && (
        <ul className="mt-4 divide-y divide-slate-100">
          {data.map((match) => (
            <li key={match.matchId} className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-slate-800">
                  Set {match.tftSetNumber} <span className="text-slate-400">· {match.tftGameType}</span>
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(match.gameDateUtc).toLocaleString("pt-BR")} · {Math.round(match.gameLengthSeconds / 60)} min
                </p>
              </div>
              <div className="text-right text-xs text-slate-500">
                {match.participants.length} jogadores
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
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

import { FormEvent, useEffect, useState } from "react";
import StatusBanner from "@/components/StatusBanner";
import { lorApi } from "@/api/endpoints";
import type { LorLeaderboardResponse, LorMatchIdsResponse, RiotCluster } from "@/api/types";
import { useApi } from "@/lib/useApi";

const clusters: RiotCluster[] = ["Americas", "Europe", "Asia", "Sea"];

export default function LorPage() {
  const [puuid, setPuuid] = useState("");
  const [cluster, setCluster] = useState<RiotCluster>("Americas");

  const matches = useApi(lorApi.recentMatches);
  const leaderboard = useApi(lorApi.masterLeaderboard);

  useEffect(() => {
    leaderboard.run({ cluster });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cluster]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!puuid.trim()) return;
    matches.run(puuid.trim(), { cluster });
  }

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Legends of Runeterra</p>
        <h1 className="text-2xl font-bold text-slate-900">Decks e leaderboards</h1>
        <p className="text-sm text-slate-600">
          Lista os IDs das partidas recentes pelo PUUID e a leaderboard do tier Master por cluster regional.
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
            placeholder="cole o puuid"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </label>
        <label className="sm:col-span-3">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">Cluster</span>
          <select
            value={cluster}
            onChange={(e) => setCluster(e.target.value as RiotCluster)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            {clusters.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <div className="flex items-end sm:col-span-1">
          <button
            type="submit"
            disabled={matches.loading}
            className="w-full rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {matches.loading ? "..." : "Buscar"}
          </button>
        </div>
      </form>

      <RecentMatchesCard data={matches.data} loading={matches.loading} error={matches.error} />
      <LeaderboardCard data={leaderboard.data} loading={leaderboard.loading} error={leaderboard.error} />
    </section>
  );
}

function RecentMatchesCard({
  data, loading, error
}: {
  data: LorMatchIdsResponse | undefined;
  loading: boolean;
  error: unknown;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Partidas recentes</h2>
      <StatusBanner
        loading={loading}
        error={error}
        empty={!loading && !error && !data}
        emptyMessage="Cole um PUUID e clique em Buscar."
      />
      {data && (
        <>
          <p className="mt-2 text-xs text-slate-500">
            Cluster: <strong className="text-slate-700">{data.cluster}</strong> · {data.matchIds.length} partidas
          </p>
          {data.matchIds.length > 0 && (
            <ul className="mt-3 space-y-1 text-sm text-slate-700">
              {data.matchIds.map((id) => (
                <li key={id} className="break-all rounded-md border border-slate-100 px-3 py-1.5 font-mono text-xs">
                  {id}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </article>
  );
}

function LeaderboardCard({
  data, loading, error
}: {
  data: LorLeaderboardResponse | undefined;
  loading: boolean;
  error: unknown;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Leaderboard Master</h2>
      <StatusBanner loading={loading} error={error} empty={!loading && !error && !data} emptyMessage="" />
      {data && data.entries.length === 0 && (
        <p className="mt-2 text-sm text-slate-500">Leaderboard vazia para este cluster.</p>
      )}
      {data && data.entries.length > 0 && (
        <ol className="mt-4 divide-y divide-slate-100 text-sm">
          {data.entries.slice(0, 25).map((entry) => (
            <li key={`${entry.rank}-${entry.name}`} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-6 w-8 items-center justify-center rounded-md bg-emerald-50 text-xs font-semibold text-emerald-700">
                  {entry.rank}
                </span>
                <span className="font-medium text-slate-800">{entry.name}</span>
              </div>
              <span className="text-xs text-slate-500">{entry.leaguePoints} LP</span>
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}

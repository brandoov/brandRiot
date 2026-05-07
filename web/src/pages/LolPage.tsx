import { useState } from "react";
import RiotIdSearch, { RiotIdSearchValue } from "@/components/RiotIdSearch";
import StatusBanner from "@/components/StatusBanner";
import { lolApi } from "@/api/endpoints";
import type { LolMatchResponse, LolPlayerResponse, LolRankedResponse } from "@/api/types";
import { useApi } from "@/lib/useApi";

export default function LolPage() {
  const [search, setSearch] = useState<RiotIdSearchValue | null>(null);

  const player = useApi(lolApi.playerByRiotId);
  const ranked = useApi(lolApi.ranked);
  const matches = useApi(lolApi.recentMatches);

  async function handleSubmit(value: RiotIdSearchValue) {
    setSearch(value);
    const p = (await player.run(value.gameName, value.tagLine, {
      platform: value.platform,
      cluster: value.cluster
    })) as LolPlayerResponse | undefined;
    if (!p) return;

    await Promise.allSettled([
      ranked.run(p.puuid, { platform: value.platform }),
      matches.run(p.puuid, { cluster: value.cluster, count: 5 })
    ]);
  }

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">League of Legends</p>
        <h1 className="text-2xl font-bold text-slate-900">Invocadores e partidas</h1>
        <p className="text-sm text-slate-600">
          Resolve Riot ID → puuid, busca o summoner, ranked e as últimas 5 partidas. Tudo persistido no banco.
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
          <MatchesCard data={matches.data} loading={matches.loading} error={matches.error} puuid={player.data.puuid} />
        </>
      )}
    </section>
  );
}

function PlayerCard({ player }: { player: LolPlayerResponse }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">
        {player.gameName}
        <span className="text-slate-400">#{player.tagLine}</span>
      </h2>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600 sm:grid-cols-4">
        <Field label="Plataforma" value={player.platform} />
        <Field label="Nível" value={player.summonerLevel} />
        <Field label="Profile Icon" value={player.profileIconId} />
        <Field label="Summoner ID" value={truncate(player.summonerId, 12)} />
      </dl>
      <p className="mt-3 break-all text-xs text-slate-400">puuid: {player.puuid}</p>
    </article>
  );
}

function RankedCard({
  data, loading, error
}: {
  data: LolRankedResponse | undefined;
  loading: boolean;
  error: unknown;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Ranked</h2>
      <StatusBanner loading={loading} error={error} empty={!loading && !error && (data?.entries?.length ?? 0) === 0} emptyMessage="Sem entradas ranked." />
      {data && data.entries.length > 0 && (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {data.entries.map((e) => (
            <li key={e.queueType} className="rounded-lg border border-slate-100 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800">{e.queueType.replace("RANKED_", "").replace("_", " ")}</span>
                <span className="text-slate-500">{e.tier} {e.rank} · {e.leaguePoints} LP</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {e.wins}W / {e.losses}L · {Math.round((e.wins / Math.max(e.wins + e.losses, 1)) * 100)}%
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

function MatchesCard({
  data, loading, error, puuid
}: {
  data: LolMatchResponse[] | undefined;
  loading: boolean;
  error: unknown;
  puuid: string;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">Últimas partidas</h2>
      <StatusBanner loading={loading} error={error} empty={!loading && !error && (data?.length ?? 0) === 0} emptyMessage="Sem partidas recentes." />
      {data && data.length > 0 && (
        <ul className="mt-4 divide-y divide-slate-100">
          {data.map((match) => {
            const me = match.participants.find((p) => p.puuid === puuid);
            return (
              <li key={match.matchId} className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-slate-800">
                    {me?.championName ?? "—"} <span className="text-slate-400">· {match.gameMode}</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(match.gameCreationUtc).toLocaleString("pt-BR")} · {Math.round(match.gameDurationSeconds / 60)} min
                  </p>
                </div>
                {me && (
                  <div className={`text-right text-xs font-semibold ${me.win ? "text-emerald-600" : "text-rose-600"}`}>
                    {me.win ? "Vitória" : "Derrota"} · {me.kills}/{me.deaths}/{me.assists}
                  </div>
                )}
              </li>
            );
          })}
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

function truncate(s: string, max: number) {
  return s.length > max ? `${s.slice(0, max)}…` : s;
}

import { useEffect, useRef } from "react";
import GameShell from "@/components/game/GameShell";
import RiotIdSearch, { type RiotIdSearchValue } from "@/components/RiotIdSearch";
import StatusBanner from "@/components/StatusBanner";
import { accountApi, lorApi } from "@/api/endpoints";
import { useApi } from "@/lib/useApi";
import { useRiotIdMemory } from "@/lib/useRiotIdMemory";
import { buildLorModel } from "@/lib/buildGameModel";

export default function LorPage() {
  const [memory, setMemory] = useRiotIdMemory("lor");
  const account = useApi(accountApi.byRiotId);
  const matches = useApi(lorApi.recentMatches);
  const leaderboard = useApi(lorApi.masterLeaderboard);

  // Recarrega leaderboard quando o cluster muda
  const lastClusterRef = useRef<string>("");
  useEffect(() => {
    if (lastClusterRef.current === memory.cluster) return;
    lastClusterRef.current = memory.cluster;
    leaderboard.run({ cluster: memory.cluster });
  }, [memory.cluster, leaderboard]);

  const lastKeyRef = useRef<string>("");
  useEffect(() => {
    if (!memory.gameName) return;
    const key = `${memory.gameName}|${memory.tagLine}|${memory.cluster}`;
    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;

    let cancelled = false;
    (async () => {
      const acc = await account.run(memory.gameName, memory.tagLine, { cluster: memory.cluster });
      if (cancelled || !acc) return;
      await matches.run(acc.puuid, { cluster: memory.cluster });
    })();
    return () => {
      cancelled = true;
    };
  }, [memory, account, matches]);

  function handleSubmit(value: RiotIdSearchValue) {
    setMemory(value);
  }

  const model = buildLorModel({ matches: matches.data, leaderboard: leaderboard.data });

  const isLoading = account.loading || matches.loading || leaderboard.loading;
  const error = account.error ?? matches.error ?? leaderboard.error;
  const accountLoaded = !!account.data && !error && !account.loading;

  const riotIdLabel = account.data
    ? `${account.data.gameName}#${account.data.tagLine}`
    : memory.gameName
      ? `${memory.gameName}#${memory.tagLine}`
      : undefined;

  const banner = (() => {
    if (error) {
      return <StatusBanner error={error} />;
    }
    if (isLoading) {
      return (
        <StatusBanner
          loading
          loadingMessage={
            memory.gameName
              ? `Carregando ${memory.gameName}#${memory.tagLine} e leaderboard ${memory.cluster}…`
              : `Carregando leaderboard ${memory.cluster}…`
          }
        />
      );
    }
    if (accountLoaded && account.data) {
      const ids = matches.data?.matchIds.length ?? 0;
      return (
        <StatusBanner
          success
          successMessage={`PUUID resolvido para ${account.data.gameName}#${account.data.tagLine} · ${ids} partidas LoR · leaderboard ${leaderboard.data?.entries.length ?? 0} jogadores.`}
        />
      );
    }
    if (!memory.gameName && leaderboard.data) {
      return (
        <StatusBanner
          empty
          emptyMessage={`Leaderboard Master (${leaderboard.data.entries.length}) carregada. Informe seu Riot ID para buscar suas partidas pessoais.`}
        />
      );
    }
    return null;
  })();

  return (
    <GameShell
      game="lor"
      model={model}
      riotIdLabel={riotIdLabel}
      banner={banner}
      searchSlot={
        <RiotIdSearch
          variant="inline"
          defaults={memory}
          onSubmit={handleSubmit}
          loading={isLoading}
        />
      }
    />
  );
}

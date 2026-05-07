import { useEffect, useRef } from "react";
import GameShell from "@/components/game/GameShell";
import RiotIdSearch, { type RiotIdSearchValue } from "@/components/RiotIdSearch";
import StatusBanner from "@/components/StatusBanner";
import { accountApi, lorApi } from "@/api/endpoints";
import { useApi } from "@/lib/useApi";
import { useRiotIdMemory } from "@/lib/useRiotIdMemory";
import { buildLorModel } from "@/lib/buildGameModel";
import { demoMode } from "@/lib/env";

export default function LorPage() {
  const [memory, setMemory] = useRiotIdMemory("lor");
  const account = useApi(accountApi.byRiotId);
  const matches = useApi(lorApi.recentMatches);
  const leaderboard = useApi(lorApi.masterLeaderboard);

  // Recarrega leaderboard quando o cluster muda (modo real apenas)
  const lastClusterRef = useRef<string>("");
  useEffect(() => {
    if (demoMode) return;
    if (lastClusterRef.current === memory.cluster) return;
    lastClusterRef.current = memory.cluster;
    leaderboard.run({ cluster: memory.cluster });
  }, [memory.cluster, leaderboard]);

  const lastKeyRef = useRef<string>("");
  useEffect(() => {
    if (demoMode) return;
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

  const model = buildLorModel({
    matches: matches.data,
    leaderboard: leaderboard.data,
    displayName: demoMode && memory.gameName ? memory.gameName : undefined,
    displayTag: demoMode && memory.gameName ? memory.tagLine : undefined,
    displayPlatform: demoMode && memory.gameName ? memory.platform : undefined
  });

  const isLoading = !demoMode && (account.loading || matches.loading || leaderboard.loading);
  const error = demoMode ? null : (account.error ?? matches.error ?? leaderboard.error);
  const accountLoaded = !demoMode && !!account.data && !error && !account.loading;

  const riotIdLabel = account.data
    ? `${account.data.gameName}#${account.data.tagLine}`
    : memory.gameName
      ? `${memory.gameName}#${memory.tagLine}`
      : undefined;

  const banner = (() => {
    if (demoMode) {
      if (!memory.gameName) {
        return (
          <StatusBanner
            empty
            emptyMessage="Modo demonstração — digite qualquer Riot ID para ver a UI de Legends of Runeterra com dados de exemplo."
          />
        );
      }
      return (
        <StatusBanner
          success
          successMessage={`Modo demonstração ativo para ${memory.gameName}#${memory.tagLine}. Clone o repositório e rode o backend localmente para ver dados reais.`}
        />
      );
    }
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

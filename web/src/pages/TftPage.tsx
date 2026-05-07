import { useEffect, useRef } from "react";
import GameShell from "@/components/game/GameShell";
import RiotIdSearch, { type RiotIdSearchValue } from "@/components/RiotIdSearch";
import StatusBanner from "@/components/StatusBanner";
import { tftApi } from "@/api/endpoints";
import { useApi } from "@/lib/useApi";
import { useRiotIdMemory } from "@/lib/useRiotIdMemory";
import { buildTftModel } from "@/lib/buildGameModel";

export default function TftPage() {
  const [memory, setMemory] = useRiotIdMemory("tft");
  const player = useApi(tftApi.playerByRiotId);
  const ranked = useApi(tftApi.ranked);
  const matches = useApi(tftApi.recentMatches);

  const lastKeyRef = useRef<string>("");
  useEffect(() => {
    if (!memory.gameName) return;
    const key = `${memory.gameName}|${memory.tagLine}|${memory.platform}|${memory.cluster}`;
    if (lastKeyRef.current === key) return;
    lastKeyRef.current = key;

    let cancelled = false;
    (async () => {
      const p = await player.run(memory.gameName, memory.tagLine, {
        platform: memory.platform,
        cluster: memory.cluster
      });
      if (cancelled || !p) return;
      await Promise.allSettled([
        ranked.run(p.puuid, { platform: memory.platform }),
        matches.run(p.puuid, { cluster: memory.cluster, count: 6 })
      ]);
    })();
    return () => {
      cancelled = true;
    };
  }, [memory, player, ranked, matches]);

  function handleSubmit(value: RiotIdSearchValue) {
    setMemory(value);
  }

  const model = buildTftModel({
    player: player.data,
    ranked: ranked.data,
    matches: matches.data
  });

  const isLoading = player.loading || ranked.loading || matches.loading;
  const error = player.error ?? ranked.error ?? matches.error;
  const realLoaded = !!player.data && !error && !isLoading;

  const riotIdLabel = player.data
    ? `${player.data.gameName}#${player.data.tagLine}`
    : memory.gameName
      ? `${memory.gameName}#${memory.tagLine}`
      : undefined;

  const banner = (() => {
    if (!memory.gameName) {
      return (
        <StatusBanner
          empty
          emptyMessage="Informe seu Riot ID na busca acima para carregar dados reais."
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
          loadingMessage={`Carregando ${memory.gameName}#${memory.tagLine} (${memory.platform})…`}
        />
      );
    }
    if (realLoaded && player.data) {
      return (
        <StatusBanner
          success
          successMessage={`Dados reais carregados para ${player.data.gameName}#${player.data.tagLine} · ${matches.data?.length ?? 0} partidas · ${ranked.data?.entries.length ?? 0} entradas ranked.`}
        />
      );
    }
    return null;
  })();

  return (
    <GameShell
      game="tft"
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

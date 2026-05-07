import { useEffect } from "react";
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

  async function handleSubmit(value: RiotIdSearchValue) {
    setMemory(value);
    const p = await player.run(value.gameName, value.tagLine, {
      platform: value.platform,
      cluster: value.cluster
    });
    if (!p) return;
    await Promise.allSettled([
      ranked.run(p.puuid, { platform: value.platform }),
      matches.run(p.puuid, { cluster: value.cluster, count: 6 })
    ]);
  }

  useEffect(() => {
    if (memory.gameName) handleSubmit(memory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const model = buildTftModel({
    player: player.data,
    ranked: ranked.data,
    matches: matches.data
  });

  const riotIdLabel = player.data ? `${player.data.gameName}#${player.data.tagLine}` : memory.gameName ? `${memory.gameName}#${memory.tagLine}` : undefined;

  const banner = (() => {
    if (!memory.gameName) {
      return <StatusBanner empty emptyMessage="Informe seu Riot ID na busca acima para carregar dados reais." />;
    }
    if (player.error || ranked.error || matches.error) {
      return <StatusBanner error={player.error ?? ranked.error ?? matches.error} />;
    }
    if (player.loading || ranked.loading || matches.loading) {
      return <StatusBanner loading />;
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
          loading={player.loading}
        />
      }
    />
  );
}

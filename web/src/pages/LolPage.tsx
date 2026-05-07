import { useEffect } from "react";
import GameShell from "@/components/game/GameShell";
import RiotIdSearch, { type RiotIdSearchValue } from "@/components/RiotIdSearch";
import StatusBanner from "@/components/StatusBanner";
import { lolApi } from "@/api/endpoints";
import { useApi } from "@/lib/useApi";
import { useRiotIdMemory } from "@/lib/useRiotIdMemory";
import { buildLolModel } from "@/lib/buildGameModel";

export default function LolPage() {
  const [memory, setMemory] = useRiotIdMemory("lol");
  const player = useApi(lolApi.playerByRiotId);
  const ranked = useApi(lolApi.ranked);
  const matches = useApi(lolApi.recentMatches);

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
    if (memory.gameName) {
      handleSubmit(memory);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const model = buildLolModel({
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
      game="lol"
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

import { useEffect } from "react";
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

  async function handleSubmit(value: RiotIdSearchValue) {
    setMemory(value);
    const acc = await account.run(value.gameName, value.tagLine, { cluster: value.cluster });
    await leaderboard.run({ cluster: value.cluster });
    if (!acc) return;
    await matches.run(acc.puuid, { cluster: value.cluster });
  }

  useEffect(() => {
    if (memory.gameName) {
      handleSubmit(memory);
    } else {
      leaderboard.run({ cluster: memory.cluster });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const model = buildLorModel({ matches: matches.data, leaderboard: leaderboard.data });

  const riotIdLabel = account.data
    ? `${account.data.gameName}#${account.data.tagLine}`
    : memory.gameName
      ? `${memory.gameName}#${memory.tagLine}`
      : undefined;

  const banner = (() => {
    if (account.error || matches.error || leaderboard.error) {
      return <StatusBanner error={account.error ?? matches.error ?? leaderboard.error} />;
    }
    if (account.loading || matches.loading || leaderboard.loading) {
      return <StatusBanner loading />;
    }
    if (!memory.gameName && leaderboard.data) {
      return (
        <StatusBanner
          empty
          emptyMessage="Leaderboard Master carregada. Informe seu Riot ID para buscar suas partidas pessoais."
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
          loading={account.loading || matches.loading}
        />
      }
    />
  );
}

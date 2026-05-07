import { useEffect } from "react";
import GameShell from "@/components/game/GameShell";
import RiotIdSearch, { type RiotIdSearchValue } from "@/components/RiotIdSearch";
import StatusBanner from "@/components/StatusBanner";
import { accountApi, valorantApi } from "@/api/endpoints";
import { useApi } from "@/lib/useApi";
import { useRiotIdMemory } from "@/lib/useRiotIdMemory";
import { buildValorantModel } from "@/lib/buildGameModel";

export default function ValorantPage() {
  const [memory, setMemory] = useRiotIdMemory("valorant");
  const account = useApi(accountApi.byRiotId);
  const history = useApi(valorantApi.matchHistory);

  async function handleSubmit(value: RiotIdSearchValue) {
    setMemory(value);
    const acc = await account.run(value.gameName, value.tagLine, { cluster: value.cluster });
    if (!acc) return;
    await history.run(acc.puuid, { platform: value.platform });
  }

  useEffect(() => {
    if (memory.gameName) handleSubmit(memory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const model = buildValorantModel({ history: history.data });

  const riotIdLabel = account.data
    ? `${account.data.gameName}#${account.data.tagLine}`
    : memory.gameName
      ? `${memory.gameName}#${memory.tagLine}`
      : undefined;

  const banner = (() => {
    if (!memory.gameName) {
      return (
        <StatusBanner
          empty
          emptyMessage="Informe seu Riot ID. Os endpoints de Valorant exigem chave de produção da Riot — chaves dev geralmente retornam 403."
        />
      );
    }
    if (account.error || history.error) {
      return <StatusBanner error={account.error ?? history.error} />;
    }
    if (account.loading || history.loading) {
      return <StatusBanner loading />;
    }
    return null;
  })();

  return (
    <GameShell
      game="valorant"
      model={model}
      riotIdLabel={riotIdLabel}
      banner={banner}
      searchSlot={
        <RiotIdSearch
          variant="inline"
          defaults={memory}
          onSubmit={handleSubmit}
          loading={account.loading || history.loading}
        />
      }
    />
  );
}

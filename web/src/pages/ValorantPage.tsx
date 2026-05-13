import GameShell from "@/components/game/GameShell";
import RiotIdSearch, { type RiotIdSearchValue } from "@/components/RiotIdSearch";
import { useRiotIdMemory } from "@/lib/useRiotIdMemory";
import { buildValorantModel } from "@/lib/buildGameModel";

/**
 * Página de Valorant em modo demonstração — o backend integra com a Riot Games,
 * mas a chave de produção ainda está pendente de aprovação. O Riot ID digitado
 * é refletido nos cartões usando dados fictícios. A mensagem "chave pendente"
 * fica no banner global do HubLayout, então aqui ficamos sem banner extra.
 */
export default function ValorantPage() {
  const [memory, setMemory] = useRiotIdMemory("valorant");

  function handleSubmit(value: RiotIdSearchValue) {
    setMemory(value);
  }

  const model = buildValorantModel({
    displayName: memory.gameName || undefined,
    displayTag: memory.gameName ? memory.tagLine : undefined,
    displayPlatform: memory.gameName ? memory.platform : undefined
  });

  const riotIdLabel = memory.gameName ? `${memory.gameName}#${memory.tagLine}` : undefined;

  return (
    <GameShell
      game="valorant"
      model={model}
      riotIdLabel={riotIdLabel}
      searchSlot={
        <RiotIdSearch
          variant="inline"
          defaults={memory}
          onSubmit={handleSubmit}
        />
      }
    />
  );
}

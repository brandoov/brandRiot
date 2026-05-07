import GameShell from "@/components/game/GameShell";
import RiotIdSearch, { type RiotIdSearchValue } from "@/components/RiotIdSearch";
import { useRiotIdMemory } from "@/lib/useRiotIdMemory";
import { buildValorantModel } from "@/lib/buildGameModel";

/**
 * Página de Valorant em modo **demonstração**: não chama os endpoints da Riot
 * porque val-* exige chave de produção. O Riot ID digitado é refletido nos
 * cartões usando dados fictícios — pronto para ser usado em screenshots
 * anexados ao formulário de aprovação do production key.
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

  const banner = (
    <div
      style={{
        borderRadius: 10,
        padding: "12px 16px",
        fontSize: 13,
        border: "1px dashed rgba(255, 70, 85, 0.45)",
        background: "rgba(255, 70, 85, 0.06)",
        color: "var(--text-1)",
        display: "flex",
        alignItems: "center",
        gap: 12
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#ff4655",
          flexShrink: 0
        }}
      />
      <div style={{ display: "grid", gap: 2 }}>
        <strong style={{ color: "#ff8a95" }}>Modo demonstração — chave de produção pendente</strong>
        <span style={{ fontSize: 12, color: "var(--text-2)" }}>
          Os endpoints <code>val-match-v1</code>, <code>val-content-v1</code> e <code>val-ranked-v1</code> só funcionam com
          chave de produção da Riot. Esta página exibe dados fictícios para demonstrar a integração no formulário de
          aprovação. Após aprovação, basta substituir o build do model pelos dados reais.
        </span>
      </div>
    </div>
  );

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
        />
      }
    />
  );
}

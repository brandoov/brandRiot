import type { GameKey } from "@/lib/gameKey";
import type { AnyMatchMock, LolMatchMock, LorMatchMock, TftMatchMock, ValMatchMock } from "@/data/mock";

interface Props {
  match: AnyMatchMock;
  game: GameKey;
  compact?: boolean;
}

export default function MatchRow({ match: m, game, compact }: Props) {
  const isTFT = game === "tft";
  const isVAL = game === "valorant";
  const isLoR = game === "lor";

  let win = false;
  if (isTFT) {
    win = (m as TftMatchMock).placement <= 4;
  } else if (isLoR) {
    win = (m as LorMatchMock).win;
  } else if (isVAL) {
    win = (m as ValMatchMock).win;
  } else {
    win = (m as LolMatchMock).win;
  }

  let primary = "";
  let secondary = "";
  let tertiary = "";

  if (game === "lol") {
    const lm = m as LolMatchMock;
    primary = lm.champ;
    secondary = lm.role;
    tertiary = `${lm.kda} · ${lm.cs} CS`;
  } else if (isVAL) {
    const vm = m as ValMatchMock;
    primary = vm.agent;
    secondary = vm.map;
    tertiary = `${vm.kda} · ${vm.score}`;
  } else if (isTFT) {
    const tm = m as TftMatchMock;
    primary = tm.comp;
    secondary = `${tm.placement}º`;
    tertiary = `Lvl ${tm.level} · ${tm.gold}g`;
  } else {
    const lr = m as LorMatchMock;
    primary = lr.deck;
    secondary = lr.archetype;
    tertiary = `${lr.turns} turnos`;
  }

  const placement = isTFT ? (m as TftMatchMock).placement : 0;
  const result = isTFT
    ? placement <= 4
      ? "TOP 4"
      : "BOT 4"
    : win
      ? "VITÓRIA"
      : "DERROTA";
  const resultClass = isTFT
    ? placement === 1
      ? "chip-accent"
      : placement <= 4
        ? "chip-win"
        : "chip-loss"
    : win
      ? "chip-win"
      : "chip-loss";

  const lpDisplay = isVAL ? (m as ValMatchMock).rr : (m as LolMatchMock | TftMatchMock | LorMatchMock).lp;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: compact
          ? "88px 32px minmax(0, 1fr) auto auto auto"
          : "100px 36px minmax(0, 1.2fr) minmax(0, 1fr) auto auto",
        gap: 14,
        alignItems: "center",
        padding: compact ? "10px 0" : "14px 16px",
        background: compact ? "transparent" : "var(--bg-2)",
        border: compact ? "none" : "1px solid var(--line)",
        borderLeft: `3px solid ${win || (isTFT && placement <= 4) ? "var(--accent)" : "rgba(255,138,149,0.6)"}`,
        borderRadius: compact ? 0 : 10
      }}
    >
      <span className={`chip ${resultClass}`} style={{ justifyContent: "center" }}>
        {result}
      </span>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: "linear-gradient(135deg, var(--accent), var(--accent-deep))",
          display: "grid",
          placeItems: "center",
          color: "#0a0a0d",
          fontSize: 11,
          fontWeight: 700
        }}
      >
        {primary.slice(0, 2).toUpperCase()}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {primary}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--text-2)",
            marginTop: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {secondary} · {m.mode}
        </div>
      </div>
      <div
        className="font-mono"
        style={{
          fontSize: 12,
          color: "var(--text-1)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minWidth: 0
        }}
      >
        {tertiary}
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: lpDisplay && lpDisplay.startsWith("+") ? "#4adfa0" : "#ff8a95"
        }}
      >
        {lpDisplay}
      </div>
      <div
        style={{
          fontSize: 11,
          color: "var(--text-2)",
          textAlign: "right",
          whiteSpace: "nowrap"
        }}
      >
        {m.duration} · {m.when}
      </div>
    </div>
  );
}

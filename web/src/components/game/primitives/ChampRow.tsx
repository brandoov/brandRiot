import type { GameKey } from "@/lib/gameKey";
import type { ChampPoolItem, CompPoolItem, DeckPoolItem, PoolItem } from "@/data/mock";

interface Props {
  item: PoolItem;
  game: GameKey;
  rank: number;
}

function isComp(item: PoolItem): item is CompPoolItem {
  return "top4" in item;
}
function isDeck(item: PoolItem): item is DeckPoolItem {
  return "archetype" in item;
}

export default function ChampRow({ item, game, rank }: Props) {
  const isTFT = game === "tft";
  const isLoR = game === "lor";

  const primaryStat = isTFT && isComp(item)
    ? `${item.top4}% top4`
    : isLoR && isDeck(item)
      ? `${item.wr}% WR`
      : `${(item as ChampPoolItem).wr}% WR`;

  const secondaryStat = isTFT && isComp(item)
    ? `Avg ${item.avg}`
    : isLoR && isDeck(item)
      ? item.archetype
      : `${(item as ChampPoolItem).kda} KDA`;

  const barWidth = isTFT && isComp(item) ? item.top4 : (item as ChampPoolItem | DeckPoolItem).wr;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "20px 32px 1fr auto",
        gap: 12,
        alignItems: "center",
        padding: "6px 0"
      }}
    >
      <div className="kbd" style={{ color: "var(--text-3)" }}>0{rank}</div>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: `linear-gradient(135deg, ${item.color}, ${item.color}66)`,
          display: "grid",
          placeItems: "center",
          fontSize: 11,
          fontWeight: 700,
          color: "#0a0a0d",
          letterSpacing: "0.05em"
        }}
      >
        {item.name.slice(0, 2).toUpperCase()}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {item.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <div className="bar" style={{ flex: 1, maxWidth: 100 }}>
            <span style={{ width: `${barWidth}%` }} />
          </div>
          <div style={{ fontSize: 10, color: "var(--text-2)" }}>{item.games} jogos</div>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--accent-2)" }}>{primaryStat}</div>
        <div style={{ fontSize: 10, color: "var(--text-2)", marginTop: 2 }}>{secondaryStat}</div>
      </div>
    </div>
  );
}

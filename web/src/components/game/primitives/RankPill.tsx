interface Props {
  tier: string;
  division: string;
  lp: number;
  mini?: boolean;
}

const TIER_COLORS: Record<string, string> = {
  IRON: "#5c5c5c",
  BRONZE: "#9a6a3c",
  SILVER: "#a0a8b4",
  GOLD: "#c8aa6e",
  PLATINUM: "#3eb8af",
  EMERALD: "#3eb86c",
  DIAMOND: "#5b9be0",
  MASTER: "#a85bd1",
  GRANDMASTER: "#d14b4b",
  CHALLENGER: "#e6d28a",
  IMMORTAL: "#a85bd1",
  RADIANT: "#e6d28a"
};

export default function RankPill({ tier, division, lp, mini = false }: Props) {
  const color = TIER_COLORS[tier.toUpperCase()] ?? "#888";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: mini ? "4px 10px" : "8px 14px",
        borderRadius: 999,
        background: `linear-gradient(90deg, ${color}24, transparent)`,
        border: `1px solid ${color}55`
      }}
    >
      <div
        style={{
          width: mini ? 18 : 28,
          height: mini ? 18 : 28,
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${color}, ${color}66)`,
          boxShadow: `0 0 12px ${color}44`
        }}
      />
      <div>
        <div style={{ fontSize: mini ? 11 : 13, fontWeight: 600, letterSpacing: "0.04em", color }}>
          {tier} {division}
        </div>
        {!mini && <div className="kbd" style={{ fontSize: 9 }}>{lp} LP</div>}
      </div>
    </div>
  );
}

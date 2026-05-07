interface Props {
  label: string;
  value: string | number;
  delta?: number | null;
  sub?: string;
  big?: boolean;
}

export default function Stat({ label, value, delta, sub, big = false }: Props) {
  return (
    <div>
      <div className="kbd">{label}</div>
      <div
        style={{
          fontSize: big ? 38 : 24,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          marginTop: 4,
          fontFamily: "var(--game-font)",
          color: "var(--text-0)",
          lineHeight: 1
        }}
      >
        {value}
      </div>
      {(delta != null || sub) && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 11 }}>
          {delta != null && (
            <span
              style={{
                color: delta > 0 ? "#4adfa0" : delta < 0 ? "#ff8a95" : "var(--text-2)",
                fontWeight: 500
              }}
            >
              {delta > 0 ? "↑" : delta < 0 ? "↓" : "·"} {Math.abs(delta)}
              {Math.abs(delta) < 100 ? "%" : ""}
            </span>
          )}
          {sub && <span style={{ color: "var(--text-2)" }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}

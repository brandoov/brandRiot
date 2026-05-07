import Sparkline from "./Sparkline";

interface Props {
  title: string;
  value: string | number;
  delta?: number | null;
  sub?: string;
  spark?: number[];
  pulse?: boolean;
}

export default function KPI({ title, value, delta, sub, spark, pulse }: Props) {
  return (
    <div className="card" style={{ padding: 18, position: "relative", overflow: "hidden" }}>
      <div className="kbd">{title}</div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 10 }}>
        <div>
          <div
            className="font-game"
            style={{
              fontSize: 32,
              fontWeight: 600,
              lineHeight: 1,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            {value}
            {pulse && (
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  animation: "pulse-soft 1.6s ease-in-out infinite"
                }}
              />
            )}
          </div>
          {(delta != null || sub) && (
            <div style={{ marginTop: 8, fontSize: 11, color: "var(--text-2)" }}>
              {delta != null && (
                <span
                  style={{
                    color: delta > 0 ? "#4adfa0" : "#ff8a95",
                    marginRight: 8,
                    fontWeight: 500
                  }}
                >
                  {delta > 0 ? "↑" : "↓"} {Math.abs(delta)}%
                </span>
              )}
              {sub}
            </div>
          )}
        </div>
        {spark && <Sparkline data={spark} w={70} h={30} />}
      </div>
    </div>
  );
}

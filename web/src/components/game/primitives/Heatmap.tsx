interface Props {
  data: number[][];
  label?: string;
  mapName?: string;
}

export default function Heatmap({ data, label = "Mapa de calor", mapName = "Summoner's Rift" }: Props) {
  if (data.length === 0) return null;
  const rows = data.length;
  const cols = data[0].length;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div className="kbd">{label}</div>
        <div className="kbd" style={{ color: "var(--accent-2)" }}>
          {mapName}
        </div>
      </div>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1",
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--accent-bg) 60%, var(--bg-2)), var(--bg-2))",
          borderRadius: 10,
          overflow: "hidden",
          border: "1px solid var(--line)"
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${cols * 10} ${rows * 10}`}
          style={{ position: "absolute", inset: 0 }}
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="hm-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hm-grid)" />
          <path d={`M 0 ${rows * 10} L ${cols * 10} 0`} stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
          <path d={`M 0 0 L ${cols * 10} ${rows * 10}`} stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
          {data.flatMap((row, y) =>
            row.map((v, x) =>
              v > 0.05 ? (
                <circle
                  key={`${x}-${y}`}
                  cx={x * 10 + 5}
                  cy={y * 10 + 5}
                  r={v * 8}
                  fill="var(--accent)"
                  opacity={0.18 + v * 0.6}
                  style={{ filter: "blur(1.5px)" }}
                />
              ) : null
            )
          )}
        </svg>
      </div>
    </div>
  );
}

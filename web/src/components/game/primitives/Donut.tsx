export interface DonutSlice {
  value: number;
  color: string;
}

interface Props {
  data: DonutSlice[];
  size?: number;
  label?: string;
  value?: string | number;
}

export default function Donut({ data, size = 140, label, value }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;
  let acc = 0;

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size}>
        {data.map((d, i) => {
          const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
          acc += d.value;
          const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
          const large = end - start > Math.PI ? 1 : 0;
          const x1 = cx + r * Math.cos(start);
          const y1 = cy + r * Math.sin(start);
          const x2 = cx + r * Math.cos(end);
          const y2 = cy + r * Math.sin(end);
          return (
            <path
              key={i}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
              fill={d.color}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={r * 0.65} fill="var(--bg-1)" />
      </svg>
      {label && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            pointerEvents: "none"
          }}
        >
          <div>
            <div className="font-game" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1 }}>
              {value}
            </div>
            <div className="kbd" style={{ marginTop: 4 }}>
              {label}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

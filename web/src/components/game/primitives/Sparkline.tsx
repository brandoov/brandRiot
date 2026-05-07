interface Props {
  data: number[];
  w?: number;
  h?: number;
  color?: string;
  fill?: boolean;
  dots?: boolean;
}

export default function Sparkline({ data, w = 120, h = 36, color, fill = true, dots = false }: Props) {
  if (data.length === 0) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = data.length > 1 ? w / (data.length - 1) : w;
  const pts: [number, number][] = data.map((v, i) => [i * stepX, h - ((v - min) / range) * (h - 4) - 2]);
  const path = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  const c = color || "var(--accent)";
  const id = `spark-${Math.abs(data.reduce((a, b) => a + b, 0)).toString(36)}-${data.length}`;

  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      {fill && (
        <>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={c} stopOpacity="0.32" />
              <stop offset="100%" stopColor={c} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${id})`} />
        </>
      )}
      <path d={path} fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      {dots &&
        pts.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 3 : 0} fill={c} />
        ))}
    </svg>
  );
}

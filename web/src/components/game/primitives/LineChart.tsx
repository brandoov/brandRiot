export interface LineSeries {
  data: number[];
  color: string;
}

interface Props {
  series: LineSeries[];
  w?: number;
  h?: number;
  yLabel?: string;
  xLabels?: string[];
}

export default function LineChart({ series, w = 600, h = 220, yLabel, xLabels = [] }: Props) {
  if (series.length === 0 || series[0].data.length === 0) return null;
  const allValues = series.flatMap((s) => s.data);
  const min = Math.min(...allValues, 0);
  const max = Math.max(...allValues);
  const range = max - min || 1;
  const padL = 36;
  const padR = 16;
  const padT = 16;
  const padB = 28;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;
  const denom = Math.max(series[0].data.length - 1, 1);
  const xStep = chartW / denom;
  const yTicks = 4;

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
      {Array.from({ length: yTicks + 1 }, (_, i) => {
        const y = padT + (chartH / yTicks) * i;
        const val = max - (range / yTicks) * i;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="var(--line)" strokeDasharray="2 4" />
            <text
              x={padL - 8}
              y={y + 3}
              fill="var(--text-2)"
              fontSize="10"
              textAnchor="end"
              fontFamily="var(--body-font)"
            >
              {Math.round(val)}
            </text>
          </g>
        );
      })}
      {xLabels.map((lbl, i) => (
        <text
          key={i}
          x={padL + i * xStep}
          y={h - 8}
          fill="var(--text-2)"
          fontSize="10"
          textAnchor="middle"
          fontFamily="var(--body-font)"
        >
          {lbl}
        </text>
      ))}
      {series.map((s, si) => {
        const pts: [number, number][] = s.data.map((v, i) => [
          padL + i * xStep,
          padT + chartH - ((v - min) / range) * chartH
        ]);
        const path = pts.map(([x, y], i) => `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
        return (
          <g key={si}>
            <path d={path} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map(([x, y], i) => (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={i === pts.length - 1 ? 4 : 2.5}
                fill={s.color}
                stroke="var(--bg-1)"
                strokeWidth="1.5"
              />
            ))}
          </g>
        );
      })}
      {yLabel && (
        <text x={padL} y={padT - 4} fill="var(--text-2)" fontSize="10" fontFamily="var(--body-font)">
          {yLabel}
        </text>
      )}
    </svg>
  );
}

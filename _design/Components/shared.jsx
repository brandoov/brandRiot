// shared.jsx — sidebar, topbar, sparkline, bars, mini chart primitives
// Globals: window.Sidebar, window.Topbar, window.Sparkline, window.RankPill,
//          window.Stat, window.Heatmap, window.Donut, window.LineChart, window.GameLogo

const { useState, useEffect, useRef, useMemo } = React;

// ---------- inline SVG icons ----------
const Icon = ({ d, size = 16, stroke = 1.6 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {d}
  </svg>
);
const Icons = {
  home:    <Icon d={<><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></>} />,
  history: <Icon d={<><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>} />,
  chart:   <Icon d={<><path d="M3 21h18"/><path d="M6 17v-6"/><path d="M11 17V7"/><path d="M16 17v-9"/><path d="M21 17v-3"/></>} />,
  spark:   <Icon d={<><path d="M3 17l5-7 4 4 8-10"/></>} />,
  brain:   <Icon d={<><path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-2 3 3 3 0 0 0 2 3v1a3 3 0 0 0 3 3h1V4H9z"/><path d="M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 2 3 3 3 0 0 1-2 3v1a3 3 0 0 1-3 3h-1V4h1z"/></>} />,
  trophy:  <Icon d={<><path d="M8 4h8v4a4 4 0 0 1-8 0V4z"/><path d="M8 6H5a3 3 0 0 0 3 3"/><path d="M16 6h3a3 3 0 0 1-3 3"/><path d="M12 12v4"/><path d="M9 20h6"/></>} />,
  search:  <Icon d={<><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></>} />,
  bell:    <Icon d={<><path d="M6 16V11a6 6 0 0 1 12 0v5"/><path d="M4 16h16"/><path d="M10 20a2 2 0 0 0 4 0"/></>} />,
  filter:  <Icon d={<><path d="M3 5h18"/><path d="M6 12h12"/><path d="M10 19h4"/></>} />,
  swords:  <Icon d={<><path d="M14 4h6v6"/><path d="M20 4l-8 8"/><path d="M4 20l5-5"/><path d="M14 20h6v-6"/><path d="M20 20l-8-8"/><path d="M4 4l5 5"/></>} />,
  meta:    <Icon d={<><circle cx="12" cy="12" r="3"/><path d="M12 3v3"/><path d="M12 18v3"/><path d="M3 12h3"/><path d="M18 12h3"/><path d="M5.6 5.6l2.1 2.1"/><path d="M16.3 16.3l2.1 2.1"/><path d="M5.6 18.4l2.1-2.1"/><path d="M16.3 7.7l2.1-2.1"/></>} />,
  flame:   <Icon d={<><path d="M12 2c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-3 2-6 1 2 3 2 3-4z"/></>} />,
  arrow:   <Icon d={<><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></>} />,
};

// ---------- Game logos (custom SVG marks) ----------
function GameLogo({ game, size = 24 }) {
  const s = size;
  if (game === 'lol') return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M16 3l11 6.5v13L16 29 5 22.5v-13L16 3z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M16 7.5l7 4v9l-7 4-7-4v-9l7-4z" stroke="currentColor" strokeWidth="1.2" opacity="0.7"/>
      <circle cx="16" cy="16" r="2.5" fill="currentColor"/>
    </svg>
  );
  if (game === 'valorant') return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M3 6l11 14h-5L3 11V6z" fill="currentColor"/>
      <path d="M29 6L18 20h-3l8-10 6-4z" fill="currentColor"/>
      <path d="M14 22h4l1 4h-6l1-4z" fill="currentColor" opacity="0.8"/>
    </svg>
  );
  if (game === 'tft') return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M16 3l13 7.5v11L16 29 3 21.5v-11L16 3z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M16 9l7 4v6l-7 4-7-4v-6l7-4z" fill="currentColor" opacity="0.25"/>
      <circle cx="16" cy="16" r="2" fill="currentColor"/>
      <circle cx="11" cy="13" r="1.2" fill="currentColor"/>
      <circle cx="21" cy="13" r="1.2" fill="currentColor"/>
      <circle cx="11" cy="19" r="1.2" fill="currentColor"/>
      <circle cx="21" cy="19" r="1.2" fill="currentColor"/>
    </svg>
  );
  if (game === 'lor') return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <rect x="6" y="3" width="20" height="26" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M16 8v16M10 11h12M10 21h12" stroke="currentColor" strokeWidth="1" opacity="0.6"/>
      <path d="M16 13l2 3-2 3-2-3 2-3z" fill="currentColor"/>
    </svg>
  );
  return null;
}
window.GameLogo = GameLogo;

// ---------- Sidebar ----------
function Sidebar({ game, current = 'overview', onNav, gameMeta }) {
  const items = [
    { id: 'overview', label: 'Visão geral', icon: Icons.home },
    { id: 'matches',  label: 'Partidas',     icon: Icons.history },
    { id: 'reports',  label: 'Relatórios',   icon: Icons.chart },
    { id: 'meta',     label: 'Meta',         icon: Icons.meta },
    { id: 'ai',       label: 'Análise IA',   icon: Icons.brain },
  ];
  return (
    <aside style={{
      width: 232, flexShrink: 0,
      background: 'var(--bg-1)', borderRight: '1px solid var(--line)',
      display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh',
    }}>
      <div style={{ padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--line)' }}>
        <div style={{ width: 28, height: 28, borderRadius: 6,
          background: 'var(--accent)', color: 'var(--accent-bg)',
          display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14 }}>
          bR
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.02em' }}>brandRiot</div>
          <div className="kbd">Companion</div>
        </div>
      </div>

      <a href="index.html" style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px',
        textDecoration: 'none', color: 'var(--text-1)', borderBottom: '1px solid var(--line)',
        fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase',
      }}>
        <span style={{ transform: 'rotate(180deg)' }}>{Icons.arrow}</span>
        <span>Trocar de jogo</span>
      </a>

      <div style={{
        padding: '20px 18px', borderBottom: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ color: 'var(--accent)', flexShrink: 0 }}><GameLogo game={game} size={28} /></div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="font-game" style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent-2)', letterSpacing: '0.02em', lineHeight: 1.15, wordBreak: 'break-word' }}>
            {gameMeta.name}
          </div>
          <div className="kbd" style={{ fontSize: 9, marginTop: 2 }}>{gameMeta.region}</div>
        </div>
      </div>

      <nav style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(item => {
          const active = current === item.id;
          return (
            <button key={item.id} onClick={() => onNav?.(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 8, border: 0, cursor: 'pointer',
                background: active ? 'color-mix(in oklab, var(--accent) 14%, transparent)' : 'transparent',
                color: active ? 'var(--accent-2)' : 'var(--text-1)',
                fontSize: 13, fontWeight: active ? 600 : 500, fontFamily: 'inherit',
                textAlign: 'left', position: 'relative',
              }}>
              {active && <span style={{
                position: 'absolute', left: 0, top: 8, bottom: 8, width: 2,
                background: 'var(--accent)', borderRadius: 2,
              }} />}
              <span style={{ color: active ? 'var(--accent)' : 'var(--text-2)' }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', padding: 16, borderTop: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))',
            display: 'grid', placeItems: 'center', color: '#0a0a0d', fontWeight: 700, fontSize: 13,
          }}>R7</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>RiotZera #BR1</div>
            <div className="kbd" style={{ fontSize: 9 }}>Conectado · API v5</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
window.Sidebar = Sidebar;

// ---------- Topbar ----------
function Topbar({ title, subtitle, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '24px 36px', borderBottom: '1px solid var(--line)',
      position: 'sticky', top: 0, zIndex: 5,
      background: 'color-mix(in oklab, var(--bg-0) 80%, transparent)',
      backdropFilter: 'blur(12px)',
    }}>
      <div>
        <div className="kbd" style={{ marginBottom: 6 }}>{subtitle}</div>
        <h1 className="font-game" style={{
          margin: 0, fontSize: 28, fontWeight: 600,
          letterSpacing: '0.01em', color: 'var(--text-0)',
        }}>{title}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {right}
        <button className="btn btn-ghost" style={{ padding: 9, width: 38, height: 38, justifyContent: 'center' }}>
          {Icons.search}
        </button>
        <button className="btn btn-ghost" style={{ padding: 9, width: 38, height: 38, justifyContent: 'center', position: 'relative' }}>
          {Icons.bell}
          <span style={{
            position: 'absolute', top: 8, right: 8, width: 6, height: 6,
            borderRadius: '50%', background: 'var(--accent)',
          }} />
        </button>
      </div>
    </div>
  );
}
window.Topbar = Topbar;

// ---------- Sparkline ----------
function Sparkline({ data, w = 120, h = 36, color, fill = true, dots = false }) {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const stepX = w / (data.length - 1);
  const pts = data.map((v, i) => [i * stepX, h - ((v - min) / range) * (h - 4) - 2]);
  const path = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  const c = color || 'var(--accent)';
  return (
    <svg width={w} height={h} style={{ display: 'block', overflow: 'visible' }}>
      {fill && (<>
        <defs>
          <linearGradient id={`spark-${data.join('-').slice(0, 12)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c} stopOpacity="0.32"/>
            <stop offset="100%" stopColor={c} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#spark-${data.join('-').slice(0, 12)})`} />
      </>)}
      <path d={path} fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      {dots && pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 3 : 0} fill={c}/>
      ))}
    </svg>
  );
}
window.Sparkline = Sparkline;

// ---------- RankPill ----------
function RankPill({ tier, division, lp, mini = false }) {
  const colors = {
    'IRON': '#5c5c5c', 'BRONZE': '#9a6a3c', 'SILVER': '#a0a8b4',
    'GOLD': '#c8aa6e', 'PLATINUM': '#3eb8af', 'EMERALD': '#3eb86c',
    'DIAMOND': '#5b9be0', 'MASTER': '#a85bd1', 'GRANDMASTER': '#d14b4b', 'CHALLENGER': '#e6d28a',
  };
  const c = colors[tier.toUpperCase()] || '#888';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: mini ? '4px 10px' : '8px 14px',
      borderRadius: 999,
      background: `linear-gradient(90deg, ${c}24, transparent)`,
      border: `1px solid ${c}55`,
    }}>
      <div style={{
        width: mini ? 18 : 28, height: mini ? 18 : 28, borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${c}, ${c}66)`,
        boxShadow: `0 0 12px ${c}44`,
      }} />
      <div>
        <div style={{ fontSize: mini ? 11 : 13, fontWeight: 600, letterSpacing: '0.04em', color: c }}>
          {tier} {division}
        </div>
        {!mini && <div className="kbd" style={{ fontSize: 9 }}>{lp} LP</div>}
      </div>
    </div>
  );
}
window.RankPill = RankPill;

// ---------- Stat block ----------
function Stat({ label, value, delta, sub, big = false }) {
  return (
    <div>
      <div className="kbd">{label}</div>
      <div style={{
        fontSize: big ? 38 : 24, fontWeight: 600, letterSpacing: '-0.02em',
        marginTop: 4, fontFamily: 'var(--game-font)', color: 'var(--text-0)',
        lineHeight: 1,
      }}>{value}</div>
      {(delta != null || sub) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 11 }}>
          {delta != null && (
            <span style={{
              color: delta > 0 ? '#4adfa0' : delta < 0 ? '#ff8a95' : 'var(--text-2)',
              fontWeight: 500,
            }}>
              {delta > 0 ? '↑' : delta < 0 ? '↓' : '·'} {Math.abs(delta)}{typeof delta === 'number' && Math.abs(delta) < 100 ? '%' : ''}
            </span>
          )}
          {sub && <span style={{ color: 'var(--text-2)' }}>{sub}</span>}
        </div>
      )}
    </div>
  );
}
window.Stat = Stat;

// ---------- Heatmap ----------
function Heatmap({ data, label = 'Mapa de calor', mapName = 'Summoner\'s Rift' }) {
  // data: 2d array of values 0-1
  const rows = data.length, cols = data[0].length;
  const cellSize = 280 / cols;
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div className="kbd">{label}</div>
        <div className="kbd" style={{ color: 'var(--accent-2)' }}>{mapName}</div>
      </div>
      <div style={{
        position: 'relative',
        width: '100%', aspectRatio: '1',
        background: 'linear-gradient(135deg, color-mix(in oklab, var(--accent-bg) 60%, var(--bg-2)), var(--bg-2))',
        borderRadius: 10, overflow: 'hidden',
        border: '1px solid var(--line)',
      }}>
        {/* faux map grid */}
        <svg width="100%" height="100%" viewBox={`0 0 ${cols * 10} ${rows * 10}`}
             style={{ position: 'absolute', inset: 0 }} preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
          {/* lanes (diagonals for SR) */}
          <path d={`M 0 ${rows * 10} L ${cols * 10} 0`} stroke="rgba(255,255,255,0.05)" strokeWidth="1.5"/>
          <path d={`M 0 0 L ${cols * 10} ${rows * 10}`} stroke="rgba(255,255,255,0.05)" strokeWidth="1.5"/>
          {/* data cells */}
          {data.flatMap((row, y) => row.map((v, x) => v > 0.05 && (
            <circle key={`${x}-${y}`}
              cx={x * 10 + 5} cy={y * 10 + 5} r={v * 8}
              fill="var(--accent)" opacity={0.18 + v * 0.6}
              style={{ filter: 'blur(1.5px)' }}
            />
          )))}
        </svg>
      </div>
    </div>
  );
}
window.Heatmap = Heatmap;

// ---------- Donut ----------
function Donut({ data, size = 140, label, value }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let acc = 0;
  const r = size / 2 - 8, cx = size / 2, cy = size / 2;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        {data.map((d, i) => {
          const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
          acc += d.value;
          const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
          const large = end - start > Math.PI ? 1 : 0;
          const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
          const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
          return (
            <path key={i}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
              fill={d.color}/>
          );
        })}
        <circle cx={cx} cy={cy} r={r * 0.65} fill="var(--bg-1)"/>
      </svg>
      {label && (
        <div style={{
          position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
          textAlign: 'center', pointerEvents: 'none',
        }}>
          <div>
            <div className="font-game" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1 }}>{value}</div>
            <div className="kbd" style={{ marginTop: 4 }}>{label}</div>
          </div>
        </div>
      )}
    </div>
  );
}
window.Donut = Donut;

// ---------- LineChart (slightly fancier) ----------
function LineChart({ series, w = 600, h = 220, yLabel, xLabels = [] }) {
  const allValues = series.flatMap(s => s.data);
  const min = Math.min(...allValues, 0);
  const max = Math.max(...allValues);
  const range = max - min || 1;
  const padL = 36, padR = 16, padT = 16, padB = 28;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;
  const xStep = chartW / (series[0].data.length - 1);

  const yTicks = 4;
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      {/* y grid */}
      {Array.from({length: yTicks + 1}, (_, i) => {
        const y = padT + (chartH / yTicks) * i;
        const val = max - (range / yTicks) * i;
        return (
          <g key={i}>
            <line x1={padL} y1={y} x2={w - padR} y2={y} stroke="var(--line)" strokeDasharray="2 4"/>
            <text x={padL - 8} y={y + 3} fill="var(--text-2)" fontSize="10" textAnchor="end" fontFamily="var(--body-font)">
              {Math.round(val)}
            </text>
          </g>
        );
      })}
      {/* x labels */}
      {xLabels.map((lbl, i) => (
        <text key={i} x={padL + i * xStep} y={h - 8} fill="var(--text-2)" fontSize="10" textAnchor="middle" fontFamily="var(--body-font)">
          {lbl}
        </text>
      ))}
      {/* series */}
      {series.map((s, si) => {
        const pts = s.data.map((v, i) => [
          padL + i * xStep,
          padT + chartH - ((v - min) / range) * chartH,
        ]);
        const path = pts.map(([x, y], i) => `${i ? 'L' : 'M'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
        return (
          <g key={si}>
            <path d={path} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            {pts.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 4 : 2.5} fill={s.color} stroke="var(--bg-1)" strokeWidth="1.5"/>
            ))}
          </g>
        );
      })}
      {yLabel && (
        <text x={padL} y={padT - 4} fill="var(--text-2)" fontSize="10" fontFamily="var(--body-font)" className="kbd">{yLabel}</text>
      )}
    </svg>
  );
}
window.LineChart = LineChart;

window.Icons = Icons;

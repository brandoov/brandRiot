// views.jsx — Overview, Matches, Reports, Meta, AI tabs
// Globals: window.OverviewView, MatchesView, ReportsView, MetaView, AIView
// Reads window.DATA, window.GAME_META, window.makeHeatmap, plus shared.jsx globals.

const { useState: vUseState, useMemo: vUseMemo, useEffect: vUseEffect, useRef: vUseRef } = React;

// ============= OVERVIEW =============
function OverviewView({ game }) {
  const d = window.DATA[game];
  const meta = window.GAME_META[game];
  const total = d.rank.wins + d.rank.losses;
  const wr = Math.round((d.rank.wins / total) * 100);

  // game-specific primary stat
  const champLabel = { lol: 'Campeões', valorant: 'Agentes', tft: 'Composições', lor: 'Decks' }[game];
  const pool = { lol: d.champPool, valorant: d.agentPool, tft: d.compPool, lor: d.deckPool }[game];
  const monthsLabel = ['Jun','Jul','Ago','Set','Out','Nov','Dez','Jan','Fev','Mar','Abr','Mai'];

  return (
    <div style={{ padding: '32px 36px', display: 'grid', gap: 24 }}>
      {/* Hero */}
      <div className="card" style={{
        position: 'relative', overflow: 'hidden',
        padding: 28, display: 'grid', gridTemplateColumns: '1fr auto', gap: 24,
        background: `linear-gradient(135deg, color-mix(in oklab, var(--accent-bg) 70%, var(--bg-1)) 0%, var(--bg-1) 60%)`,
        border: '1px solid color-mix(in oklab, var(--accent) 22%, var(--line))',
      }}>
        <div style={{
          position: 'absolute', right: -80, top: -80, width: 360, height: 360,
          background: `radial-gradient(circle, var(--accent-glow), transparent 70%)`,
          filter: 'blur(40px)', pointerEvents: 'none',
        }}/>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span className="chip chip-accent">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }}/>
              EM PARTIDA · há 14 min
            </span>
            <span className="chip">{d.summoner.region}</span>
          </div>
          <h2 className="font-game" style={{
            margin: 0, fontSize: 44, fontWeight: 600, lineHeight: 1,
            color: 'var(--accent-2)', letterSpacing: '0.01em',
          }}>{d.summoner.name}<span style={{ color: 'var(--text-3)', fontSize: 28 }}> #{d.summoner.tag}</span></h2>
          <div style={{ marginTop: 8, color: 'var(--text-2)', fontSize: 13, fontStyle: 'italic' }}>
            "{meta.tagline}"
          </div>

          <div style={{ display: 'flex', gap: 32, marginTop: 28, alignItems: 'flex-end' }}>
            <RankPill tier={d.rank.tier} division={d.rank.division} lp={d.rank.lp}/>
            <Stat label="Vitórias / Derrotas" value={`${d.rank.wins}V ${d.rank.losses}D`} sub={`${wr}% taxa de vitória`}/>
            <Stat label="Nível invocador" value={d.summoner.level}/>
            {game === 'tft' && <Stat label="Top 4 rate" value={`${d.rank.top4}%`} sub="últimas 30"/>}
          </div>
        </div>

        <div style={{
          display: 'grid', gap: 14,
          alignContent: 'center',
          minWidth: 220, position: 'relative', zIndex: 1,
        }}>
          <div className="card-flat" style={{ padding: 14, background: 'rgba(0,0,0,0.25)' }}>
            <div className="kbd" style={{ marginBottom: 8 }}>LP nos últimos 30 dias</div>
            <Sparkline data={d.rankProgression} w={200} h={48} dots/>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--text-2)' }}>
              <span>+{d.rankProgression[d.rankProgression.length-1] - d.rankProgression[0]} LP</span>
              <span>↑ tendência</span>
            </div>
          </div>
          <button className="btn btn-primary" style={{ justifyContent: 'center' }}>
            Ver partida ao vivo {Icons.arrow}
          </button>
        </div>
      </div>

      {/* KPIs row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <KPI title="Taxa de vitória" value={`${wr}%`} delta={+3} spark={d.winRate} />
        <KPI title="KDA médio" value={
          game === 'tft' ? '3.6' : game === 'valorant' ? '1.32' : game === 'lor' ? '—' : '3.4'
        } delta={+8} sub={ game === 'lor' ? 'Vitórias por mulligan: 2.4' : 'últimas 20 partidas' }/>
        <KPI title={ game === 'tft' ? 'Top 4 rate' : 'CS/min' } value={
          game === 'tft' ? '67%' : game === 'valorant' ? 'ACS 248' : game === 'lor' ? 'Turnos/jogo 11.4' : '7.2'
        } delta={+2}/>
        <KPI title="Sequência atual" value="3W" delta={null} sub="melhor da semana" pulse/>
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div className="kbd">Progressão de classificação</div>
              <div className="font-game" style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>Últimos 12 meses</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="chip chip-accent">LP</button>
              <button className="chip">Win rate</button>
              <button className="chip">KDA</button>
            </div>
          </div>
          <LineChart
            series={[
              { data: d.rankProgression, color: 'var(--accent)' },
              { data: d.winRate, color: 'rgba(255,255,255,0.3)' },
            ]}
            xLabels={monthsLabel}
            w={620} h={220}
          />
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div className="kbd">{champLabel} mais jogados</div>
              <div className="font-game" style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>Top 5 do mês</div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {pool.slice(0, 5).map((p, i) => (
              <ChampRow key={i} item={p} game={game} rank={i+1}/>
            ))}
          </div>
        </div>
      </div>

      {/* Recent matches mini */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
          <div>
            <div className="kbd">Atividade recente</div>
            <div className="font-game" style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>Últimas partidas</div>
          </div>
          <button className="btn btn-ghost">Ver todas {Icons.arrow}</button>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          {d.matches.slice(0, 4).map(m => <MatchRow key={m.id} match={m} game={game} compact/>)}
        </div>
      </div>
    </div>
  );
}

function KPI({ title, value, delta, sub, spark, pulse }) {
  return (
    <div className="card" style={{ padding: 18, position: 'relative', overflow: 'hidden' }}>
      <div className="kbd">{title}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 10 }}>
        <div>
          <div className="font-game" style={{
            fontSize: 32, fontWeight: 600, lineHeight: 1,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            {value}
            {pulse && <span style={{
              width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)',
              animation: 'pulse-soft 1.6s ease-in-out infinite',
            }}/>}
          </div>
          {(delta != null || sub) && (
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-2)' }}>
              {delta != null && <span style={{
                color: delta > 0 ? '#4adfa0' : '#ff8a95', marginRight: 8, fontWeight: 500,
              }}>{delta > 0 ? '↑' : '↓'} {Math.abs(delta)}%</span>}
              {sub}
            </div>
          )}
        </div>
        {spark && <Sparkline data={spark} w={70} h={30}/>}
      </div>
    </div>
  );
}

function ChampRow({ item, game, rank }) {
  const isTFT = game === 'tft';
  const isLoR = game === 'lor';
  const primaryStat = isTFT ? `${item.top4}% top4` : isLoR ? `${item.wr}% WR` : `${item.wr}% WR`;
  const secondaryStat = isTFT ? `Avg ${item.avg}` : isLoR ? item.archetype : `${item.kda} KDA`;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '20px 32px 1fr auto', gap: 12,
      alignItems: 'center', padding: '6px 0',
    }}>
      <div className="kbd" style={{ color: 'var(--text-3)' }}>0{rank}</div>
      <div style={{
        width: 32, height: 32, borderRadius: 6,
        background: `linear-gradient(135deg, ${item.color}, ${item.color}66)`,
        display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700,
        color: '#0a0a0d', letterSpacing: '0.05em',
      }}>{item.name.slice(0, 2).toUpperCase()}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <div className="bar" style={{ flex: 1, maxWidth: 100 }}>
            <span style={{ width: `${(item.wr || item.top4)}%` }}/>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-2)' }}>{item.games} jogos</div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-2)' }}>{primaryStat}</div>
        <div style={{ fontSize: 10, color: 'var(--text-2)', marginTop: 2 }}>{secondaryStat}</div>
      </div>
    </div>
  );
}

function MatchRow({ match: m, game, compact }) {
  const isTFT = game === 'tft';
  const isLoR = game === 'lor';
  const isVAL = game === 'valorant';
  const win = m.win != null ? m.win : (m.placement && m.placement <= 4);

  let primary, secondary, tertiary;
  if (game === 'lol')      { primary = m.champ;  secondary = m.role;     tertiary = `${m.kda} · ${m.cs} CS`; }
  else if (isVAL)          { primary = m.agent;  secondary = m.map;      tertiary = `${m.kda} · ${m.score}`; }
  else if (isTFT)          { primary = m.comp;   secondary = `${m.placement}º`; tertiary = `Lvl ${m.level} · ${m.gold}g`; }
  else                     { primary = m.deck;   secondary = m.archetype; tertiary = `${m.turns} turnos`; }

  const result = isTFT ? (m.placement <= 4 ? 'TOP 4' : 'BOT 4') : win ? 'VITÓRIA' : 'DERROTA';
  const resultClass = isTFT ? (m.placement === 1 ? 'chip-accent' : m.placement <= 4 ? 'chip-win' : 'chip-loss')
                            : win ? 'chip-win' : 'chip-loss';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: compact ? '88px 32px minmax(0, 1fr) auto auto auto' : '100px 36px minmax(0, 1.2fr) minmax(0, 1fr) auto auto',
      gap: 14, alignItems: 'center',
      padding: compact ? '10px 0' : '14px 16px',
      background: compact ? 'transparent' : 'var(--bg-2)',
      border: compact ? 'none' : '1px solid var(--line)',
      borderLeft: `3px solid ${win || (isTFT && m.placement <= 4) ? 'var(--accent)' : 'rgba(255,138,149,0.6)'}`,
      borderRadius: compact ? 0 : 10,
    }}>
      <span className={`chip ${resultClass}`} style={{ justifyContent: 'center' }}>{result}</span>
      <div style={{
        width: 32, height: 32, borderRadius: 6,
        background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))',
        display: 'grid', placeItems: 'center', color: '#0a0a0d', fontSize: 11, fontWeight: 700,
      }}>{primary.slice(0, 2).toUpperCase()}</div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{primary}</div>
        <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {secondary} · {m.mode}
        </div>
      </div>
      <div className="font-mono" style={{ fontSize: 12, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{tertiary}</div>
      <div style={{
        fontSize: 12, fontWeight: 600,
        color: (m.lp || '').startsWith('+') ? '#4adfa0' : '#ff8a95',
      }}>{m.lp || m.rr}</div>
      <div style={{ fontSize: 11, color: 'var(--text-2)', textAlign: 'right', whiteSpace: 'nowrap' }}>
        {m.duration} · {m.when}
      </div>
    </div>
  );
}

// ============= MATCHES =============
function MatchesView({ game }) {
  const d = window.DATA[game];
  const [filter, setFilter] = vUseState('all');
  const [selected, setSelected] = vUseState(d.matches[0]);
  const [detailOpen, setDetailOpen] = vUseState(false);
  const filtered = filter === 'all' ? d.matches : d.matches.filter(m =>
    filter === 'wins' ? (m.win || (m.placement && m.placement <= 4)) :
    filter === 'losses' ? !(m.win || (m.placement && m.placement <= 4)) : true
  );

  const openDetail = (m) => { setSelected(m); setDetailOpen(true); };

  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setFilter('all')} className={`chip ${filter === 'all' ? 'chip-accent' : ''}`}>Todas {d.matches.length}</button>
          <button onClick={() => setFilter('wins')} className={`chip ${filter === 'wins' ? 'chip-accent' : ''}`}>Vitórias</button>
          <button onClick={() => setFilter('losses')} className={`chip ${filter === 'losses' ? 'chip-accent' : ''}`}>Derrotas</button>
        </div>
        <button className="btn btn-ghost">{Icons.filter} Filtros</button>
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {filtered.map(m => (
          <button key={m.id} onClick={() => openDetail(m)}
            style={{
              background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
              textAlign: 'left', fontFamily: 'inherit',
              borderRadius: 10,
            }}>
            <MatchRow match={m} game={game}/>
          </button>
        ))}
      </div>

      {/* Drawer */}
      {detailOpen && (
        <div onClick={() => setDetailOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: 520, maxWidth: '95vw', height: '100vh', overflowY: 'auto',
            background: 'var(--bg-1)', borderLeft: '1px solid var(--line-2)',
            boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
          }} className="scroll">
            <div style={{ padding: 24 }}>
              <button onClick={() => setDetailOpen(false)} className="btn btn-ghost" style={{ marginBottom: 16 }}>
                ← Fechar
              </button>
              <MatchDetail match={selected} game={game}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MatchDetail({ match: m, game }) {
  if (!m) return null;
  const isTFT = game === 'tft';
  const isVAL = game === 'valorant';
  const isLoR = game === 'lor';
  const win = m.win != null ? m.win : (m.placement && m.placement <= 4);

  const heatmap = vUseMemo(() => window.makeHeatmap(m.id), [m.id]);

  // build per-game stats
  let stats = [];
  if (game === 'lol') {
    const [k, d2, a] = m.kda.split('/').map(Number);
    stats = [
      { label: 'Abates', value: k },
      { label: 'Mortes', value: d2 },
      { label: 'Assistências', value: a },
      { label: 'CS', value: m.cs },
      { label: 'Dano', value: '24.8k' },
      { label: 'Visão', value: 28 },
    ];
  } else if (isVAL) {
    const [k, d2, a] = m.kda.split('/').map(Number);
    stats = [
      { label: 'Abates', value: k },
      { label: 'Mortes', value: d2 },
      { label: 'Assistências', value: a },
      { label: 'ACS', value: 264 },
      { label: 'HS%', value: '34%' },
      { label: 'First Bloods', value: 4 },
    ];
  } else if (isTFT) {
    stats = [
      { label: 'Colocação', value: `${m.placement}º` },
      { label: 'Nível', value: m.level },
      { label: 'Ouro restante', value: m.gold },
      { label: 'Dano', value: '142' },
      { label: 'Eliminações', value: 3 },
      { label: 'Reroll', value: 18 },
    ];
  } else {
    stats = [
      { label: 'Turnos', value: m.turns },
      { label: 'Mulligans', value: m.mulligan },
      { label: 'Mana usada', value: 38 },
      { label: 'Cartas jogadas', value: 24 },
      { label: 'Dano facial', value: 22 },
      { label: 'Unidades inv.', value: 12 },
    ];
  }

  return (
    <div style={{ alignSelf: 'start' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        paddingBottom: 16, borderBottom: '1px solid var(--line)', marginBottom: 20,
      }}>
        <div>
          <div className="kbd" style={{ marginBottom: 8 }}>Detalhe da partida #{m.id}</div>
          <div className="font-game" style={{ fontSize: 24, fontWeight: 600, color: 'var(--accent-2)' }}>
            {m.champ || m.agent || m.comp || m.deck}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
            {(m.role || m.map || (isTFT ? `${m.placement}º lugar` : m.archetype))} · {m.duration} · {m.when}
          </div>
        </div>
        <span className={`chip ${win ? 'chip-win' : 'chip-loss'}`}>
          {isTFT ? `${m.placement}º` : win ? 'VITÓRIA' : 'DERROTA'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 24 }}>
        {stats.map((s, i) => (
          <div key={i}>
            <div className="kbd" style={{ fontSize: 9 }}>{s.label}</div>
            <div className="font-game" style={{ fontSize: 22, fontWeight: 600, marginTop: 4, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {(game === 'lol' || isVAL) && (
        <div style={{ marginBottom: 20 }}>
          <Heatmap
            data={heatmap}
            label={isVAL ? 'Mapa de tiros' : 'Mapa de presença'}
            mapName={isVAL ? m.map : 'Summoner\'s Rift'}
          />
        </div>
      )}

      {isTFT && (
        <div style={{ marginBottom: 20 }}>
          <div className="kbd" style={{ marginBottom: 12 }}>Tabuleiro final</div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4,
            padding: 12, background: 'var(--bg-2)', borderRadius: 10,
          }}>
            {Array.from({ length: 28 }, (_, i) => {
              const filled = [4, 5, 6, 11, 12, 13, 17, 18].includes(i);
              const star = filled && [5, 12, 18].includes(i);
              return (
                <div key={i} style={{
                  aspectRatio: '1', borderRadius: 6,
                  background: filled
                    ? `linear-gradient(135deg, var(--accent), var(--accent-deep))`
                    : 'rgba(255,255,255,0.04)',
                  display: 'grid', placeItems: 'center',
                  fontSize: 9, fontWeight: 700, color: '#0a0a0d',
                  position: 'relative',
                }}>
                  {filled && <span>U{i}</span>}
                  {star && <span style={{ position: 'absolute', top: 2, right: 2, fontSize: 8, color: '#ffd95a' }}>★★★</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isLoR && (
        <div style={{ marginBottom: 20 }}>
          <div className="kbd" style={{ marginBottom: 12 }}>Curva de mana</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6, alignItems: 'end', height: 80 }}>
            {[2, 5, 8, 6, 7, 4, 3, 2].map((v, i) => (
              <div key={i}>
                <div style={{
                  height: `${v * 10}px`,
                  background: 'linear-gradient(180deg, var(--accent), var(--accent-deep))',
                  borderRadius: 4,
                }}/>
                <div className="kbd" style={{ fontSize: 9, textAlign: 'center', marginTop: 4 }}>{i+1}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button className="btn btn-ghost" style={{ justifyContent: 'center' }}>Replay</button>
        <button className="btn btn-primary" style={{ justifyContent: 'center' }}>Análise IA {Icons.brain}</button>
      </div>
    </div>
  );
}

// ============= REPORTS =============
function ReportsView({ game }) {
  const d = window.DATA[game];
  const monthsLabel = ['Jun','Jul','Ago','Set','Out','Nov','Dez','Jan','Fev','Mar','Abr','Mai'];
  const wrByDay = [54, 67, 48, 72, 58, 64, 51];
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div style={{ padding: '32px 36px', display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="chip chip-accent">7 dias</button>
          <button className="chip">30 dias</button>
          <button className="chip">3 meses</button>
          <button className="chip">12 meses</button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost">Exportar CSV</button>
          <button className="btn btn-ghost">{Icons.filter} Filtros</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: 24 }}>
          <div className="kbd" style={{ marginBottom: 4 }}>Análise temporal</div>
          <div className="font-game" style={{ fontSize: 22, fontWeight: 600, marginBottom: 20 }}>
            Win rate vs LP ganho · 12 meses
          </div>
          <LineChart
            series={[
              { data: d.rankProgression, color: 'var(--accent)' },
              { data: d.winRate.map(v => v - 30), color: 'rgba(74, 223, 160, 0.7)' },
            ]}
            xLabels={monthsLabel}
            w={700} h={260}
          />
          <div style={{ display: 'flex', gap: 24, marginTop: 16, fontSize: 11 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 2, background: 'var(--accent)' }}/>
              <span style={{ color: 'var(--text-1)' }}>LP acumulado</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 12, height: 2, background: 'rgba(74, 223, 160, 0.7)' }}/>
              <span style={{ color: 'var(--text-1)' }}>Win rate (%)</span>
            </span>
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div className="kbd" style={{ marginBottom: 4 }}>Distribuição</div>
          <div className="font-game" style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
            {game === 'tft' ? 'Posições por partida' : 'Modos de jogo'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <Donut
              size={180}
              label="partidas"
              value={263}
              data={
                game === 'tft' ? [
                  { value: 12, color: '#ffd95a' },
                  { value: 24, color: '#a8d878' },
                  { value: 18, color: '#74b8e8' },
                  { value: 22, color: '#a85bd1' },
                  { value: 14, color: '#e07a40' },
                  { value: 8,  color: '#666' },
                ] : [
                  { value: 142, color: 'var(--accent)' },
                  { value: 68,  color: 'color-mix(in oklab, var(--accent) 60%, transparent)' },
                  { value: 32,  color: 'color-mix(in oklab, var(--accent) 30%, transparent)' },
                  { value: 21,  color: 'var(--text-3)' },
                ]
              }
            />
          </div>
          <div style={{ display: 'grid', gap: 6, fontSize: 12 }}>
            {(game === 'tft'
              ? [['1º','#ffd95a','12'],['2º-3º','#a8d878','24'],['4º','#74b8e8','18'],['5º-6º','#a85bd1','22'],['7º','#e07a40','14'],['8º','#666','8']]
              : [['Solo/Duo','var(--accent)','142'],['Flex','c1','68'],['Normal','c2','32'],['Outros','var(--text-3)','21']]
            ).map(([l, c, v], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c.startsWith('#') ? c : 'var(--accent)' }}/>
                <span style={{ flex: 1, color: 'var(--text-1)' }}>{l}</span>
                <span style={{ color: 'var(--text-2)', fontFamily: 'var(--game-font)', fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: 24 }}>
          <div className="kbd" style={{ marginBottom: 4 }}>Performance por dia</div>
          <div className="font-game" style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Win rate semanal</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, alignItems: 'end', height: 140 }}>
            {wrByDay.map((v, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 10, color: 'var(--text-2)', fontFamily: 'var(--body-font)' }}>{v}%</div>
                <div style={{
                  width: '70%',
                  height: `${v}%`,
                  background: v > 60 ? 'linear-gradient(180deg, var(--accent), var(--accent-deep))' : 'var(--bg-3)',
                  borderRadius: '4px 4px 0 0',
                }}/>
                <div className="kbd" style={{ fontSize: 9 }}>{days[i]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 24, gridColumn: 'span 2' }}>
          <div className="kbd" style={{ marginBottom: 4 }}>Comparação</div>
          <div className="font-game" style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Você vs amigos</div>
          <div style={{ display: 'grid', gap: 14 }}>
            {[
              { name: 'Você',         wr: 56, rank: d.rank.tier, color: 'var(--accent)' },
              { name: 'Mestre Lobo',  wr: 62, rank: 'DIAMOND',   color: 'rgba(255,255,255,0.4)' },
              { name: 'KKjogador',    wr: 51, rank: 'EMERALD',   color: 'rgba(255,255,255,0.3)' },
              { name: 'NoSkill42',    wr: 47, rank: 'PLATINUM',  color: 'rgba(255,255,255,0.2)' },
            ].map((p, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 80px', gap: 12, alignItems: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: p.name === 'Você' ? 700 : 500, color: p.name === 'Você' ? 'var(--accent-2)' : 'var(--text-1)' }}>{p.name}</div>
                <div className="bar" style={{ height: 8 }}>
                  <span style={{ width: `${p.wr}%`, background: p.color }}/>
                </div>
                <div className="font-mono" style={{ fontSize: 12, textAlign: 'right' }}>{p.wr}% · {p.rank}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= META =============
function MetaView({ game }) {
  const d = window.DATA[game];
  const tierColors = { 'S+': '#ff6b8a', 'S': '#d4a657', 'A': '#74b8e8', 'B': '#a8d878', 'C': '#888' };
  const champLabel = { lol: 'campeões', valorant: 'agentes', tft: 'composições', lor: 'decks' }[game];

  return (
    <div style={{ padding: '32px 36px', display: 'grid', gap: 24 }}>
      <div className="card" style={{
        padding: 28,
        background: `linear-gradient(135deg, color-mix(in oklab, var(--accent-bg) 60%, var(--bg-1)), var(--bg-1))`,
      }}>
        <div className="kbd">Meta atual</div>
        <div className="font-game" style={{ fontSize: 28, fontWeight: 600, marginTop: 8, color: 'var(--accent-2)' }}>
          Patch {game === 'lol' ? '14.9' : game === 'valorant' ? '8.07' : game === 'tft' ? 'Set 11.5' : '4.10'} · O que está dominando
        </div>
        <div style={{ color: 'var(--text-2)', marginTop: 6, fontSize: 13 }}>
          Análise dos {champLabel} mais fortes na sua elo · atualizado há 2 horas
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '60px 1fr 100px 100px 100px 80px',
          padding: '14px 24px', background: 'var(--bg-2)',
          fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-2)',
        }}>
          <div>Tier</div>
          <div>Nome</div>
          <div style={{ textAlign: 'right' }}>Win rate</div>
          <div style={{ textAlign: 'right' }}>Pick rate</div>
          <div style={{ textAlign: 'right' }}>Δ Patch</div>
          <div style={{ textAlign: 'right' }}>Ação</div>
        </div>
        {d.metaPicks.map((p, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '60px 1fr 100px 100px 100px 80px',
            padding: '16px 24px', alignItems: 'center',
            borderTop: '1px solid var(--line)',
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: tierColors[p.tier] + '22',
              border: `1px solid ${tierColors[p.tier]}66`,
              color: tierColors[p.tier],
              display: 'grid', placeItems: 'center',
              fontWeight: 700, fontSize: 13, fontFamily: 'var(--game-font)',
            }}>{p.tier}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 6,
                background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))',
                color: '#0a0a0d', fontWeight: 700, fontSize: 11,
                display: 'grid', placeItems: 'center',
              }}>{p.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
                <div className="kbd" style={{ fontSize: 9 }}>posição #{i+1}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--game-font)', fontSize: 16, fontWeight: 600 }}>{p.wr}%</div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--game-font)', fontSize: 16, fontWeight: 600, color: 'var(--text-1)' }}>{p.pr}%</div>
            <div style={{ textAlign: 'right', fontFamily: 'var(--game-font)', fontSize: 14, fontWeight: 600,
                          color: p.delta > 0 ? '#4adfa0' : p.delta < 0 ? '#ff8a95' : 'var(--text-2)' }}>
              {p.delta > 0 ? '+' : ''}{p.delta}%
            </div>
            <div style={{ textAlign: 'right' }}>
              <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 11 }}>Ver build</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: 24 }}>
          <div className="kbd">Tendências</div>
          <div className="font-game" style={{ fontSize: 18, fontWeight: 600, marginTop: 4, marginBottom: 16 }}>
            Subindo no patch
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {d.metaPicks.filter(p => p.delta > 0).map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 18 }}>📈</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                  <div className="kbd" style={{ fontSize: 9 }}>+{p.delta}% win rate</div>
                </div>
                <div style={{ color: '#4adfa0', fontFamily: 'var(--game-font)', fontWeight: 600, fontSize: 16 }}>
                  +{p.delta}%
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <div className="kbd">Counters do seu main</div>
          <div className="font-game" style={{ fontSize: 18, fontWeight: 600, marginTop: 4, marginBottom: 16 }}>
            Cuidado com estes picks
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { name: 'Fizz',     wr: 58, vs: '52%' },
              { name: 'Pantheon', wr: 56, vs: '48%' },
              { name: 'LeBlanc',  wr: 54, vs: '44%' },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 6,
                  background: 'linear-gradient(135deg, #ff8a95, #c44a5a)',
                  color: '#0a0a0d', fontWeight: 700, fontSize: 11,
                  display: 'grid', placeItems: 'center',
                }}>{c.name.slice(0, 2).toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                  <div className="kbd" style={{ fontSize: 9 }}>winrate vs você: {c.vs}</div>
                </div>
                <div className="bar" style={{ width: 80 }}>
                  <span style={{ width: `${c.wr}%`, background: '#ff8a95' }}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.OverviewView = OverviewView;
window.MatchesView = MatchesView;
window.ReportsView = ReportsView;
window.MetaView = MetaView;
window.MatchRow = MatchRow;
window.KPI = KPI;

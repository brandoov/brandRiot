// game-shell.jsx — wraps each game page with sidebar + topbar + view switcher + tweaks
// Globals: window.GameShell

const { useState: gsState, useEffect: gsEffect } = React;

function GameShell({ game }) {
  const meta = window.GAME_META[game];
  const [view, setView] = gsState('overview');
  const tweaks = window.useTweaks ? window.useTweaks({
    game: game,
    intensity: 'cinematic',
    mode: 'dark',
  }) : null;
  const t = tweaks ? tweaks[0] : { game, intensity: 'cinematic', mode: 'dark' };
  const setTweak = tweaks ? tweaks[1] : () => {};

  // sync URL when game tweak changes (so reload keeps the chosen game)
  gsEffect(() => {
    document.documentElement.setAttribute('data-game', t.game);
    document.documentElement.setAttribute('data-intensity', t.intensity);
    document.documentElement.setAttribute('data-mode', t.mode);
  }, [t.game, t.intensity, t.mode]);

  // when user toggles game in tweaks, navigate to that page
  const initialGameRef = React.useRef(game);
  gsEffect(() => {
    if (t.game !== initialGameRef.current) {
      window.location.href = `${t.game}.html`;
    }
  }, [t.game]);

  const titles = {
    overview: { title: meta.name,    sub: 'Visão geral · Painel de invocador' },
    matches:  { title: 'Partidas',   sub: `${meta.name} · Histórico completo` },
    reports:  { title: 'Relatórios', sub: `${meta.name} · Análise de dados` },
    meta:     { title: 'Meta',       sub: `${meta.name} · Tendências do patch` },
    ai:       { title: 'Análise IA', sub: `${meta.name} · Treinador virtual` },
  };

  const View = {
    overview: window.OverviewView,
    matches:  window.MatchesView,
    reports:  window.ReportsView,
    meta:     window.MetaView,
    ai:       window.AIView,
  }[view];

  return (
    <div data-game={t.game} data-intensity={t.intensity} data-mode={t.mode}
         className="game-shell"
         style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar game={t.game} current={view} onNav={setView} gameMeta={meta}/>
      <div style={{ flex: 1, minWidth: 0, position: 'relative' }} data-screen-label={`${meta.short}-${view}`}>
        <Topbar
          title={titles[view].title}
          subtitle={titles[view].sub}
          right={
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="chip">Hoje</button>
              <button className="chip chip-accent">7 dias</button>
              <button className="chip">30d</button>
              <button className="chip">Total</button>
            </div>
          }
        />
        <View game={t.game}/>
      </div>

      {/* Tweaks panel */}
      {window.TweaksPanel && (
        <window.TweaksPanel>
          <window.TweakSection label="Tema">
            <window.TweakSelect
              label="Jogo"
              value={t.game}
              onChange={v => setTweak('game', v)}
              options={[
                { value: 'lol', label: 'League of Legends' },
                { value: 'valorant', label: 'VALORANT' },
                { value: 'tft', label: 'Teamfight Tactics' },
                { value: 'lor', label: 'Legends of Runeterra' },
              ]}
            />
            <window.TweakRadio
              label="Intensidade"
              value={t.intensity}
              onChange={v => setTweak('intensity', v)}
              options={[
                { value: 'subtle', label: 'Sutil' },
                { value: 'medium', label: 'Médio' },
                { value: 'cinematic', label: 'Cinema' },
              ]}
            />
            <window.TweakRadio
              label="Modo"
              value={t.mode}
              onChange={v => setTweak('mode', v)}
              options={[
                { value: 'dark', label: 'Escuro' },
                { value: 'light', label: 'Claro' },
              ]}
            />
          </window.TweakSection>
          <window.TweakSection label="Navegação">
            <window.TweakSelect
              label="Vista"
              value={view}
              onChange={setView}
              options={[
                { value: 'overview', label: 'Visão geral' },
                { value: 'matches', label: 'Partidas' },
                { value: 'reports', label: 'Relatórios' },
                { value: 'meta', label: 'Meta' },
                { value: 'ai', label: 'Análise IA' },
              ]}
            />
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </div>
  );
}

window.GameShell = GameShell;

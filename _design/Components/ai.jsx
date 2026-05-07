// ai.jsx — AI insights screen: coach voice + analyst voice + conversational chat
// Globals: window.AIView

const { useState: aiUseState, useEffect: aiUseEffect, useRef: aiUseRef } = React;

function AIView({ game }) {
  const d = window.DATA[game];
  const [tab, setTab] = aiUseState('coach');
  const [aiThinking, setAiThinking] = aiUseState(false);

  return (
    <div style={{ padding: '32px 36px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
      <div style={{ display: 'grid', gap: 20 }}>
        {/* Header card */}
        <div className="card" style={{
          padding: 28,
          background: `linear-gradient(135deg, color-mix(in oklab, var(--accent-bg) 80%, var(--bg-1)) 0%, var(--bg-1) 100%)`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', right: -40, top: -40, width: 280, height: 280,
            background: `radial-gradient(circle, var(--accent-glow), transparent 70%)`,
            filter: 'blur(60px)', pointerEvents: 'none',
          }}/>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 14,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))',
              display: 'grid', placeItems: 'center',
              boxShadow: '0 0 40px var(--accent-glow)',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0a0a0d" strokeWidth="1.8">
                <path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-2 3 3 3 0 0 0 2 3v1a3 3 0 0 0 3 3h1V4H9z"/>
                <path d="M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 2 3 3 3 0 0 1-2 3v1a3 3 0 0 1-3 3h-1V4h1z"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div className="kbd" style={{ marginBottom: 4 }}>Análise IA · Treinador virtual</div>
              <div className="font-game" style={{ fontSize: 28, fontWeight: 600, color: 'var(--accent-2)' }}>
                Olá, {d.summoner.name}.
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-1)', marginTop: 4 }}>
                Analisei suas últimas <strong>20 partidas</strong>. Identifiquei <strong style={{ color: 'var(--accent-2)' }}>3 padrões</strong> que você pode corrigir hoje.
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="kbd">Confiança</div>
              <div className="font-game" style={{ fontSize: 32, fontWeight: 600, color: 'var(--accent)' }}>92<span style={{ fontSize: 18 }}>%</span></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--bg-1)', borderRadius: 10, border: '1px solid var(--line)' }}>
          {[
            { id: 'coach',   label: 'Treinador',  icon: '🎯', sub: 'Direto ao ponto' },
            { id: 'analyst', label: 'Analista',   icon: '📊', sub: 'Dados detalhados' },
            { id: 'chat',    label: 'Conversar',  icon: '💬', sub: 'Pergunte algo' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                flex: 1, padding: '14px 16px', borderRadius: 8, border: 0, cursor: 'pointer',
                background: tab === t.id ? 'color-mix(in oklab, var(--accent) 14%, transparent)' : 'transparent',
                color: tab === t.id ? 'var(--accent-2)' : 'var(--text-1)',
                fontFamily: 'inherit', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 12,
                position: 'relative', transition: 'all .15s',
              }}>
              <span style={{ fontSize: 22 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.label}</div>
                <div className="kbd" style={{ fontSize: 9 }}>{t.sub}</div>
              </div>
              {tab === t.id && <span style={{
                position: 'absolute', bottom: -1, left: 16, right: 16, height: 2, background: 'var(--accent)', borderRadius: 2,
              }}/>}
            </button>
          ))}
        </div>

        {tab === 'coach' && <CoachPane game={game}/>}
        {tab === 'analyst' && <AnalystPane game={game}/>}
        {tab === 'chat' && <ChatPane game={game}/>}
      </div>

      {/* Right side — quick actions + insights feed */}
      <div style={{ display: 'grid', gap: 16, alignContent: 'start', position: 'sticky', top: 100 }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="kbd" style={{ marginBottom: 8 }}>Sua última partida</div>
          <div className="font-game" style={{ fontSize: 18, fontWeight: 600, color: 'var(--accent-2)' }}>
            {d.matches[0].champ || d.matches[0].agent || d.matches[0].comp || d.matches[0].deck}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
            {d.matches[0].duration} · {d.matches[0].when}
          </div>
          <div className="hr" style={{ margin: '14px 0' }}/>
          <div style={{ display: 'grid', gap: 8 }}>
            {[
              { label: 'Decisões corretas', value: '78%', good: true },
              { label: 'Erros críticos',     value: '2',   good: false },
              { label: 'Oportunidades',      value: '5',   good: null },
            ].map((x, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-1)' }}>{x.label}</span>
                <span className="font-mono" style={{
                  fontSize: 13, fontWeight: 600,
                  color: x.good === true ? '#4adfa0' : x.good === false ? '#ff8a95' : 'var(--accent-2)',
                }}>{x.value}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}>
            Análise completa {Icons.arrow}
          </button>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div className="kbd" style={{ marginBottom: 12 }}>Sugestões para hoje</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {[
              { txt: 'Pratique Ahri vs Sylas no Treino', tag: 'Matchup', tone: 'accent' },
              { txt: 'Reveja sua VOD: 18min foi crítico', tag: 'Replay',  tone: 'normal' },
              { txt: 'Tente o build Ludens + Shadowflame', tag: 'Build',   tone: 'normal' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '10px 12px', borderRadius: 8,
                background: s.tone === 'accent' ? 'color-mix(in oklab, var(--accent) 10%, transparent)' : 'var(--bg-2)',
                border: '1px solid var(--line)',
                cursor: 'pointer', transition: 'background .15s',
              }}>
                <div style={{ fontSize: 12, color: 'var(--text-0)', lineHeight: 1.4 }}>{s.txt}</div>
                <div className="kbd" style={{ fontSize: 9, marginTop: 4, color: s.tone === 'accent' ? 'var(--accent-2)' : 'var(--text-2)' }}>{s.tag}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= COACH PANE =============
function CoachPane({ game }) {
  const insights = {
    lol: [
      {
        priority: 'CRÍTICO',
        title: 'Você está sendo ganked aos 8 minutos',
        desc: 'Em 14 das últimas 20 partidas, você morreu para o jungler entre 7:30 e 9:00 no mid. Sua linha estava empurrada e sem visão no rio.',
        action: 'Coloque um totem de visão no arbusto do rio antes dos 6 minutos quando empurrar a wave. Recue se o jungler inimigo for visto na lane do bot.',
        impact: '+18% taxa de vitória estimada',
        tag: 'Visão',
      },
      {
        priority: 'IMPORTANTE',
        title: 'CS no início está abaixo da elo',
        desc: 'Sua CS aos 10 minutos é 68 em média. A média Esmeralda é 82. Você está perdendo ~140 ouro por partida.',
        action: 'Foque em last-hit nos primeiros 6 minutos antes de pensar em rotação. Use a habilidade E em creeps de canhão.',
        impact: '+12% farm score',
        tag: 'Macro',
      },
      {
        priority: 'OPORTUNIDADE',
        title: 'Ahri tem o melhor matchup contra Hwei',
        desc: 'Hwei está em alta no patch (53% WR). Você tem 78% WR no matchup Ahri vs Hwei nas últimas 12 partidas.',
        action: 'Considere banir Sylas e priorizar Ahri quando vir Hwei do outro lado.',
        impact: '+24% no matchup',
        tag: 'Draft',
      },
    ],
    valorant: [
      {
        priority: 'CRÍTICO',
        title: 'Suas mortes de eco round são caras',
        desc: '67% das suas eco rounds terminam com você morto sem dar dano. Está doando arma para o inimigo em rounds que vocês podem aproveitar.',
        action: 'Stack com 1-2 teammates em um único site. Evite pegar duelos longos sem armadura.',
        impact: '+11% rounds ganhos',
        tag: 'Economia',
      },
      {
        priority: 'IMPORTANTE',
        title: 'Headshot rate caindo no segundo half',
        desc: 'Sua HS% começa em 38% mas cai para 22% após o round 12. Provável fadiga de mira.',
        action: 'Faça um warmup de 5min entre os halves. Hidrate. Considere reduzir sensibilidade temporariamente.',
        impact: '+6% ACS',
        tag: 'Mira',
      },
      {
        priority: 'OPORTUNIDADE',
        title: 'Jett é seu melhor agente em Bind',
        desc: '74% WR com Jett em Bind nas últimas 12. Você está jogando Reyna em Bind 40% das vezes.',
        action: 'Force Jett em Bind. Reyna funciona melhor em Lotus pelo seu estilo de duelos curtos.',
        impact: '+18% WR em Bind',
        tag: 'Mapa',
      },
    ],
    tft: [
      {
        priority: 'CRÍTICO',
        title: 'Você está rerollando muito cedo',
        desc: 'Sua média de gold gasto antes do nível 7 é 84g. Top players gastam 22g em média até esse ponto. Isso machuca seu econ.',
        action: 'Mantenha 50g de juros. Só rerolle quando estiver atrás em HP ou for um comp 1-cost (Heavenly).',
        impact: '+0.8 colocação média',
        tag: 'Econ',
      },
      {
        priority: 'IMPORTANTE',
        title: 'Posicionamento contra assassinos',
        desc: 'Em 8 das últimas 12 partidas vs comp Duelist, seus carries morreram primeiro nos 2 primeiros segundos.',
        action: 'Coloque carries na linha 4 com tank na linha 3 frente. Evite Yasuo na ponta quando ver Duelist.',
        impact: '+1.4 dano sobrevivido',
        tag: 'Posição',
      },
      {
        priority: 'OPORTUNIDADE',
        title: 'Heavenly Reroll é seu pão com manteiga',
        desc: '78% top4 e 28% chance de #1 quando você joga Heavenly. Você só joga em 23% das partidas.',
        action: 'Force Heavenly quando abrir 2 unidades 1-cost no carrossel inicial.',
        impact: 'Top4 76% → 81%',
        tag: 'Comp',
      },
    ],
    lor: [
      {
        priority: 'CRÍTICO',
        title: 'Você está mulligando errado contra controle',
        desc: 'Mantém custos altos vs Aurelion/Zoe. Top jogadores mulligan 100% das cartas 4+ contra controle.',
        action: 'Mantenha apenas Annie, Jhin, e qualquer 1-2 mana. Pressione antes do turno 5.',
        impact: '+14% WR vs controle',
        tag: 'Mulligan',
      },
      {
        priority: 'IMPORTANTE',
        title: 'Cartas mortas na mão',
        desc: 'Você termina partidas com 2.4 cartas inúteis. Está descartando errado.',
        action: 'Use Discard food primeiro: cartas extras de plano A. Guarde Jhin para finalizar.',
        impact: '+8% velocidade de fechamento',
        tag: 'Tempo',
      },
      {
        priority: 'OPORTUNIDADE',
        title: 'Annie/Jhin é o melhor deck do meta na sua elo',
        desc: 'Tier S+ com 56.4% WR. Você tem 64% WR neste deck.',
        action: 'Spam até chegar em Master 300 LP. Apenas mude se contadores aparecerem nas 3 últimas partidas.',
        impact: '+22 LP/dia médio',
        tag: 'Deck',
      },
    ],
  }[game];

  const colors = { 'CRÍTICO': '#ff8a95', 'IMPORTANTE': '#d4a657', 'OPORTUNIDADE': '#4adfa0' };

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      {insights.map((ins, i) => (
        <div key={i} className="card" style={{
          padding: 24,
          borderLeft: `4px solid ${colors[ins.priority]}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                fontSize: 9, letterSpacing: '0.12em', fontWeight: 700,
                color: colors[ins.priority],
                padding: '4px 8px', borderRadius: 4,
                background: colors[ins.priority] + '22',
                border: `1px solid ${colors[ins.priority]}55`,
              }}>{ins.priority}</span>
              <span className="chip">{ins.tag}</span>
            </div>
            <div style={{
              fontSize: 11, fontWeight: 600,
              color: '#4adfa0',
              padding: '4px 10px', borderRadius: 999,
              background: 'rgba(74, 223, 160, 0.1)',
            }}>{ins.impact}</div>
          </div>

          <h3 className="font-game" style={{ margin: 0, fontSize: 22, fontWeight: 600, color: 'var(--text-0)', lineHeight: 1.2 }}>
            {ins.title}
          </h3>
          <p style={{ margin: '10px 0 0', color: 'var(--text-1)', fontSize: 13, lineHeight: 1.6 }}>
            {ins.desc}
          </p>

          <div style={{
            marginTop: 16, padding: '14px 16px', borderRadius: 10,
            background: 'color-mix(in oklab, var(--accent) 8%, transparent)',
            border: '1px solid color-mix(in oklab, var(--accent) 25%, transparent)',
            display: 'flex', gap: 12, alignItems: 'flex-start',
          }}>
            <div style={{ fontSize: 16, marginTop: 1 }}>💡</div>
            <div>
              <div className="kbd" style={{ marginBottom: 4, color: 'var(--accent-2)' }}>O que fazer</div>
              <div style={{ fontSize: 13, color: 'var(--text-0)', lineHeight: 1.5 }}>{ins.action}</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button className="btn btn-primary">Praticar agora</button>
            <button className="btn btn-ghost">Ver exemplos</button>
            <button className="btn btn-ghost" style={{ marginLeft: 'auto' }}>Marcar como visto</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============= ANALYST PANE =============
function AnalystPane({ game }) {
  const d = window.DATA[game];
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div className="card" style={{ padding: 24 }}>
        <div className="kbd" style={{ marginBottom: 4 }}>Modelo · LSTM + KMeans</div>
        <div className="font-game" style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>
          Padrões identificados nos seus dados
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 20 }}>
          Análise de 263 partidas · 47 features · janela móvel de 30 dias
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Acurácia preditiva', value: '87.3%', sub: 'predição de win/loss' },
            { label: 'Anomalias detectadas', value: '3', sub: 'partidas atípicas' },
            { label: 'Cluster comportamental', value: '#4', sub: 'jogador agressivo / mid' },
          ].map((s, i) => (
            <div key={i} className="card-flat" style={{ padding: 14 }}>
              <div className="kbd">{s.label}</div>
              <div className="font-game" style={{ fontSize: 24, fontWeight: 600, marginTop: 6 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4 }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{
          padding: 18, borderRadius: 10,
          background: 'var(--bg-2)',
          border: '1px solid var(--line)',
          fontFamily: 'var(--font-mono)',
        }}>
          <div className="kbd" style={{ marginBottom: 12 }}>Features mais correlacionadas com vitória</div>
          {[
            { name: 'CS @ 10min',          weight: 0.84, sample: '+1 CS = +0.7% WR' },
            { name: 'Visão score 0-15',    weight: 0.71, sample: '+1 ward = +1.2% WR' },
            { name: 'Mortes early game',   weight: -0.68, sample: '-1 morte = +2.1% WR' },
            { name: 'Objetivo neutro 5-15',weight: 0.62, sample: 'Drake = +14% WR' },
            { name: 'Damage share team',   weight: 0.54, sample: '+5% share = +3% WR' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr',
              gap: 12, alignItems: 'center', padding: '10px 0',
              borderTop: i ? '1px solid var(--line)' : 'none',
            }}>
              <div style={{ fontSize: 13, color: 'var(--text-0)' }}>{f.name}</div>
              <div style={{ position: 'relative', height: 6, background: 'var(--bg-3)', borderRadius: 999 }}>
                <div style={{
                  position: 'absolute', top: 0, bottom: 0,
                  left: f.weight > 0 ? '50%' : `${50 + f.weight * 50}%`,
                  width: `${Math.abs(f.weight) * 50}%`,
                  background: f.weight > 0 ? 'var(--accent)' : '#ff8a95',
                  borderRadius: 999,
                }}/>
                <div style={{
                  position: 'absolute', top: -2, bottom: -2, left: '50%', width: 1,
                  background: 'var(--text-3)',
                }}/>
              </div>
              <div className="font-mono" style={{ fontSize: 11, color: 'var(--text-2)', textAlign: 'right' }}>{f.sample}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div className="kbd" style={{ marginBottom: 4 }}>Predição</div>
        <div className="font-game" style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          Próxima partida — probabilidade de vitória
        </div>
        <div style={{
          position: 'relative', height: 60, borderRadius: 10, overflow: 'hidden',
          background: 'linear-gradient(90deg, #ff8a95 0%, #d4a657 50%, #4adfa0 100%)',
        }}>
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: '64%', width: 3,
            background: 'var(--text-0)', boxShadow: '0 0 20px rgba(255,255,255,0.5)',
          }}>
            <div style={{
              position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)',
              width: 14, height: 14, borderRadius: '50%', background: 'var(--text-0)',
            }}/>
          </div>
          <div style={{
            position: 'absolute', bottom: 8, left: '64%', transform: 'translateX(-50%)',
            fontSize: 18, fontWeight: 700, fontFamily: 'var(--game-font)',
            color: '#0a0a0d',
          }}>64%</div>
          <div style={{ position: 'absolute', left: 12, top: 8, fontSize: 10, fontWeight: 600, color: '#0a0a0d' }}>0%</div>
          <div style={{ position: 'absolute', right: 12, top: 8, fontSize: 10, fontWeight: 600, color: '#0a0a0d' }}>100%</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 12, color: 'var(--text-2)' }}>
          <span>Baseado em horário, comp esperada, e seu rendimento recente.</span>
          <span style={{ color: 'var(--accent-2)', fontWeight: 600 }}>Confiança ±4.2%</span>
        </div>
      </div>
    </div>
  );
}

// ============= CHAT PANE =============
function ChatPane({ game }) {
  const d = window.DATA[game];
  const [msgs, setMsgs] = aiUseState([
    { role: 'ai', text: `Oi! Sou seu treinador IA. Posso responder sobre suas partidas, builds, matchups, ou qualquer coisa sobre ${window.GAME_META[game].name}. O que você quer saber?` },
  ]);
  const [input, setInput] = aiUseState('');
  const [thinking, setThinking] = aiUseState(false);
  const scrollRef = aiUseRef(null);

  const suggestions = {
    lol: ['Por que perdi minhas 3 últimas com Sylas?', 'Qual build de Ahri vs Hwei?', 'Como melhorar meu CS?', 'Devo banir Yasuo na minha elo?'],
    valorant: ['Como melhorar minha eco round?', 'Jett ou Iso para Bind?', 'Qual sensibilidade ideal?', 'Por que perco no segundo half?'],
    tft: ['Quando devo subir para nível 8?', 'Posicionamento contra Duelist?', 'Heavenly ou Storyweaver hoje?', 'Quanto gold pra rerollar?'],
    lor: ['Como mulligar contra controle?', 'Melhor deck para Master?', 'Como counterar Annie/Jhin?', 'Quando passar o turno?'],
  }[game];

  aiUseEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, thinking]);

  const send = (text) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { role: 'user', text }]);
    setInput('');
    setThinking(true);
    // simulate AI response
    setTimeout(() => {
      const responses = [
        `Boa pergunta. Olhando suas últimas 20 partidas, identifiquei 3 fatores principais. Primeiro, sua taxa de farm está 14% abaixo da média da sua elo (Esmeralda). Segundo, você tende a engajar quando está sem flash — em 8 das suas mortes, sua summoner estava em cooldown. Terceiro, há uma forte correlação entre seu desempenho e o horário: você joga 23% melhor antes das 22h.`,
        `Pelos seus dados, eu recomendo focar em 2 coisas esta semana: (1) Ward score precisa subir para pelo menos 1.2/min — você está em 0.8. (2) Pratique freeze em wave bouncing antes do minuto 6. Isso por si só deve te dar uns 30-40 LP semanais.`,
        `Análise rápida do matchup: você tem 64% WR no espelho mas apenas 38% contra picks de tempo agressivo. Sugiro aprender Galio como pocket pick — funciona muito bem na sua composição usual.`,
      ];
      const resp = responses[Math.floor(Math.random() * responses.length)];
      setMsgs(m => [...m, { role: 'ai', text: resp }]);
      setThinking(false);
    }, 1200);
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 620, overflow: 'hidden' }}>
      <div ref={scrollRef} className="scroll" style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '78%',
            display: 'flex', gap: 10, alignItems: 'flex-start',
            flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6, flexShrink: 0,
              background: m.role === 'ai'
                ? 'linear-gradient(135deg, var(--accent), var(--accent-deep))'
                : 'var(--bg-3)',
              display: 'grid', placeItems: 'center',
              fontSize: 12, fontWeight: 700,
              color: m.role === 'ai' ? '#0a0a0d' : 'var(--text-0)',
            }}>{m.role === 'ai' ? 'AI' : 'EU'}</div>
            <div style={{
              padding: '12px 14px', borderRadius: 12,
              background: m.role === 'ai' ? 'var(--bg-2)' : 'color-mix(in oklab, var(--accent) 15%, var(--bg-2))',
              border: '1px solid var(--line)',
              fontSize: 13, lineHeight: 1.55, color: 'var(--text-0)',
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-deep))',
              display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, color: '#0a0a0d',
            }}>AI</div>
            <div style={{ padding: '12px 14px', borderRadius: 12, background: 'var(--bg-2)', border: '1px solid var(--line)', display: 'flex', gap: 4 }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
                  animation: 'pulse-soft 1.2s ease-in-out infinite',
                  animationDelay: `${i * 0.15}s`,
                }}/>
              ))}
            </div>
          </div>
        )}
      </div>

      {msgs.length === 1 && (
        <div style={{ padding: '0 24px 16px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => send(s)} className="chip"
              style={{ cursor: 'pointer', padding: '6px 12px' }}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div style={{ borderTop: '1px solid var(--line)', padding: 16, display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send(input)}
          placeholder="Pergunte sobre suas partidas, builds, matchups..."
          style={{
            flex: 1, padding: '12px 14px', borderRadius: 8,
            background: 'var(--bg-2)', border: '1px solid var(--line)',
            color: 'var(--text-0)', fontSize: 13, fontFamily: 'inherit',
            outline: 'none',
          }}
        />
        <button className="btn btn-primary" onClick={() => send(input)}>
          Enviar {Icons.arrow}
        </button>
      </div>
    </div>
  );
}

window.AIView = AIView;

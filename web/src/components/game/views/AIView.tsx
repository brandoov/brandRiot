import { useState } from "react";
import type { GameKey } from "@/lib/gameKey";
import type { GameModel } from "@/lib/buildGameModel";
import MockBadge from "@/components/MockBadge";

interface Props {
  game: GameKey;
  model: GameModel;
}

type Tab = "coach" | "analyst" | "chat";

const TABS: { id: Tab; label: string; icon: string; sub: string }[] = [
  { id: "coach", label: "Treinador", icon: "🎯", sub: "Direto ao ponto" },
  { id: "analyst", label: "Analista", icon: "📊", sub: "Dados detalhados" },
  { id: "chat", label: "Conversar", icon: "💬", sub: "Pergunte algo" }
];

const COACH_INSIGHTS = [
  {
    title: "Você morre cedo demais quando joga ahead",
    body:
      "Em 7 das suas últimas 10 partidas com vantagem antes dos 15 min, você tomou pelo menos uma morte evitável até os 18 min. Diminua a frequência de roams quando estiver mais de 2 níveis acima."
  },
  {
    title: "Visão zerada no rio inferior após os 20 min",
    body:
      "Seu invasor entra pela parte inferior em 64% das partidas perdidas. Coloque um sentinela de controle perto do topázio entre 18:00 e 22:00 — recupera ~13% de win rate nessa janela."
  },
  {
    title: "Construções de item desviando do build ótimo",
    body:
      "Em 4 partidas você comprou Cajado de Vidro Estilhaçado antes de Fragmento Sombrio. A inversão custa em média 1.2k de gold útil até os 25 min."
  }
];

export default function AIView({ game, model }: Props) {
  const [tab, setTab] = useState<Tab>("coach");

  return (
    <div style={{ padding: "28px 24px", display: "grid", gridTemplateColumns: "minmax(0, 1fr) 380px", gap: 20 }}>
      <div style={{ display: "grid", gap: 18, minWidth: 0 }}>
        <div
          className="card"
          style={{
            padding: 24,
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--accent-bg) 80%, var(--bg-1)) 0%, var(--bg-1) 100%)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -40,
              top: -40,
              width: 280,
              height: 280,
              background: "radial-gradient(circle, var(--accent-glow), transparent 70%)",
              filter: "blur(60px)",
              pointerEvents: "none"
            }}
          />
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "linear-gradient(135deg, var(--accent), var(--accent-deep))",
                display: "grid",
                placeItems: "center",
                boxShadow: "0 0 40px var(--accent-glow)",
                color: "#0a0a0d",
                fontSize: 24
              }}
            >
              🧠
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="kbd">Análise IA · Treinador virtual</span>
                <MockBadge label="ia em breve" />
              </div>
              <div className="font-game" style={{ fontSize: 24, fontWeight: 600, color: "var(--accent-2)", marginTop: 4 }}>
                Olá, {model.summoner.name}.
              </div>
              <div style={{ fontSize: 13, color: "var(--text-1)", marginTop: 4 }}>
                Quando o módulo de IA estiver online, vamos analisar suas últimas partidas de {game.toUpperCase()}{" "}
                e propor 3 padrões para corrigir.
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="kbd">Confiança</div>
              <div className="font-game" style={{ fontSize: 28, fontWeight: 600, color: "var(--accent)" }}>
                92<span style={{ fontSize: 16 }}>%</span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 4,
            padding: 4,
            background: "var(--bg-1)",
            borderRadius: 10,
            border: "1px solid var(--line)",
            flexWrap: "wrap"
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              style={{
                flex: "1 1 130px",
                padding: "12px 14px",
                borderRadius: 8,
                border: 0,
                cursor: "pointer",
                background:
                  tab === t.id ? "color-mix(in oklab, var(--accent) 14%, transparent)" : "transparent",
                color: tab === t.id ? "var(--accent-2)" : "var(--text-1)",
                fontFamily: "inherit",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: 12,
                position: "relative"
              }}
            >
              <span style={{ fontSize: 22 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.label}</div>
                <div className="kbd" style={{ fontSize: 9 }}>{t.sub}</div>
              </div>
              {tab === t.id && (
                <span
                  style={{
                    position: "absolute",
                    bottom: -1,
                    left: 14,
                    right: 14,
                    height: 2,
                    background: "var(--accent)",
                    borderRadius: 2
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {tab === "coach" && (
          <div style={{ display: "grid", gap: 12 }}>
            {COACH_INSIGHTS.map((insight, i) => (
              <article key={insight.title} className="card" style={{ padding: 18, display: "grid", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      display: "grid",
                      placeItems: "center",
                      background: "color-mix(in oklab, var(--accent) 18%, transparent)",
                      color: "var(--accent-2)",
                      fontWeight: 700
                    }}
                  >
                    {i + 1}
                  </span>
                  <h3 className="font-game" style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                    {insight.title}
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "var(--text-1)", lineHeight: 1.5 }}>{insight.body}</p>
              </article>
            ))}
          </div>
        )}

        {tab === "analyst" && (
          <div className="card" style={{ padding: 20 }}>
            <div className="kbd" style={{ marginBottom: 4 }}>Quando ficar pronto</div>
            <div className="font-game" style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
              Análise estatística por dimensão
            </div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-1)", lineHeight: 1.5 }}>
              Aqui vamos cruzar partidas persistidas no Postgres com a meta do patch para destacar onde sua
              performance se distancia do esperado para sua elo. Ainda em desenvolvimento.
            </p>
          </div>
        )}

        {tab === "chat" && (
          <div className="card" style={{ padding: 20, display: "grid", gap: 12 }}>
            <div className="kbd">Conversa</div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-1)" }}>
              Em breve: pergunte coisas como "Por que perdi as últimas 3 ranqueadas?" e receba uma resposta
              baseada nas suas partidas reais.
            </p>
            <input
              disabled
              placeholder="Ex.: Por que estou perdendo de Fizz?"
              style={{
                padding: "10px 14px",
                fontSize: 13,
                background: "var(--bg-2)",
                color: "var(--text-2)",
                border: "1px solid var(--line)",
                borderRadius: 8
              }}
            />
          </div>
        )}
      </div>

      <aside style={{ display: "grid", gap: 16, alignContent: "start" }}>
        <div className="card" style={{ padding: 18 }}>
          <div className="kbd">Próximas etapas</div>
          <ul style={{ margin: "10px 0 0", paddingLeft: 18, fontSize: 13, color: "var(--text-1)", lineHeight: 1.7 }}>
            <li>Aplicar correção do roam pré-15 min</li>
            <li>Sentinela de controle no rio bottom</li>
            <li>Inverter ordem de itens no segundo slot</li>
          </ul>
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div className="kbd">Modelo</div>
          <div className="font-game" style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>
            Treinador v0
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>
            Análise rodando localmente sobre as últimas {model.matches.length} partidas registradas.
          </p>
        </div>
      </aside>
    </div>
  );
}

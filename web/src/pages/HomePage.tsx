import { Link, useOutletContext } from "react-router-dom";
import { type HubContext, ModeToggle } from "@/components/HubLayout";
import GameLogo from "@/components/game/GameLogo";
import MockBadge from "@/components/MockBadge";
import type { GameKey } from "@/lib/gameKey";
import { GAME_META } from "@/data/mock";

interface Tile {
  to: string;
  game: GameKey;
  patch: string;
  rank: string;
  bg: string;
  border: string;
  glow: string;
  fontFamily: string;
  fontSize: number;
  textColor: string;
  stats: { v: string; l: string; tone?: string }[];
  mark: string;
}

const TILES: Tile[] = [
  {
    to: "/lol",
    game: "lol",
    patch: "PATCH 14.9",
    rank: "Esmeralda II",
    bg: "linear-gradient(180deg, #0d1f3d 0%, #091428 100%)",
    border: "rgba(200, 170, 110, 0.3)",
    glow: "0 0 60px rgba(200, 170, 110, 0.4) inset, 0 0 40px rgba(200, 170, 110, 0.2)",
    fontFamily: "'Cinzel', serif",
    fontSize: 32,
    textColor: "#f0e6d2",
    stats: [
      { v: "263", l: "Partidas" },
      { v: "54%", l: "Win rate" },
      { v: "+67", l: "LP semana", tone: "#4adfa0" }
    ],
    mark: "#c8aa6e"
  },
  {
    to: "/valorant",
    game: "valorant",
    patch: "EP 8 ACT 3",
    rank: "Imortal I",
    bg: "linear-gradient(180deg, #1f1d28 0%, #0f1923 100%)",
    border: "rgba(255, 70, 85, 0.3)",
    glow: "0 0 60px rgba(255, 70, 85, 0.35) inset, 0 0 40px rgba(255, 70, 85, 0.2)",
    fontFamily: "'Oswald', sans-serif",
    fontSize: 44,
    textColor: "#ff4655",
    stats: [
      { v: "165", l: "Partidas" },
      { v: "54%", l: "Win rate" },
      { v: "+22", l: "RR semana", tone: "#4adfa0" }
    ],
    mark: "#ff4655"
  },
  {
    to: "/tft",
    game: "tft",
    patch: "SET 11.5",
    rank: "Diamante IV",
    bg: "linear-gradient(180deg, #2a1f4a 0%, #1d1733 100%)",
    border: "rgba(55, 205, 190, 0.3)",
    glow: "0 0 60px rgba(55, 205, 190, 0.35) inset, 0 0 40px rgba(55, 205, 190, 0.2)",
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: 32,
    textColor: "#8ce6dc",
    stats: [
      { v: "103", l: "Partidas" },
      { v: "73%", l: "Top 4" },
      { v: "+58", l: "LP hoje", tone: "#4adfa0" }
    ],
    mark: "#37cdbe"
  },
  {
    to: "/lor",
    game: "lor",
    patch: "PATCH 4.10",
    rank: "Mestre",
    bg: "linear-gradient(180deg, #2a1d12 0%, #1a1410 100%)",
    border: "rgba(212, 166, 87, 0.3)",
    glow: "0 0 60px rgba(212, 166, 87, 0.35) inset, 0 0 40px rgba(212, 166, 87, 0.2)",
    fontFamily: "'EB Garamond', serif",
    fontSize: 32,
    textColor: "#f0d9a3",
    stats: [
      { v: "220", l: "Partidas" },
      { v: "56%", l: "Win rate" },
      { v: "+18", l: "LP hoje", tone: "#4adfa0" }
    ],
    mark: "#d4a657"
  }
];

export default function HomePage() {
  const { mode, setMode } = useOutletContext<HubContext>();

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 60% 40% at 20% 20%, rgba(200, 170, 110, 0.08), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 30%, rgba(255, 70, 85, 0.06), transparent 60%), radial-gradient(ellipse 50% 40% at 30% 80%, rgba(55, 205, 190, 0.06), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 90%, rgba(212, 166, 87, 0.06), transparent 60%)"
        }}
      />

      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "color-mix(in oklab, var(--bg-0) 75%, transparent)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--line)"
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap"
          }}
        >
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #c8aa6e, #785a28)",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
                color: "#0a0a0d",
                fontSize: 14
              }}
            >
              bR
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.02em" }}>brandRiot</div>
              <div className="kbd">Companion · Riot Games API</div>
            </div>
          </Link>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span
              className="chip"
              style={{ borderColor: "rgba(74, 223, 160, 0.4)", color: "#4adfa0" }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#4adfa0"
                }}
              />
              API · online
            </span>
            <ModeToggle mode={mode} onChange={setMode} />
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 64px" }}>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
            gap: 48,
            marginBottom: 64,
            alignItems: "end"
          }}
          className="hub-hero"
        >
          <div>
            <div className="kbd" style={{ marginBottom: 12, color: "#c8aa6e" }}>
              ⌬ Bem-vindo ao brandRiot
            </div>
            <h1
              className="font-game"
              style={{
                margin: 0,
                fontSize: 56,
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                color: "var(--text-0)"
              }}
            >
              Quatro mundos.
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(90deg, #c8aa6e, #ff4655 33%, #37cdbe 66%, #d4a657)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent"
                }}
              >
                Uma central de comando.
              </span>
            </h1>
            <p
              style={{
                margin: "20px 0 0",
                fontSize: 16,
                lineHeight: 1.6,
                color: "var(--text-1)",
                maxWidth: 560
              }}
            >
              brandRiot lê seus dados em tempo real via API oficial da Riot e te entrega painéis,
              gráficos, relatórios e análise por IA — separados por jogo, conectados por uma conta só.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
              <Link to="/lol" className="btn btn-primary" style={{ padding: "12px 20px", fontSize: 13 }}>
                Começar pelo League of Legends →
              </Link>
              <a
                href="http://localhost:5260/swagger"
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost"
                style={{ padding: "12px 20px", fontSize: 13 }}
              >
                Abrir Swagger da API
              </a>
            </div>
          </div>

          <div className="card" style={{ padding: 20, background: "rgba(15, 15, 22, 0.6)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div className="kbd">Sua atividade hoje</div>
              <MockBadge />
            </div>
            <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
              {[
                { game: "lol" as const, label: "League of Legends", detail: "+22 LP · 1V 0D · há 2h" },
                { game: "valorant" as const, label: "VALORANT", detail: "+22 RR · 1V 0D · há 1h" },
                { game: "tft" as const, label: "Teamfight Tactics", detail: "+58 LP · 1º lugar · há 1h" }
              ].map((row) => (
                <div
                  key={row.game}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: `linear-gradient(135deg, ${GAME_META[row.game].accent}, ${GAME_META[row.game].accent}66)`,
                        color: "#0a0a0d",
                        display: "grid",
                        placeItems: "center"
                      }}
                    >
                      <GameLogo game={row.game} size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{row.label}</div>
                      <div className="kbd">{row.detail}</div>
                    </div>
                  </div>
                  <span className="chip chip-win">Vitória</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 64 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 12
            }}
          >
            <div>
              <div className="kbd">Jogos conectados</div>
              <h2 className="font-game" style={{ margin: "4px 0 0", fontSize: 28, fontWeight: 600 }}>
                Escolha seu campo de batalha
              </h2>
            </div>
          </div>

          <div className="games-grid">
            {TILES.map((tile) => (
              <Link
                key={tile.to}
                to={tile.to}
                className="game-tile"
                style={{ background: tile.bg, borderColor: tile.border }}
              >
                <div className="game-tile-glow" style={{ boxShadow: tile.glow }} />
                <div className="game-mark" style={{ color: tile.mark }}>
                  <GameLogo game={tile.game} size={320} />
                </div>
                <div className="game-tile-overlay" />
                <div className="game-tile-content">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 48
                    }}
                  >
                    <span
                      className="chip"
                      style={{
                        background: `${tile.mark}22`,
                        borderColor: `${tile.mark}66`,
                        color: tile.textColor
                      }}
                    >
                      {tile.patch}
                    </span>
                    <span className="chip">{tile.rank}</span>
                  </div>
                  <h3
                    style={{
                      fontFamily: tile.fontFamily,
                      margin: 0,
                      fontSize: tile.fontSize,
                      fontWeight: 600,
                      lineHeight: 1,
                      color: tile.textColor
                    }}
                  >
                    {GAME_META[tile.game].name}
                  </h3>
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 12,
                      color: "rgba(255, 255, 255, 0.65)",
                      fontStyle: "italic"
                    }}
                  >
                    {GAME_META[tile.game].tagline}
                  </div>
                  <div className="stat-strip">
                    {tile.stats.map((s) => (
                      <div key={s.l}>
                        <div className="v" style={{ color: s.tone ?? tile.textColor }}>{s.v}</div>
                        <div className="l">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <footer
          style={{
            borderTop: "1px solid var(--line)",
            paddingTop: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 11,
            color: "var(--text-3)",
            flexWrap: "wrap",
            gap: 8
          }}
        >
          <div>
            brandRiot · Companion não oficial · Os dados são providos via Riot Games API. Não endossado pela Riot
            Games.
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <span>API status: <span style={{ color: "#4adfa0" }}>●</span> operacional</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

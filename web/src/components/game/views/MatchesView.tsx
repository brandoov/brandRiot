import { useMemo, useState } from "react";
import type { GameKey } from "@/lib/gameKey";
import type { GameModel } from "@/lib/buildGameModel";
import type {
  AnyMatchMock,
  LolMatchMock,
  LorMatchMock,
  TftMatchMock,
  ValMatchMock
} from "@/data/mock";
import MatchRow from "../primitives/MatchRow";
import Heatmap from "../primitives/Heatmap";
import MockBadge from "@/components/MockBadge";
import { makeHeatmap } from "@/data/mock";
import { Icons } from "../icons";

interface Props {
  game: GameKey;
  model: GameModel;
}

type Filter = "all" | "wins" | "losses";

function isWin(m: AnyMatchMock, game: GameKey): boolean {
  if (game === "tft") return (m as TftMatchMock).placement <= 4;
  if (game === "lor") return (m as LorMatchMock).win;
  if (game === "valorant") return (m as ValMatchMock).win;
  return (m as LolMatchMock).win;
}

export default function MatchesView({ game, model }: Props) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<AnyMatchMock | null>(null);

  const filtered = useMemo(
    () =>
      filter === "all"
        ? model.matches
        : model.matches.filter((m) => (filter === "wins" ? isWin(m, game) : !isWin(m, game))),
    [filter, model.matches, game]
  );

  return (
    <div style={{ padding: "28px 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8
        }}
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button onClick={() => setFilter("all")} className={`chip ${filter === "all" ? "chip-accent" : ""}`}>
            Todas {model.matches.length}
          </button>
          <button onClick={() => setFilter("wins")} className={`chip ${filter === "wins" ? "chip-accent" : ""}`}>
            Vitórias
          </button>
          <button onClick={() => setFilter("losses")} className={`chip ${filter === "losses" ? "chip-accent" : ""}`}>
            Derrotas
          </button>
          {model.mocked.matches && <MockBadge label="lista demo" />}
        </div>
        <button className="btn btn-ghost">{Icons.filter} Filtros</button>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {filtered.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelected(m)}
            style={{
              background: "transparent",
              border: 0,
              padding: 0,
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "inherit",
              borderRadius: 10
            }}
          >
            <MatchRow match={m} game={game} />
          </button>
        ))}
      </div>

      {selected && <MatchDetailDrawer match={selected} game={game} onClose={() => setSelected(null)} />}
    </div>
  );
}

function MatchDetailDrawer({
  match,
  game,
  onClose
}: {
  match: AnyMatchMock;
  game: GameKey;
  onClose: () => void;
}) {
  const heatmap = useMemo(() => makeHeatmap(match.id), [match.id]);
  const win = isWin(match, game);
  const isTFT = game === "tft";
  const isVAL = game === "valorant";
  const isLoR = game === "lor";

  let title = "";
  let subtitle = "";
  let stats: { label: string; value: string | number }[] = [];

  if (game === "lol") {
    const m = match as LolMatchMock;
    const [k, d, a] = m.kda.split("/").map(Number);
    title = m.champ;
    subtitle = `${m.role} · ${m.duration} · ${m.when}`;
    stats = [
      { label: "Abates", value: k },
      { label: "Mortes", value: d },
      { label: "Assistências", value: a },
      { label: "CS", value: m.cs },
      { label: "Dano", value: "24.8k" },
      { label: "Visão", value: 28 }
    ];
  } else if (isVAL) {
    const m = match as ValMatchMock;
    const [k, d, a] = m.kda.split("/").map(Number);
    title = m.agent;
    subtitle = `${m.map} · ${m.duration} · ${m.when}`;
    stats = [
      { label: "Abates", value: k },
      { label: "Mortes", value: d },
      { label: "Assistências", value: a },
      { label: "ACS", value: 264 },
      { label: "HS%", value: "34%" },
      { label: "First Bloods", value: 4 }
    ];
  } else if (isTFT) {
    const m = match as TftMatchMock;
    title = m.comp;
    subtitle = `${m.placement}º lugar · ${m.duration} · ${m.when}`;
    stats = [
      { label: "Colocação", value: `${m.placement}º` },
      { label: "Nível", value: m.level },
      { label: "Ouro restante", value: m.gold },
      { label: "Dano", value: 142 },
      { label: "Eliminações", value: 3 },
      { label: "Reroll", value: 18 }
    ];
  } else {
    const m = match as LorMatchMock;
    title = m.deck;
    subtitle = `${m.archetype} · ${m.duration} · ${m.when}`;
    stats = [
      { label: "Turnos", value: m.turns },
      { label: "Mulligans", value: m.mulligan },
      { label: "Mana usada", value: 38 },
      { label: "Cartas jogadas", value: 24 },
      { label: "Dano facial", value: 22 },
      { label: "Unidades inv.", value: 12 }
    ];
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "flex-end"
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="scroll"
        style={{
          width: 520,
          maxWidth: "95vw",
          height: "100vh",
          overflowY: "auto",
          background: "var(--bg-1)",
          borderLeft: "1px solid var(--line-2)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.5)"
        }}
      >
        <div style={{ padding: 24 }}>
          <button onClick={onClose} className="btn btn-ghost" style={{ marginBottom: 16 }}>
            ← Fechar
          </button>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              paddingBottom: 16,
              borderBottom: "1px solid var(--line)",
              marginBottom: 20,
              gap: 12
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div className="kbd" style={{ marginBottom: 6 }}>Detalhe da partida</div>
              <div
                className="font-game"
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  color: "var(--accent-2)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {title}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-2)", marginTop: 4 }}>{subtitle}</div>
            </div>
            <span className={`chip ${win ? "chip-win" : "chip-loss"}`}>
              {isTFT ? `${(match as TftMatchMock).placement}º` : win ? "VITÓRIA" : "DERROTA"}
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 24 }}>
            {stats.map((s) => (
              <div key={s.label}>
                <div className="kbd" style={{ fontSize: 9 }}>{s.label}</div>
                <div className="font-game" style={{ fontSize: 22, fontWeight: 600, marginTop: 4, lineHeight: 1 }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>

          {(game === "lol" || isVAL) && (
            <div style={{ marginBottom: 20 }}>
              <Heatmap
                data={heatmap}
                label={isVAL ? "Mapa de tiros" : "Mapa de presença"}
                mapName={isVAL ? (match as ValMatchMock).map : "Summoner's Rift"}
              />
              <div style={{ marginTop: 8 }}>
                <MockBadge label="heatmap demo" />
              </div>
            </div>
          )}

          {isTFT && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div className="kbd">Tabuleiro final</div>
                <MockBadge />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 4,
                  padding: 12,
                  background: "var(--bg-2)",
                  borderRadius: 10
                }}
              >
                {Array.from({ length: 28 }, (_, i) => {
                  const filled = [4, 5, 6, 11, 12, 13, 17, 18].includes(i);
                  const star = filled && [5, 12, 18].includes(i);
                  return (
                    <div
                      key={i}
                      style={{
                        aspectRatio: "1",
                        borderRadius: 6,
                        background: filled
                          ? "linear-gradient(135deg, var(--accent), var(--accent-deep))"
                          : "rgba(255,255,255,0.04)",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 9,
                        fontWeight: 700,
                        color: "#0a0a0d",
                        position: "relative"
                      }}
                    >
                      {filled && <span>U{i}</span>}
                      {star && (
                        <span style={{ position: "absolute", top: 2, right: 2, fontSize: 8, color: "#ffd95a" }}>
                          ★★★
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isLoR && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div className="kbd">Curva de mana</div>
                <MockBadge />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(8, 1fr)",
                  gap: 6,
                  alignItems: "end",
                  height: 80
                }}
              >
                {[2, 5, 8, 6, 7, 4, 3, 2].map((v, i) => (
                  <div key={i}>
                    <div
                      style={{
                        height: `${v * 10}px`,
                        background: "linear-gradient(180deg, var(--accent), var(--accent-deep))",
                        borderRadius: 4
                      }}
                    />
                    <div className="kbd" style={{ fontSize: 9, textAlign: "center", marginTop: 4 }}>
                      {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <button className="btn btn-ghost" style={{ justifyContent: "center" }}>Replay</button>
            <button className="btn btn-primary" style={{ justifyContent: "center" }}>
              Análise IA {Icons.brain}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

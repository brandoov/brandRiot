import type { GameKey } from "@/lib/gameKey";
import type { GameModel } from "@/lib/buildGameModel";
import MockBadge from "@/components/MockBadge";

interface Props {
  game: GameKey;
  model: GameModel;
}

const TIER_COLORS: Record<string, string> = {
  "S+": "#ff6b8a",
  S: "#d4a657",
  A: "#74b8e8",
  B: "#a8d878",
  C: "#888"
};

const PATCHES: Record<GameKey, string> = {
  lol: "14.9",
  valorant: "8.07",
  tft: "Set 11.5",
  lor: "4.10"
};

const ENTITY: Record<GameKey, string> = {
  lol: "campeões",
  valorant: "agentes",
  tft: "composições",
  lor: "decks"
};

export default function MetaView({ game, model }: Props) {
  return (
    <div style={{ padding: "28px 24px", display: "grid", gap: 20 }}>
      <div
        className="card"
        style={{
          padding: 24,
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--accent-bg) 60%, var(--bg-1)), var(--bg-1))"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="kbd">Meta atual</span>
          <MockBadge label="meta demo" />
        </div>
        <div className="font-game" style={{ fontSize: 26, fontWeight: 600, marginTop: 8, color: "var(--accent-2)" }}>
          Patch {PATCHES[game]} · O que está dominando
        </div>
        <div style={{ color: "var(--text-2)", marginTop: 6, fontSize: 13 }}>
          Análise dos {ENTITY[game]} mais fortes na sua elo · atualizado há 2 horas
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "60px minmax(0, 1fr) 100px 100px 100px 90px",
            padding: "12px 20px",
            background: "var(--bg-2)",
            fontSize: 10,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-2)"
          }}
        >
          <div>Tier</div>
          <div>Nome</div>
          <div style={{ textAlign: "right" }}>Win rate</div>
          <div style={{ textAlign: "right" }}>Pick rate</div>
          <div style={{ textAlign: "right" }}>Δ Patch</div>
          <div style={{ textAlign: "right" }}>Ação</div>
        </div>
        {model.metaPicks.map((p, i) => (
          <div
            key={p.name}
            style={{
              display: "grid",
              gridTemplateColumns: "60px minmax(0, 1fr) 100px 100px 100px 90px",
              padding: "14px 20px",
              alignItems: "center",
              borderTop: "1px solid var(--line)"
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: `${TIER_COLORS[p.tier]}22`,
                border: `1px solid ${TIER_COLORS[p.tier]}66`,
                color: TIER_COLORS[p.tier],
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
                fontSize: 13,
                fontFamily: "var(--game-font)"
              }}
            >
              {p.tier}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  background: "linear-gradient(135deg, var(--accent), var(--accent-deep))",
                  color: "#0a0a0d",
                  fontWeight: 700,
                  fontSize: 11,
                  display: "grid",
                  placeItems: "center",
                  flexShrink: 0
                }}
              >
                {p.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {p.name}
                </div>
                <div className="kbd" style={{ fontSize: 9 }}>posição #{i + 1}</div>
              </div>
            </div>
            <div style={{ textAlign: "right", fontFamily: "var(--game-font)", fontSize: 16, fontWeight: 600 }}>
              {p.wr}%
            </div>
            <div
              style={{
                textAlign: "right",
                fontFamily: "var(--game-font)",
                fontSize: 16,
                fontWeight: 600,
                color: "var(--text-1)"
              }}
            >
              {p.pr}%
            </div>
            <div
              style={{
                textAlign: "right",
                fontFamily: "var(--game-font)",
                fontSize: 14,
                fontWeight: 600,
                color: p.delta > 0 ? "#4adfa0" : p.delta < 0 ? "#ff8a95" : "var(--text-2)"
              }}
            >
              {p.delta > 0 ? "+" : ""}
              {p.delta}%
            </div>
            <div style={{ textAlign: "right" }}>
              <button className="btn btn-ghost" style={{ padding: "6px 12px", fontSize: 11 }}>Ver build</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="kbd">Tendências</span>
            <MockBadge />
          </div>
          <div className="font-game" style={{ fontSize: 18, fontWeight: 600, marginTop: 4, marginBottom: 14 }}>
            Subindo no patch
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {model.metaPicks
              .filter((p) => p.delta > 0)
              .map((p) => (
                <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 18 }}>📈</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                    <div className="kbd" style={{ fontSize: 9 }}>+{p.delta}% win rate</div>
                  </div>
                  <div style={{ color: "#4adfa0", fontFamily: "var(--game-font)", fontWeight: 600, fontSize: 16 }}>
                    +{p.delta}%
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="kbd">Counters do seu main</span>
            <MockBadge />
          </div>
          <div className="font-game" style={{ fontSize: 18, fontWeight: 600, marginTop: 4, marginBottom: 14 }}>
            Cuidado com estes picks
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {[
              { name: "Fizz", wr: 58, vs: "52%" },
              { name: "Pantheon", wr: 56, vs: "48%" },
              { name: "LeBlanc", wr: 54, vs: "44%" }
            ].map((c) => (
              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: "linear-gradient(135deg, #ff8a95, #c44a5a)",
                    color: "#0a0a0d",
                    fontWeight: 700,
                    fontSize: 11,
                    display: "grid",
                    placeItems: "center"
                  }}
                >
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                  <div className="kbd" style={{ fontSize: 9 }}>winrate vs você: {c.vs}</div>
                </div>
                <div className="bar" style={{ width: 80 }}>
                  <span style={{ width: `${c.wr}%`, background: "#ff8a95" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

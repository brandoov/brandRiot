import type { GameKey } from "@/lib/gameKey";
import type { GameModel } from "@/lib/buildGameModel";
import LineChart from "../primitives/LineChart";
import Donut from "../primitives/Donut";
import MockBadge from "@/components/MockBadge";
import { Icons } from "../icons";

interface Props {
  game: GameKey;
  model: GameModel;
}

const MONTHS = ["Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai"];
const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const WR_BY_DAY = [54, 67, 48, 72, 58, 64, 51];

export default function ReportsView({ game, model }: Props) {
  return (
    <div style={{ padding: "28px 24px", display: "grid", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="chip chip-accent">7 dias</button>
          <button className="chip">30 dias</button>
          <button className="chip">3 meses</button>
          <button className="chip">12 meses</button>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost">Exportar CSV</button>
          <button className="btn btn-ghost">{Icons.filter} Filtros</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 18 }}>
        <div className="card" style={{ padding: 20, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span className="kbd">Análise temporal</span>
            {model.mocked.rankProgression && <MockBadge />}
          </div>
          <div className="font-game" style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
            Win rate vs LP ganho · 12 meses
          </div>
          <LineChart
            series={[
              { data: model.rankProgression, color: "var(--accent)" },
              { data: model.winRate.map((v) => v - 30), color: "rgba(74, 223, 160, 0.7)" }
            ]}
            xLabels={MONTHS}
            w={700}
            h={260}
          />
          <div style={{ display: "flex", gap: 24, marginTop: 12, fontSize: 11 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 12, height: 2, background: "var(--accent)" }} />
              <span style={{ color: "var(--text-1)" }}>LP acumulado</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 12, height: 2, background: "rgba(74, 223, 160, 0.7)" }} />
              <span style={{ color: "var(--text-1)" }}>Win rate (%)</span>
            </span>
          </div>
        </div>

        <div className="card" style={{ padding: 20, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span className="kbd">Distribuição</span>
            <MockBadge />
          </div>
          <div className="font-game" style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
            {game === "tft" ? "Posições por partida" : "Modos de jogo"}
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <Donut
              size={180}
              label="partidas"
              value={263}
              data={
                game === "tft"
                  ? [
                      { value: 12, color: "#ffd95a" },
                      { value: 24, color: "#a8d878" },
                      { value: 18, color: "#74b8e8" },
                      { value: 22, color: "#a85bd1" },
                      { value: 14, color: "#e07a40" },
                      { value: 8, color: "#666" }
                    ]
                  : [
                      { value: 142, color: "var(--accent)" },
                      { value: 68, color: "color-mix(in oklab, var(--accent) 60%, transparent)" },
                      { value: 32, color: "color-mix(in oklab, var(--accent) 30%, transparent)" },
                      { value: 21, color: "var(--text-3)" }
                    ]
              }
            />
          </div>
          <div style={{ display: "grid", gap: 6, fontSize: 12 }}>
            {(game === "tft"
              ? ([
                  ["1º", "#ffd95a", "12"],
                  ["2º-3º", "#a8d878", "24"],
                  ["4º", "#74b8e8", "18"],
                  ["5º-6º", "#a85bd1", "22"],
                  ["7º", "#e07a40", "14"],
                  ["8º", "#666", "8"]
                ] as const)
              : ([
                  ["Solo/Duo", "var(--accent)", "142"],
                  ["Flex", "rgba(255,255,255,0.5)", "68"],
                  ["Normal", "rgba(255,255,255,0.3)", "32"],
                  ["Outros", "var(--text-3)", "21"]
                ] as const)
            ).map(([l, c, v]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                <span style={{ flex: 1, color: "var(--text-1)" }}>{l}</span>
                <span style={{ color: "var(--text-2)", fontFamily: "var(--game-font)", fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)", gap: 18 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span className="kbd">Performance por dia</span>
            <MockBadge />
          </div>
          <div className="font-game" style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>
            Win rate semanal
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 6,
              alignItems: "end",
              height: 140
            }}
          >
            {WR_BY_DAY.map((v, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 10, color: "var(--text-2)" }}>{v}%</div>
                <div
                  style={{
                    width: "70%",
                    height: `${v}%`,
                    background:
                      v > 60
                        ? "linear-gradient(180deg, var(--accent), var(--accent-deep))"
                        : "var(--bg-3)",
                    borderRadius: "4px 4px 0 0"
                  }}
                />
                <div className="kbd" style={{ fontSize: 9 }}>{DAYS[i]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span className="kbd">Comparação</span>
            <MockBadge label="amigos demo" />
          </div>
          <div className="font-game" style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>
            Você vs amigos
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {[
              { name: "Você", wr: 56, rank: model.rank.tier, color: "var(--accent)" },
              { name: "Mestre Lobo", wr: 62, rank: "DIAMOND", color: "rgba(255,255,255,0.4)" },
              { name: "KKjogador", wr: 51, rank: "EMERALD", color: "rgba(255,255,255,0.3)" },
              { name: "NoSkill42", wr: 47, rank: "PLATINUM", color: "rgba(255,255,255,0.2)" }
            ].map((p) => (
              <div
                key={p.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px minmax(0, 1fr) 80px",
                  gap: 12,
                  alignItems: "center"
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: p.name === "Você" ? 700 : 500,
                    color: p.name === "Você" ? "var(--accent-2)" : "var(--text-1)"
                  }}
                >
                  {p.name}
                </div>
                <div className="bar" style={{ height: 8 }}>
                  <span style={{ width: `${p.wr}%`, background: p.color }} />
                </div>
                <div className="font-mono" style={{ fontSize: 12, textAlign: "right" }}>
                  {p.wr}% · {p.rank}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { GAME_META } from "@/data/mock";
import type { GameKey } from "@/lib/gameKey";
import type { GameModel } from "@/lib/buildGameModel";
import RankPill from "../primitives/RankPill";
import Stat from "../primitives/Stat";
import KPI from "../primitives/KPI";
import Sparkline from "../primitives/Sparkline";
import LineChart from "../primitives/LineChart";
import ChampRow from "../primitives/ChampRow";
import MatchRow from "../primitives/MatchRow";
import MockBadge from "@/components/MockBadge";
import { Icons } from "../icons";

interface Props {
  game: GameKey;
  model: GameModel;
}

const MONTHS = ["Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai"];

export default function OverviewView({ game, model }: Props) {
  const meta = GAME_META[game];
  const total = model.rank.wins + model.rank.losses;
  const wr = total > 0 ? Math.round((model.rank.wins / total) * 100) : 0;
  const champLabel: Record<GameKey, string> = {
    lol: "Campeões",
    valorant: "Agentes",
    tft: "Composições",
    lor: "Decks"
  };

  return (
    <div style={{ padding: "28px 24px", display: "grid", gap: 20 }}>
      {/* Hero */}
      <div
        className="card"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: 24,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) auto",
          gap: 24,
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--accent-bg) 70%, var(--bg-1)) 0%, var(--bg-1) 60%)",
          border: "1px solid color-mix(in oklab, var(--accent) 22%, var(--line))"
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -80,
            top: -80,
            width: 360,
            height: 360,
            background: "radial-gradient(circle, var(--accent-glow), transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none"
          }}
        />
        <div style={{ position: "relative", zIndex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
            <span className="chip">{meta.region}</span>
            {model.mocked.summoner && <MockBadge label="invocador demo" />}
          </div>
          <h2
            className="font-game"
            style={{
              margin: 0,
              fontSize: 40,
              fontWeight: 600,
              lineHeight: 1,
              color: "var(--accent-2)",
              letterSpacing: "0.01em",
              wordBreak: "break-word"
            }}
          >
            {model.summoner.name}
            <span style={{ color: "var(--text-3)", fontSize: 24 }}> #{model.summoner.tag}</span>
          </h2>
          <div style={{ marginTop: 6, color: "var(--text-2)", fontSize: 13, fontStyle: "italic" }}>
            "{meta.tagline}"
          </div>

          <div style={{ display: "flex", gap: 24, marginTop: 24, alignItems: "flex-end", flexWrap: "wrap" }}>
            <RankPill tier={model.rank.tier} division={model.rank.division} lp={model.rank.lp} />
            <Stat
              label="Vitórias / Derrotas"
              value={`${model.rank.wins}V ${model.rank.losses}D`}
              sub={`${wr}% taxa de vitória`}
            />
            <Stat label="Nível invocador" value={model.summoner.level} />
            {game === "tft" && model.rank.top4 != null && (
              <Stat label="Top 4 rate" value={`${model.rank.top4}%`} sub="últimas 30" />
            )}
          </div>
        </div>

        <div style={{ display: "grid", gap: 12, alignContent: "center", minWidth: 220, position: "relative", zIndex: 1 }}>
          <div className="card-flat" style={{ padding: 14, background: "rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div className="kbd">LP nos últimos 30 dias</div>
              {model.mocked.rankProgression && <MockBadge />}
            </div>
            <Sparkline data={model.rankProgression} w={200} h={48} dots />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "var(--text-2)" }}>
              <span>
                +{model.rankProgression[model.rankProgression.length - 1] - model.rankProgression[0]} LP
              </span>
              <span>↑ tendência</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
        <KPI title="Taxa de vitória" value={`${wr}%`} delta={+3} spark={model.winRate} />
        <KPI
          title="KDA médio"
          value={game === "tft" ? "3.6" : game === "valorant" ? "1.32" : game === "lor" ? "—" : "3.4"}
          delta={+8}
          sub={game === "lor" ? "Vitórias por mulligan: 2.4" : "últimas 20 partidas"}
        />
        <KPI
          title={game === "tft" ? "Top 4 rate" : "CS/min"}
          value={game === "tft" ? "67%" : game === "valorant" ? "ACS 248" : game === "lor" ? "Turnos/jogo 11.4" : "7.2"}
          delta={+2}
        />
        <KPI title="Sequência atual" value="3W" sub="melhor da semana" pulse />
      </div>

      {/* Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)", gap: 16 }}>
        <div className="card" style={{ padding: 20, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="kbd">Progressão de classificação</span>
                {model.mocked.rankProgression && <MockBadge />}
              </div>
              <div className="font-game" style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>
                Últimos 12 meses
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="chip chip-accent">LP</button>
              <button className="chip">Win rate</button>
              <button className="chip">KDA</button>
            </div>
          </div>
          <LineChart
            series={[
              { data: model.rankProgression, color: "var(--accent)" },
              { data: model.winRate, color: "rgba(255,255,255,0.3)" }
            ]}
            xLabels={MONTHS}
            w={620}
            h={220}
          />
        </div>

        <div className="card" style={{ padding: 20, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="kbd">{champLabel[game]} mais jogados</span>
                {model.mocked.pool && <MockBadge />}
              </div>
              <div className="font-game" style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>
                Top 5 do mês
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {model.pool.slice(0, 5).map((p, i) => (
              <ChampRow key={p.name + i} item={p} game={game} rank={i + 1} />
            ))}
          </div>
        </div>
      </div>

      {/* Recent matches */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="kbd">Atividade recente</span>
              {model.mocked.matches && <MockBadge />}
            </div>
            <div className="font-game" style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>
              Últimas partidas
            </div>
          </div>
          <button className="btn btn-ghost">Ver todas {Icons.arrow}</button>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {model.matches.slice(0, 4).map((m) => (
            <MatchRow key={m.id} match={m} game={game} compact />
          ))}
        </div>
      </div>
    </div>
  );
}

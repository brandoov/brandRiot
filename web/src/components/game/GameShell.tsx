import { type ReactNode, useState } from "react";
import { GAME_META } from "@/data/mock";
import type { GameKey } from "@/lib/gameKey";
import { useGameTheme } from "@/lib/useGameTheme";
import Sidebar, { type ViewKey } from "./Sidebar";
import Topbar from "./Topbar";
import OverviewView from "./views/OverviewView";
import MatchesView from "./views/MatchesView";
import ReportsView from "./views/ReportsView";
import MetaView from "./views/MetaView";
import AIView from "./views/AIView";
import type { GameModel } from "@/lib/buildGameModel";

interface Props {
  game: GameKey;
  model: GameModel;
  searchSlot: ReactNode;
  riotIdLabel?: string;
  banner?: ReactNode;
}

const TITLES: Record<ViewKey, (gameName: string) => { title: string; sub: string }> = {
  overview: (n) => ({ title: n, sub: "Visão geral · Painel de invocador" }),
  matches: (n) => ({ title: "Partidas", sub: `${n} · Histórico completo` }),
  reports: (n) => ({ title: "Relatórios", sub: `${n} · Análise de dados` }),
  meta: (n) => ({ title: "Meta", sub: `${n} · Tendências do patch` }),
  ai: (n) => ({ title: "Análise IA", sub: `${n} · Treinador virtual` })
};

export default function GameShell({ game, model, searchSlot, riotIdLabel, banner }: Props) {
  const meta = GAME_META[game];
  const [view, setView] = useState<ViewKey>("overview");
  const [menuOpen, setMenuOpen] = useState(false);

  useGameTheme({ game, intensity: "cinematic" });

  const titles = TITLES[view](meta.name);

  const ViewComponent = (() => {
    switch (view) {
      case "overview":
        return OverviewView;
      case "matches":
        return MatchesView;
      case "reports":
        return ReportsView;
      case "meta":
        return MetaView;
      case "ai":
        return AIView;
    }
  })();

  return (
    <div
      data-game={game}
      data-intensity="cinematic"
      className="game-shell"
      style={{ display: "flex", minHeight: "100vh", background: "var(--bg-0)", color: "var(--text-0)" }}
    >
      {/* desktop sidebar */}
      <div className="game-sidebar-desktop">
        <Sidebar game={game} current={view} onNav={setView} riotId={riotIdLabel} />
      </div>

      {/* mobile drawer */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            display: "flex"
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Sidebar
              game={game}
              current={view}
              onNav={(v) => {
                setView(v);
                setMenuOpen(false);
              }}
              riotId={riotIdLabel}
              onClose={() => setMenuOpen(false)}
            />
          </div>
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
        <Topbar
          title={titles.title}
          subtitle={titles.sub}
          onOpenMenu={() => setMenuOpen(true)}
          right={<div style={{ minWidth: 280, flex: "1 1 280px", maxWidth: 640 }}>{searchSlot}</div>}
        />
        {banner && <div style={{ padding: "16px 24px 0 24px" }}>{banner}</div>}
        <ViewComponent game={game} model={model} />
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import type { GameKey } from "@/lib/gameKey";
import { GAME_META } from "@/data/mock";
import GameLogo from "./GameLogo";
import { Icons } from "./icons";

export type ViewKey = "overview" | "matches" | "reports" | "meta" | "ai";

interface Props {
  game: GameKey;
  current: ViewKey;
  onNav: (view: ViewKey) => void;
  collapsed?: boolean;
  onClose?: () => void;
  riotId?: string;
}

const ITEMS: { id: ViewKey; label: string; icon: typeof Icons.home }[] = [
  { id: "overview", label: "Visão geral", icon: Icons.home },
  { id: "matches", label: "Partidas", icon: Icons.history },
  { id: "reports", label: "Relatórios", icon: Icons.chart },
  { id: "meta", label: "Meta", icon: Icons.meta },
  { id: "ai", label: "Análise IA", icon: Icons.brain }
];

export default function Sidebar({ game, current, onNav, onClose, riotId }: Props) {
  const meta = GAME_META[game];
  return (
    <aside
      style={{
        width: 232,
        flexShrink: 0,
        background: "var(--bg-1)",
        borderRight: "1px solid var(--line)",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh"
      }}
    >
      <div
        style={{
          padding: "20px 18px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid var(--line)",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "var(--accent)",
              color: "var(--accent-bg)",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              fontSize: 14
            }}
          >
            bR
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.02em" }}>brandRiot</div>
            <div className="kbd">Companion</div>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={onClose}
            className="btn btn-ghost"
            style={{ padding: 6, width: 30, height: 30, justifyContent: "center" }}
          >
            {Icons.close}
          </button>
        )}
      </div>

      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 18px",
          textDecoration: "none",
          color: "var(--text-1)",
          borderBottom: "1px solid var(--line)",
          fontSize: 12,
          letterSpacing: "0.04em",
          textTransform: "uppercase"
        }}
      >
        <span style={{ transform: "rotate(180deg)" }}>{Icons.arrow}</span>
        <span>Trocar de jogo</span>
      </Link>

      <div
        style={{
          padding: "20px 18px",
          borderBottom: "1px solid var(--line)",
          display: "flex",
          alignItems: "center",
          gap: 12
        }}
      >
        <div style={{ color: "var(--accent)", flexShrink: 0 }}>
          <GameLogo game={game} size={28} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            className="font-game"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--accent-2)",
              letterSpacing: "0.02em",
              lineHeight: 1.15,
              wordBreak: "break-word"
            }}
          >
            {meta.name}
          </div>
          <div className="kbd" style={{ fontSize: 9, marginTop: 2 }}>
            {meta.region}
          </div>
        </div>
      </div>

      <nav style={{ padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {ITEMS.map((item) => {
          const active = current === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNav(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 8,
                border: 0,
                cursor: "pointer",
                background: active
                  ? "color-mix(in oklab, var(--accent) 14%, transparent)"
                  : "transparent",
                color: active ? "var(--accent-2)" : "var(--text-1)",
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                fontFamily: "inherit",
                textAlign: "left",
                position: "relative"
              }}
            >
              {active && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 8,
                    bottom: 8,
                    width: 2,
                    background: "var(--accent)",
                    borderRadius: 2
                  }}
                />
              )}
              <span style={{ color: active ? "var(--accent)" : "var(--text-2)" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: "auto", padding: 16, borderTop: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent), var(--accent-deep))",
              display: "grid",
              placeItems: "center",
              color: "#0a0a0d",
              fontWeight: 700,
              fontSize: 13
            }}
          >
            {(riotId ?? "bR").slice(0, 2).toUpperCase()}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {riotId ?? "Sem invocador"}
            </div>
            <div className="kbd" style={{ fontSize: 9 }}>Conectado · API v5</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

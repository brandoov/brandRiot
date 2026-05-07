import type { ReactNode } from "react";
import { Icons } from "./icons";

interface Props {
  title: string;
  subtitle: string;
  right?: ReactNode;
  onOpenMenu?: () => void;
}

export default function Topbar({ title, subtitle, right, onOpenMenu }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 24px",
        gap: 16,
        borderBottom: "1px solid var(--line)",
        position: "sticky",
        top: 0,
        zIndex: 5,
        background: "color-mix(in oklab, var(--bg-0) 80%, transparent)",
        backdropFilter: "blur(12px)",
        flexWrap: "wrap"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        {onOpenMenu && (
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Abrir menu"
            className="btn btn-ghost"
            style={{ padding: 8, width: 36, height: 36, justifyContent: "center" }}
          >
            {Icons.menu}
          </button>
        )}
        <div style={{ minWidth: 0 }}>
          <div className="kbd" style={{ marginBottom: 6 }}>
            {subtitle}
          </div>
          <h1
            className="font-game"
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "0.01em",
              color: "var(--text-0)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}
          >
            {title}
          </h1>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {right}
      </div>
    </div>
  );
}

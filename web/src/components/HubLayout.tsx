import { Outlet } from "react-router-dom";
import { useGameTheme } from "@/lib/useGameTheme";
import { useEffect, useState } from "react";
import { Icons } from "./game/icons";
import { demoMode } from "@/lib/env";

const MODE_KEY = "brandriot:mode";

export default function HubLayout() {
  const [mode, setMode] = useState<"dark" | "light">(() => {
    if (typeof localStorage === "undefined") return "dark";
    return (localStorage.getItem(MODE_KEY) as "dark" | "light" | null) ?? "dark";
  });

  // Hub não tem jogo selecionado — usamos o tema padrão (LoL) só para as paletas
  // base; o data-game será sobrescrito em cada página de jogo.
  useGameTheme({ game: "lol", intensity: "subtle", mode });

  useEffect(() => {
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch {
      // ignore
    }
  }, [mode]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-0)", color: "var(--text-0)" }}>
      {demoMode && <DemoBanner />}
      <Outlet context={{ mode, setMode } satisfies HubContext} />
    </div>
  );
}

function DemoBanner() {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        padding: "8px 16px",
        fontSize: 12,
        background: "linear-gradient(90deg, rgba(200, 170, 110, 0.12), rgba(255, 70, 85, 0.12), rgba(55, 205, 190, 0.12), rgba(212, 166, 87, 0.12))",
        borderBottom: "1px dashed rgba(255, 255, 255, 0.18)",
        color: "var(--text-1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        textAlign: "center",
        flexWrap: "wrap"
      }}
    >
      <span style={{ fontSize: 14 }}>⌬</span>
      <span>
        API integrada com a Riot Games — aguardando aprovação da chave de produção. Os dados exibidos são fictícios.
      </span>
    </div>
  );
}

export interface HubContext {
  mode: "dark" | "light";
  setMode: (mode: "dark" | "light") => void;
}

export function ModeToggle({ mode, onChange }: { mode: "dark" | "light"; onChange: (m: "dark" | "light") => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(mode === "dark" ? "light" : "dark")}
      className="btn btn-ghost"
      aria-label={mode === "dark" ? "Mudar para modo claro" : "Mudar para modo escuro"}
      style={{ padding: 8, width: 36, height: 36, justifyContent: "center" }}
    >
      {mode === "dark" ? Icons.sun : Icons.moon}
    </button>
  );
}

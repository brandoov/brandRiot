import { Outlet } from "react-router-dom";
import { useGameTheme } from "@/lib/useGameTheme";
import { useEffect, useState } from "react";
import { Icons } from "./game/icons";

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
      <Outlet context={{ mode, setMode } satisfies HubContext} />
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

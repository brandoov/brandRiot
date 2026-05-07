import { useEffect } from "react";
import type { GameKey } from "./gameKey";

export type Intensity = "subtle" | "medium" | "cinematic";
export type Mode = "dark" | "light";

interface Options {
  game?: GameKey;
  intensity?: Intensity;
  mode?: Mode;
}

/**
 * Aplica os atributos data-game / data-intensity / data-mode na <html>.
 * O CSS de tema (theme.css) reage a esses atributos para trocar paletas e fontes.
 * Argumentos undefined são deixados como estão.
 */
export function useGameTheme({ game, intensity, mode }: Options): void {
  useEffect(() => {
    const root = document.documentElement;
    if (game) root.setAttribute("data-game", game);
    if (intensity) root.setAttribute("data-intensity", intensity);
    if (mode) root.setAttribute("data-mode", mode);
  }, [game, intensity, mode]);
}

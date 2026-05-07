import { useCallback, useEffect, useState } from "react";
import type { RiotCluster, RiotPlatform } from "@/api/types";
import type { GameKey } from "./gameKey";

export interface RiotIdMemory {
  gameName: string;
  tagLine: string;
  platform: RiotPlatform;
  cluster: RiotCluster;
}

const STORAGE_KEY = (game: GameKey) => `brandriot:riotid:${game}`;

const DEFAULT_VALUES: RiotIdMemory = {
  gameName: "",
  tagLine: "BR1",
  platform: "Br1",
  cluster: "Americas"
};

function load(game: GameKey): RiotIdMemory | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(game));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<RiotIdMemory>;
    if (typeof parsed?.gameName === "string" && typeof parsed?.tagLine === "string") {
      return { ...DEFAULT_VALUES, ...parsed } as RiotIdMemory;
    }
  } catch {
    // ignore
  }
  return null;
}

export function useRiotIdMemory(game: GameKey): [RiotIdMemory, (next: RiotIdMemory) => void] {
  const [value, setValue] = useState<RiotIdMemory>(() => load(game) ?? DEFAULT_VALUES);

  useEffect(() => {
    const stored = load(game);
    if (stored) setValue(stored);
  }, [game]);

  const update = useCallback(
    (next: RiotIdMemory) => {
      setValue(next);
      try {
        localStorage.setItem(STORAGE_KEY(game), JSON.stringify(next));
      } catch {
        // ignore storage errors (private mode, etc.)
      }
    },
    [game]
  );

  return [value, update];
}

import type { GameKey } from "@/lib/gameKey";

interface Props {
  game: GameKey;
  size?: number;
}

export default function GameLogo({ game, size = 24 }: Props) {
  if (game === "lol") {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M16 3l11 6.5v13L16 29 5 22.5v-13L16 3z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 7.5l7 4v9l-7 4-7-4v-9l7-4z" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
        <circle cx="16" cy="16" r="2.5" fill="currentColor" />
      </svg>
    );
  }
  if (game === "valorant") {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M3 6l11 14h-5L3 11V6z" fill="currentColor" />
        <path d="M29 6L18 20h-3l8-10 6-4z" fill="currentColor" />
        <path d="M14 22h4l1 4h-6l1-4z" fill="currentColor" opacity="0.8" />
      </svg>
    );
  }
  if (game === "tft") {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M16 3l13 7.5v11L16 29 3 21.5v-11L16 3z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M16 9l7 4v6l-7 4-7-4v-6l7-4z" fill="currentColor" opacity="0.25" />
        <circle cx="16" cy="16" r="2" fill="currentColor" />
        <circle cx="11" cy="13" r="1.2" fill="currentColor" />
        <circle cx="21" cy="13" r="1.2" fill="currentColor" />
        <circle cx="11" cy="19" r="1.2" fill="currentColor" />
        <circle cx="21" cy="19" r="1.2" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="6" y="3" width="20" height="26" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 8v16M10 11h12M10 21h12" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M16 13l2 3-2 3-2-3 2-3z" fill="currentColor" />
    </svg>
  );
}

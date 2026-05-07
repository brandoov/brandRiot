import type { ReactNode } from "react";

interface IconProps {
  d: ReactNode;
  size?: number;
  stroke?: number;
}

export function Icon({ d, size = 16, stroke = 1.6 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {d}
    </svg>
  );
}

export const Icons = {
  home: (
    <Icon
      d={
        <>
          <path d="M3 11l9-8 9 8" />
          <path d="M5 10v10h14V10" />
        </>
      }
    />
  ),
  history: (
    <Icon
      d={
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </>
      }
    />
  ),
  chart: (
    <Icon
      d={
        <>
          <path d="M3 21h18" />
          <path d="M6 17v-6" />
          <path d="M11 17V7" />
          <path d="M16 17v-9" />
          <path d="M21 17v-3" />
        </>
      }
    />
  ),
  brain: (
    <Icon
      d={
        <>
          <path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-2 3 3 3 0 0 0 2 3v1a3 3 0 0 0 3 3h1V4H9z" />
          <path d="M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 2 3 3 3 0 0 1-2 3v1a3 3 0 0 1-3 3h-1V4h1z" />
        </>
      }
    />
  ),
  search: (
    <Icon
      d={
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.5-4.5" />
        </>
      }
    />
  ),
  bell: (
    <Icon
      d={
        <>
          <path d="M6 16V11a6 6 0 0 1 12 0v5" />
          <path d="M4 16h16" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </>
      }
    />
  ),
  filter: (
    <Icon
      d={
        <>
          <path d="M3 5h18" />
          <path d="M6 12h12" />
          <path d="M10 19h4" />
        </>
      }
    />
  ),
  meta: (
    <Icon
      d={
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v3" />
          <path d="M12 18v3" />
          <path d="M3 12h3" />
          <path d="M18 12h3" />
          <path d="M5.6 5.6l2.1 2.1" />
          <path d="M16.3 16.3l2.1 2.1" />
          <path d="M5.6 18.4l2.1-2.1" />
          <path d="M16.3 7.7l2.1-2.1" />
        </>
      }
    />
  ),
  arrow: (
    <Icon
      d={
        <>
          <path d="M5 12h14" />
          <path d="M13 5l7 7-7 7" />
        </>
      }
    />
  ),
  menu: (
    <Icon
      d={
        <>
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
        </>
      }
    />
  ),
  close: (
    <Icon
      d={
        <>
          <path d="M6 18L18 6" />
          <path d="M6 6l12 12" />
        </>
      }
    />
  ),
  sun: (
    <Icon
      d={
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </>
      }
    />
  ),
  moon: (
    <Icon
      d={
        <>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </>
      }
    />
  )
};

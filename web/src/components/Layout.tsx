import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const navItems: { to: string; label: string; description: string }[] = [
  { to: "/", label: "Início", description: "Visão geral" },
  { to: "/lol", label: "League of Legends", description: "Invocadores e partidas" },
  { to: "/tft", label: "Teamfight Tactics", description: "Companions e ranked" },
  { to: "/valorant", label: "VALORANT", description: "Match history (chave de produção)" },
  { to: "/lor", label: "Legends of Runeterra", description: "Decks e leaderboards" }
];

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold text-brand-700">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-white">
              BR
            </span>
            <span className="text-base sm:text-lg">BrandRiot</span>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Alternar menu"
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-700 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <nav className="border-t border-slate-200 bg-white md:hidden">
            <ul className="mx-auto max-w-6xl divide-y divide-slate-100">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex flex-col px-4 py-3 ${
                        isActive ? "bg-brand-50 text-brand-700" : "text-slate-700"
                      }`
                    }
                  >
                    <span className="text-sm font-semibold">{item.label}</span>
                    <span className="text-xs text-slate-500">{item.description}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500 sm:px-6">
          BrandRiot &middot; integração com Riot Games Developer API. Frontend de placeholder — substituível pelo
          design do Claude Design.
        </div>
      </footer>
    </div>
  );
}

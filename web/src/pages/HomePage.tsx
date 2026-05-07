import { Link } from "react-router-dom";

const games = [
  {
    to: "/lol",
    title: "League of Legends",
    description: "Resolva Riot ID, ranked, partidas recentes e champion mastery.",
    accent: "from-indigo-500 to-blue-600"
  },
  {
    to: "/tft",
    title: "Teamfight Tactics",
    description: "Companions, traits e classificação ranked do invocador.",
    accent: "from-fuchsia-500 to-purple-600"
  },
  {
    to: "/valorant",
    title: "VALORANT",
    description: "Match history e dados de conteúdo (chave de produção).",
    accent: "from-rose-500 to-red-600"
  },
  {
    to: "/lor",
    title: "Legends of Runeterra",
    description: "Decks, partidas e leaderboard Master.",
    accent: "from-emerald-500 to-teal-600"
  }
];

export default function HomePage() {
  return (
    <section className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
          Riot Games · Developer API
        </p>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          BrandRiot — uma API .NET, quatro jogos, dados prontos para análise.
        </h1>
        <p className="max-w-2xl text-slate-600">
          Cada página abaixo consome o controller correspondente em <code>/api/&lt;jogo&gt;</code>. Os dados retornados são
          persistidos em PostgreSQL para visualizações futuras (gráficos, relatórios, análises).
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {games.map((g) => (
          <Link
            key={g.to}
            to={g.to}
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${g.accent}`}
            />
            <h2 className="text-lg font-semibold text-slate-900 group-hover:text-brand-700">
              {g.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{g.description}</p>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-brand-600">
              Abrir página →
            </span>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
        <strong className="font-semibold text-slate-800">Próximo passo.</strong> Substitua os componentes por aqueles
        gerados pelo Claude Design — eles podem reaproveitar diretamente <code>src/api/endpoints.ts</code>,
        <code className="ml-1">src/api/types.ts</code> e o hook <code>useApi</code>.
      </div>
    </section>
  );
}

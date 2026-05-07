# BrandRiot — Frontend

Frontend Vite + React + TypeScript com tema dark cinemático integrado a partir do Claude Design. Cada jogo da Riot tem sua própria paleta, fonte e layout, montados em torno do mesmo `<GameShell>`.

## Rodar localmente

```bash
cd web
npm install
npm run dev
```

A aplicação abre em http://localhost:5173. O `vite.config.ts` faz proxy de `/api` e `/health` para `http://localhost:5260` (backend .NET), então nada de CORS em desenvolvimento.

## Arquitetura

```
src/
├── api/                       # cliente HTTP tipado consumindo o backend
│   ├── client.ts              # fetch com mapeamento ProblemDetails → ApiError
│   ├── endpoints.ts           # uma função por endpoint, agrupadas por jogo
│   └── types.ts               # espelho dos DTOs em BrandRiot.Application/Dtos/Api
├── data/
│   └── mock.ts                # fixtures usados nos cards ainda sem agregação real
├── lib/
│   ├── gameKey.ts             # tipo "lol" | "valorant" | "tft" | "lor"
│   ├── useApi.ts              # hook fetch com data/loading/error/run
│   ├── useGameTheme.ts        # aplica data-game/intensity/mode na <html>
│   ├── useRiotIdMemory.ts     # persiste o último Riot ID por jogo no localStorage
│   └── buildGameModel.ts      # adapta resposta da API real → modelo único usado nas views
├── components/
│   ├── HubLayout.tsx          # layout do hub (header + Outlet) + toggle dark/light
│   ├── MockBadge.tsx          # selo "dados demo" para cards alimentados por mock
│   ├── RiotIdSearch.tsx       # busca Riot ID (variante "card" e "inline")
│   ├── StatusBanner.tsx       # banner de loading / erro / vazio
│   └── game/
│       ├── GameShell.tsx      # sidebar + topbar + switcher de view por jogo
│       ├── Sidebar.tsx        # nav de 5 views, drawer no mobile
│       ├── Topbar.tsx         # título + slot de busca
│       ├── icons.tsx          # ícones SVG inline
│       ├── GameLogo.tsx       # marcas dos 4 jogos
│       ├── primitives/        # Sparkline, LineChart, Donut, Heatmap, RankPill,
│       │                      # Stat, KPI, MatchRow, ChampRow
│       └── views/             # OverviewView, MatchesView, ReportsView, MetaView, AIView
├── pages/
│   ├── HomePage.tsx           # hub com hero + grid de 4 jogos (responsivo)
│   ├── LolPage.tsx            # consome lolApi → buildLolModel → <GameShell game="lol">
│   ├── TftPage.tsx            # idem com tftApi
│   ├── ValorantPage.tsx       # account-v1 + valorant.matchHistory
│   └── LorPage.tsx            # leaderboard + match history
├── styles/
│   └── theme.css              # tema baseado em CSS variables (data-game/intensity/mode)
└── App.tsx                    # rotas
```

## Tema e fontes

- O CSS de tema (`src/styles/theme.css`) define todas as paletas via CSS variables.
  `data-game="lol|valorant|tft|lor"` no `<html>` troca `--accent`, `--accent-bg`, `--accent-glow` e `--game-font`.
- `data-mode="dark|light"` controla os neutros — toggle no Hub persiste a escolha em `localStorage`.
- `data-intensity="subtle|medium|cinematic"` controla a intensidade dos backgrounds. Páginas de jogo usam `cinematic`, Hub usa `subtle`.
- Fontes: Inter (corpo), Cinzel (LoL/headline), EB Garamond (LoR), Oswald (Valorant), Space Grotesk (TFT), JetBrains Mono (números).
  Carregadas via `<link>` em `index.html` com `font-display: swap`.

## Camada de dados — mocks vs reais

`src/lib/buildGameModel.ts` produz um shape único (`GameModel`) consumido pelas views. Cada campo vem de uma destas três origens:

| Campo no GameModel | Origem | Marcado com `<MockBadge/>`? |
|---|---|---|
| `summoner` | `lolApi/tftApi/accountApi` (real) | Só se a busca ainda não foi feita |
| `rank` | `lolApi.ranked / tftApi.ranked` | Só se sem ranked entry |
| `matches` | `lolApi.recentMatches / tftApi.recentMatches / valorantApi.matchHistory / lorApi.recentMatches` | Só se a lista vier vazia |
| `rankProgression`, `winRate` | mock (não persistimos histórico ainda) | Sempre |
| `pool` (top 5 campeões/agentes/comps/decks) | mock (não temos endpoint de agregação) | Sempre |
| `metaPicks` (tier list) | mock (Riot não fornece) | Sempre |
| Heatmap, curva de mana, tabuleiro TFT no drawer | mock | Sempre |

Quando o backend ganhar endpoints de agregação, basta substituir o retorno de `buildGameModel` — a UI permanece.

## Atualizar tipos a partir do Swagger

Sempre que o backend mudar:

```bash
# 1. com a API rodando:
curl http://localhost:5260/swagger/v1/swagger.json > web/swagger.json
# 2. gerar:
cd web && npm run generate:api
```

Isso regrava `src/api/generated/schema.ts`.

## Build / preview

```bash
npm run build    # tsc -b && vite build → web/dist/
npm run preview  # serve o dist localmente
npm run lint     # tsc -b --noEmit
```

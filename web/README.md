# BrandRiot — Frontend

Frontend Vite + React + TypeScript + Tailwind, usado como placeholder enquanto o **Claude Design** não entrega o design final. Os componentes daqui podem ser totalmente substituídos — o que precisa permanecer é a camada de API (`src/api/`).

## Rodar localmente

```bash
cd web
npm install
npm run dev
```

A aplicação abre em http://localhost:5173. O `vite.config.ts` faz proxy de `/api` e `/health` para `http://localhost:5260` (o backend .NET), então não precisa configurar CORS para desenvolvimento.

## Como o frontend conversa com o backend

```
src/api/
├── client.ts      # fetch tipado, mapeia ProblemDetails para ApiError
├── endpoints.ts   # uma função por endpoint do backend, organizadas por jogo
├── types.ts       # tipos TS espelhando os DTOs em BrandRiot.Application/Dtos/Api/*
└── generated/     # destino do `openapi-typescript` (opcional)
```

`src/lib/useApi.ts` é um hook leve para chamar qualquer função de `endpoints.ts`. Cada página segue o mesmo padrão:

```tsx
const matches = useApi(lolApi.recentMatches);
await matches.run(puuid, { cluster: "Americas", count: 5 });
// matches.data, matches.loading, matches.error
```

## Atualizar tipos a partir do Swagger

Sempre que o backend mudar:

```bash
# 1. com a API rodando:
curl http://localhost:5260/swagger/v1/swagger.json > web/swagger.json
# 2. gerar:
cd web && npm run generate:api
```

Isso regrava `src/api/generated/schema.ts`. Ajuste `types.ts` (ou substitua por imports do schema gerado) conforme preferir.

## Estrutura de páginas (uma por jogo)

```
src/pages/
├── HomePage.tsx
├── LolPage.tsx        # /api/lol
├── TftPage.tsx        # /api/tft
├── ValorantPage.tsx   # /api/valorant (chave de produção)
└── LorPage.tsx        # /api/lor
```

Roteamento em `src/App.tsx`. Layout responsivo em `src/components/Layout.tsx` (header com navegação que vira menu hamburguer no mobile). Componente reutilizável `RiotIdSearch` para os formulários "Game Name + Tag Line + platform + cluster".

## Substituir pelo design do Claude Design

1. Pegue os componentes/páginas que o Claude Design entregar.
2. Substitua arquivos em `src/components/` e `src/pages/`.
3. **Mantenha** os imports de `src/api/endpoints.ts` e `src/lib/useApi.ts` — eles já cuidam da chamada HTTP, do `Retry-After`, dos tipos.
4. Se o novo design usar uma biblioteca de UI (shadcn/Radix/MUI/etc.), instale com `npm install` dentro de `web/`.

## Build

```bash
npm run build    # gera web/dist/
npm run preview  # serve o dist localmente para validar
```

Para servir o `dist/` direto pelo .NET em produção, ver a seção correspondente no `README.md` da raiz.

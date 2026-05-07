# Security Policy

## Escopo do projeto

O **BrandRiot** é um projeto educacional / portfolio que integra com a [Riot Games Developer API](https://developer.riotgames.com/). A pasta `web/` (frontend Vite + React + TS) é distribuída publicamente via **GitHub Pages em modo demonstração**, com `VITE_DEMO_MODE=true` — sem chamadas reais à API e sem qualquer dado sensível.

A pasta `src/` (backend ASP.NET Core 8 + EF Core + PostgreSQL) **não é hospedada publicamente em nenhum momento**. Roda apenas localmente (`localhost:5260`) durante desenvolvimento.

## ⚠️ Aviso importante — backend é dev-only

O backend **não tem autenticação ou autorização**. Os endpoints em `/api/...` aceitam qualquer requisição que chegue. Isso é intencional para a fase atual do projeto, mas tem implicações de segurança que você precisa entender se for adaptar o código.

**Não exponha o backend publicamente (atrás de IP público, port forwarding, túnel ngrok permanente, deploy em PaaS, etc.) sem antes adicionar:**

1. **Autenticação** nos endpoints (JWT, OAuth, Riot Sign-On — qualquer coisa).
2. **Rate limiting por consumidor** (não confundir com o rate limit da Riot embutido no `RiotResponseHandler`).
3. **Origem CORS restrita** ao domínio do seu frontend em produção.
4. **`AllowedHosts`** configurado para o domínio público específico.
5. **Logs sem PII** se você for processar contas reais de outras pessoas.

Se ignorar isso e expor o backend, qualquer um na internet poderá:
- **Esgotar o rate limit da sua chave Riot**, fazendo com que ela seja banida pela Riot.
- **Inserir dados arbitrários no seu Postgres** via os upserts dos serviços.
- **Consultar dados de qualquer Riot ID**, registrando-os no seu banco.

## Credenciais e segredos

- **Chave da Riot API** (`Riot:ApiKey`): nunca commitar. Em dev, usar `dotnet user-secrets`. Em prod, variável de ambiente `Riot__ApiKey`.
- **Connection string do Postgres** (`ConnectionStrings:Default`): a senha em `appsettings.json` é `brandriot_dev` — propositalmente trivial, vale apenas para o Postgres do `docker-compose.yml` rodando localmente. **Sobrescreva** em produção via `ConnectionStrings__Default` ou User Secrets.
- O repositório passa em `git secret-scanning` e em `npm audit` (0 vulnerabilidades) na data deste arquivo.

## Reportar uma vulnerabilidade

Se encontrar uma falha de segurança neste projeto:

1. **Não abra uma issue pública** descrevendo o problema.
2. Abra uma [security advisory privada](https://github.com/brandoov/brandRiot/security/advisories/new) no GitHub, **ou**
3. Envie um e-mail para o mantenedor do repositório (ver perfil GitHub `@brandoov`).

Resposta esperada em até **7 dias úteis**.

## Versões suportadas

Como projeto educacional, apenas a `main` recebe atualizações. Forks e branches antigos não são mantidos.

## Dependências

- `npm audit --omit=dev` deve retornar 0 vulnerabilidades.
- `dotnet list package --vulnerable --include-transitive` deve retornar 0 em todos os 4 projetos.

Se uma das dependências ganhar uma CVE depois da publicação, abra uma issue ou um PR — o ideal é manter as duas saídas zeradas.

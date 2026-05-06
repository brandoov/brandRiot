# BrandRiot

API .NET 8 para integração com a [Riot Games Developer API](https://developer.riotgames.com/). Coleta e persiste dados dos quatro jogos da Riot — League of Legends, Teamfight Tactics, VALORANT e Legends of Runeterra — em PostgreSQL, expondo endpoints organizados por jogo prontos para serem consumidos por um frontend (responsivo via Swagger UI por enquanto).

## Arquitetura

Solução em Clean Architecture com 4 projetos:

```
src/
├── BrandRiot.Domain/          # entidades, enums, contratos de repositório (sem dependências)
├── BrandRiot.Application/     # DTOs, interfaces e serviços (depende de Domain)
├── BrandRiot.Infrastructure/  # EF Core + PostgreSQL, clientes HTTP Riot, resilience
└── BrandRiot.Api/             # Controllers (1 por jogo), Swagger, CORS, health checks
```

Direção de dependências: `Api → Application → Domain` e `Api → Infrastructure → Application → Domain`.

## Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Docker](https://docs.docker.com/get-docker/) (para o PostgreSQL local)
- Ferramenta global `dotnet-ef`: `dotnet tool install --global dotnet-ef --version 8.*`
- Uma chave de desenvolvimento da Riot Games em https://developer.riotgames.com/

## Configuração

### 1. Banco de dados

```bash
docker compose up -d postgres
```

Sobe um Postgres 16 em `localhost:5432` (banco/usuário/senha `brandriot`).

### 2. Chave da API Riot

Em desenvolvimento, use User Secrets (recomendado — nunca cometido):

```bash
dotnet user-secrets set "Riot:ApiKey" "RGAPI-..." --project src/BrandRiot.Api
```

Em produção, use a variável de ambiente `Riot__ApiKey` (duplo underline para chaves aninhadas).

### 3. Migrations

```bash
dotnet ef database update \
  --project src/BrandRiot.Infrastructure \
  --startup-project src/BrandRiot.Api
```

Em `appsettings.Development.json` o `Riot:AutoMigrate=true` aplica as migrations automaticamente no startup.

### 4. Executar

```bash
dotnet run --project src/BrandRiot.Api
```

A API sobe em `http://localhost:5260` (porta definida em `Properties/launchSettings.json`).

- **Swagger UI:** http://localhost:5260/swagger — responsiva, ideal para celular enquanto o frontend definitivo não chega
- **Health:** http://localhost:5260/health
- **Health (ready):** http://localhost:5260/health/ready

## Endpoints

Todos os endpoints aceitam `platform` (`Br1, Na1, Euw1, Eun1, Tr1, Ru, Kr, Jp1, Lan, Las, Oc1, Ph2, Sg2, Th2, Tw2, Vn2`) e `cluster` (`Americas, Europe, Asia, Sea`) como query string. Defaults: `platform=Br1`, `cluster=Americas`.

### Account
- `GET /api/account/by-riot-id?gameName=&tagLine=&cluster=`
- `GET /api/account/by-puuid/{puuid}?cluster=`

### League of Legends
- `GET /api/lol/players/by-riot-id?gameName=&tagLine=&platform=&cluster=`
- `GET /api/lol/players/{puuid}/summoner?platform=`
- `GET /api/lol/players/{puuid}/matches?cluster=&start=0&count=20&queue=&type=`
- `GET /api/lol/matches/{matchId}?cluster=`
- `GET /api/lol/players/{puuid}/ranked?platform=`
- `GET /api/lol/players/{puuid}/champion-mastery?platform=&top=10`

### Teamfight Tactics
- `GET /api/tft/players/by-riot-id?gameName=&tagLine=&platform=&cluster=`
- `GET /api/tft/players/{puuid}/summoner?platform=`
- `GET /api/tft/players/{puuid}/matches?cluster=&start=0&count=20`
- `GET /api/tft/matches/{matchId}?cluster=`
- `GET /api/tft/players/{puuid}/ranked?platform=`

### VALORANT (chave de produção)
> Esses endpoints requerem chave **de produção** da Riot. Chaves de desenvolvimento normalmente retornam 403. Para mais informações: https://developer.riotgames.com/

- `GET /api/valorant/players/{puuid}/matches?platform=`
- `GET /api/valorant/matches/{matchId}?platform=`
- `GET /api/valorant/content?platform=&locale=`
- `GET /api/valorant/players/{puuid}/ranked?platform=`

### Legends of Runeterra
- `GET /api/lor/players/{puuid}/matches?cluster=`
- `GET /api/lor/matches/{matchId}?cluster=`
- `GET /api/lor/leaderboards/master?cluster=`

## Persistência

Schema PostgreSQL `riot` com as tabelas: `riot_accounts`, `lol_summoners`, `lol_matches`, `lol_match_participants`, `lol_league_entries`, `lol_champion_masteries`, `tft_summoners`, `tft_matches`, `tft_match_participants`, `tft_league_entries`, `valorant_matches`, `valorant_match_players`, `valorant_content_items`, `valorant_ranked_entries`, `lor_matches`, `lor_match_players`, `lor_ranked_leaderboard_entries`. Todos os dados retornados pela Riot são persistidos para visualizações futuras (gráficos, relatórios, análises).

Inspecione os dados:

```bash
psql -h localhost -U brandriot -d brandriot -c "SELECT count(*) FROM riot.lol_matches;"
```

## Resiliência HTTP

Cada cliente HTTP da Riot usa `Microsoft.Extensions.Http.Resilience` (Polly v8) com:
- Retry (4 tentativas, exponencial com jitter; respeita `Retry-After` em 429/503)
- Circuit breaker (failure ratio 0.5, sampling 30 s, min throughput 8)
- Timeout por tentativa (10 s)
- DelegatingHandler que injeta `X-Riot-Token` e mapeia 429/4xx/5xx para `RiotApiException`/`RiotRateLimitException`

Configurável via seção `RiotResilience` em `appsettings.json`.

## CORS

Frontend ainda não existe — quando o Claude Design produzir, basta listar a origem em `Cors:AllowedOrigins`. Em Development o default é `*` para facilitar o consumo durante o desenvolvimento.

## Verificação manual

1. `docker compose up -d postgres`
2. `dotnet user-secrets set "Riot:ApiKey" "RGAPI-..." --project src/BrandRiot.Api`
3. `dotnet build`
4. `dotnet run --project src/BrandRiot.Api`
5. Abrir `/swagger` — confirmar 5 grupos: Account, League of Legends, Teamfight Tactics, VALORANT, Legends of Runeterra
6. Smoke test (ex.: `Faker#KR1`):
   - `GET /api/account/by-riot-id?gameName=Faker&tagLine=KR1&cluster=Asia`
   - `GET /api/lol/players/by-riot-id?gameName=Faker&tagLine=KR1&platform=Kr&cluster=Asia`
   - `GET /api/lol/players/{puuid}/matches?cluster=Asia&count=5`
   - `GET /api/lor/leaderboards/master?cluster=Americas` (não exige puuid)
7. Verificar persistência: `SELECT count(*) FROM riot.lol_matches;`

## Layout do código

```
BrandRiot.sln
docker-compose.yml
Directory.Build.props          # nullable, warnings as errors, XML docs
Directory.Packages.props       # Central Package Management
src/
├── BrandRiot.Domain/
│   ├── Common/Entity.cs
│   ├── Enums/                 # RiotPlatform, RiotCluster, GameTitle
│   ├── Entities/              # Accounts, Lol, Tft, Valorant, Lor
│   └── Abstractions/          # IUnitOfWork, IRiotAccountRepository, I*Repository
├── BrandRiot.Application/
│   ├── Common/                # Result, RiotDefaults, RiotRouting
│   ├── Dtos/Riot/             # shape JSON cru retornado pela Riot
│   ├── Dtos/Api/              # shape exposto pelos controllers
│   ├── Abstractions/Riot/     # contratos de cliente HTTP (1 por endpoint group)
│   ├── Abstractions/Services/ # contratos de serviço (1 por jogo)
│   ├── Services/              # implementações (chamam Riot, persistem, mapeiam)
│   └── DependencyInjection.cs
├── BrandRiot.Infrastructure/
│   ├── Persistence/
│   │   ├── BrandRiotDbContext.cs
│   │   ├── UnitOfWork.cs
│   │   ├── DesignTimeDbContextFactory.cs
│   │   ├── Configurations/    # IEntityTypeConfiguration por entidade
│   │   ├── Repositories/      # repositórios concretos
│   │   └── Migrations/        # `dotnet ef migrations add`
│   ├── Riot/
│   │   ├── Options/           # RiotOptions, RiotResilienceOptions
│   │   ├── Http/              # RiotApiKeyHandler, RiotResponseHandler, RiotClientNames
│   │   ├── Clients/           # RiotAccountClient, LolPlatformClient, LolMatchClient,
│   │   │                      # TftPlatformClient, TftMatchClient,
│   │   │                      # ValorantPlatformClient, LorMatchClient
│   │   └── Exceptions/        # RiotApiException, RiotRateLimitException
│   └── DependencyInjection.cs
└── BrandRiot.Api/
    ├── Program.cs
    ├── Controllers/           # AccountController + 1 por jogo
    ├── Filters/RiotApiExceptionFilter.cs
    ├── appsettings.json
    └── appsettings.Development.json
```

## Fora do escopo (deferido)

Autenticação/RSO; frontend dedicado, gráficos e dashboards (virão com o Claude Design); workers de refresh agendado; cache adicional (Redis); webhooks; multi-tenant; agregações analíticas; Dockerfile da própria API; testes automatizados; CI/CD; OpenTelemetry/Prometheus.

/**
 * Tipos de resposta espelhando os DTOs em `BrandRiot.Application/Dtos/Api/*`.
 * Para regenerar automaticamente a partir do Swagger:
 *   1. Rodar a API (`dotnet run --project src/BrandRiot.Api`)
 *   2. Salvar o doc:  curl http://localhost:5260/swagger/v1/swagger.json > web/swagger.json
 *   3. `npm run generate:api`  (gera src/api/generated/schema.ts via openapi-typescript)
 */

export type RiotPlatform =
  | "Br1" | "Na1" | "Lan" | "Las" | "Euw1" | "Eun1" | "Tr1" | "Ru"
  | "Kr"  | "Jp1" | "Oc1" | "Ph2" | "Sg2"  | "Th2"  | "Tw2" | "Vn2";

export type RiotCluster = "Americas" | "Europe" | "Asia" | "Sea";

export interface PlayerSummaryResponse {
  puuid: string;
  gameName: string;
  tagLine: string;
  cluster: string;
  lastSeenPlatform: string | null;
  firstFetchedUtc: string;
  lastFetchedUtc: string;
}

export interface LolPlayerResponse {
  puuid: string;
  gameName: string;
  tagLine: string;
  platform: string;
  summonerId: string;
  profileIconId: number;
  summonerLevel: number;
  revisionDate: number;
}

export interface LolMatchParticipantResponse {
  puuid: string;
  championId: number;
  championName: string;
  teamId: number;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  goldEarned: number;
  totalDamageDealtToChampions: number;
  visionScore: number;
  csTotal: number;
  lane: string;
  role: string;
}

export interface LolMatchResponse {
  matchId: string;
  platform: string;
  gameCreationUtc: string;
  gameDurationSeconds: number;
  gameVersion: string;
  queueId: number;
  mapId: number;
  gameMode: string;
  gameType: string;
  participants: LolMatchParticipantResponse[];
}

export interface LolRankedEntryResponse {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
}

export interface LolRankedResponse {
  puuid: string;
  entries: LolRankedEntryResponse[];
}

export interface LolChampionMasteryResponse {
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTimeUtc: string;
  championPointsSinceLastLevel: number;
  championPointsUntilNextLevel: number;
  tokensEarned: number;
  chestGranted: boolean;
}

export interface TftPlayerResponse {
  puuid: string;
  gameName: string;
  tagLine: string;
  platform: string;
  summonerId: string;
  profileIconId: number;
  summonerLevel: number;
}

export interface TftMatchParticipantResponse {
  puuid: string;
  placement: number;
  level: number;
  lastRound: number;
  playersEliminated: number;
  totalDamageToPlayers: number;
  goldLeft: number;
}

export interface TftMatchResponse {
  matchId: string;
  cluster: string;
  gameDateUtc: string;
  gameLengthSeconds: number;
  gameVersion: string;
  queueId: number;
  tftSetNumber: number;
  tftGameType: string;
  participants: TftMatchParticipantResponse[];
}

export interface TftRankedEntryResponse {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
}

export interface TftRankedResponse {
  puuid: string;
  entries: TftRankedEntryResponse[];
}

export interface ValorantMatchPlayerResponse {
  puuid: string;
  teamId: string;
  characterId: string;
  score: number;
  roundsPlayed: number;
  kills: number;
  deaths: number;
  assists: number;
}

export interface ValorantMatchResponse {
  matchId: string;
  platform: string;
  mapId: string;
  gameVersion: string;
  queueId: string;
  gameStartUtc: string;
  gameLengthMillis: number;
  isCompleted: boolean;
  seasonId: string;
  players: ValorantMatchPlayerResponse[];
}

export interface ValorantMatchHistoryEntryResponse {
  matchId: string;
  gameStartUtc: string;
  queueId: string;
}

export interface ValorantMatchHistoryResponse {
  puuid: string;
  history: ValorantMatchHistoryEntryResponse[];
}

export interface ValorantContentResponse {
  version: string;
  characterCount: number;
  mapCount: number;
  gameModeCount: number;
  actCount: number;
}

export interface ValorantRankedResponse {
  puuid: string;
  actId: string;
  tier: number;
  rankedRating: number;
  numberOfWins: number;
}

export interface LorMatchPlayerResponse {
  puuid: string;
  deckId: string;
  deckCode: string;
  gameOutcome: string;
  orderOfPlay: number;
}

export interface LorMatchResponse {
  matchId: string;
  cluster: string;
  gameStartUtc: string;
  gameMode: string;
  gameType: string;
  gameVersion: string;
  gameFormat: string;
  totalTurnCount: number;
  players: LorMatchPlayerResponse[];
}

export interface LorMatchIdsResponse {
  puuid: string;
  cluster: string;
  matchIds: string[];
}

export interface LorLeaderboardEntryResponse {
  rank: number;
  name: string;
  leaguePoints: number;
}

export interface LorLeaderboardResponse {
  cluster: string;
  fetchedAtUtc: string;
  entries: LorLeaderboardEntryResponse[];
}

import { apiGet } from "./client";
import type {
  LolChampionMasteryResponse,
  LolMatchResponse,
  LolPlayerResponse,
  LolRankedResponse,
  LorLeaderboardResponse,
  LorMatchIdsResponse,
  LorMatchResponse,
  PlayerSummaryResponse,
  RiotCluster,
  RiotPlatform,
  TftMatchResponse,
  TftPlayerResponse,
  TftRankedResponse,
  ValorantContentResponse,
  ValorantMatchHistoryResponse,
  ValorantMatchResponse,
  ValorantRankedResponse
} from "./types";

interface PlatformQuery {
  platform?: RiotPlatform;
}
interface ClusterQuery {
  cluster?: RiotCluster;
}
type RouteQuery = PlatformQuery & ClusterQuery;

export const accountApi = {
  byRiotId: (gameName: string, tagLine: string, q: ClusterQuery = {}, signal?: AbortSignal) =>
    apiGet<PlayerSummaryResponse>("/api/account/by-riot-id", {
      signal,
      query: { gameName, tagLine, cluster: q.cluster }
    }),
  byPuuid: (puuid: string, q: ClusterQuery = {}, signal?: AbortSignal) =>
    apiGet<PlayerSummaryResponse>(`/api/account/by-puuid/${encodeURIComponent(puuid)}`, {
      signal,
      query: { cluster: q.cluster }
    })
};

export const lolApi = {
  playerByRiotId: (gameName: string, tagLine: string, q: RouteQuery = {}, signal?: AbortSignal) =>
    apiGet<LolPlayerResponse>("/api/lol/players/by-riot-id", {
      signal,
      query: { gameName, tagLine, platform: q.platform, cluster: q.cluster }
    }),
  summoner: (puuid: string, q: PlatformQuery = {}, signal?: AbortSignal) =>
    apiGet<LolPlayerResponse>(`/api/lol/players/${encodeURIComponent(puuid)}/summoner`, {
      signal,
      query: { platform: q.platform }
    }),
  recentMatches: (
    puuid: string,
    q: ClusterQuery & { start?: number; count?: number; queue?: number; type?: string } = {},
    signal?: AbortSignal
  ) =>
    apiGet<LolMatchResponse[]>(`/api/lol/players/${encodeURIComponent(puuid)}/matches`, {
      signal,
      query: { cluster: q.cluster, start: q.start, count: q.count, queue: q.queue, type: q.type }
    }),
  matchById: (matchId: string, q: ClusterQuery = {}, signal?: AbortSignal) =>
    apiGet<LolMatchResponse>(`/api/lol/matches/${encodeURIComponent(matchId)}`, {
      signal,
      query: { cluster: q.cluster }
    }),
  ranked: (puuid: string, q: PlatformQuery = {}, signal?: AbortSignal) =>
    apiGet<LolRankedResponse>(`/api/lol/players/${encodeURIComponent(puuid)}/ranked`, {
      signal,
      query: { platform: q.platform }
    }),
  championMastery: (puuid: string, q: PlatformQuery & { top?: number } = {}, signal?: AbortSignal) =>
    apiGet<LolChampionMasteryResponse[]>(
      `/api/lol/players/${encodeURIComponent(puuid)}/champion-mastery`,
      { signal, query: { platform: q.platform, top: q.top } }
    )
};

export const tftApi = {
  playerByRiotId: (gameName: string, tagLine: string, q: RouteQuery = {}, signal?: AbortSignal) =>
    apiGet<TftPlayerResponse>("/api/tft/players/by-riot-id", {
      signal,
      query: { gameName, tagLine, platform: q.platform, cluster: q.cluster }
    }),
  summoner: (puuid: string, q: PlatformQuery = {}, signal?: AbortSignal) =>
    apiGet<TftPlayerResponse>(`/api/tft/players/${encodeURIComponent(puuid)}/summoner`, {
      signal,
      query: { platform: q.platform }
    }),
  recentMatches: (
    puuid: string,
    q: ClusterQuery & { start?: number; count?: number } = {},
    signal?: AbortSignal
  ) =>
    apiGet<TftMatchResponse[]>(`/api/tft/players/${encodeURIComponent(puuid)}/matches`, {
      signal,
      query: { cluster: q.cluster, start: q.start, count: q.count }
    }),
  matchById: (matchId: string, q: ClusterQuery = {}, signal?: AbortSignal) =>
    apiGet<TftMatchResponse>(`/api/tft/matches/${encodeURIComponent(matchId)}`, {
      signal,
      query: { cluster: q.cluster }
    }),
  ranked: (puuid: string, q: PlatformQuery = {}, signal?: AbortSignal) =>
    apiGet<TftRankedResponse>(`/api/tft/players/${encodeURIComponent(puuid)}/ranked`, {
      signal,
      query: { platform: q.platform }
    })
};

export const valorantApi = {
  matchHistory: (puuid: string, q: PlatformQuery = {}, signal?: AbortSignal) =>
    apiGet<ValorantMatchHistoryResponse>(
      `/api/valorant/players/${encodeURIComponent(puuid)}/matches`,
      { signal, query: { platform: q.platform } }
    ),
  matchById: (matchId: string, q: PlatformQuery = {}, signal?: AbortSignal) =>
    apiGet<ValorantMatchResponse>(`/api/valorant/matches/${encodeURIComponent(matchId)}`, {
      signal,
      query: { platform: q.platform }
    }),
  content: (q: PlatformQuery & { locale?: string } = {}, signal?: AbortSignal) =>
    apiGet<ValorantContentResponse>("/api/valorant/content", {
      signal,
      query: { platform: q.platform, locale: q.locale }
    }),
  ranked: (puuid: string, q: PlatformQuery = {}, signal?: AbortSignal) =>
    apiGet<ValorantRankedResponse>(`/api/valorant/players/${encodeURIComponent(puuid)}/ranked`, {
      signal,
      query: { platform: q.platform }
    })
};

export const lorApi = {
  recentMatches: (puuid: string, q: ClusterQuery = {}, signal?: AbortSignal) =>
    apiGet<LorMatchIdsResponse>(`/api/lor/players/${encodeURIComponent(puuid)}/matches`, {
      signal,
      query: { cluster: q.cluster }
    }),
  matchById: (matchId: string, q: ClusterQuery = {}, signal?: AbortSignal) =>
    apiGet<LorMatchResponse>(`/api/lor/matches/${encodeURIComponent(matchId)}`, {
      signal,
      query: { cluster: q.cluster }
    }),
  masterLeaderboard: (q: ClusterQuery = {}, signal?: AbortSignal) =>
    apiGet<LorLeaderboardResponse>("/api/lor/leaderboards/master", {
      signal,
      query: { cluster: q.cluster }
    })
};

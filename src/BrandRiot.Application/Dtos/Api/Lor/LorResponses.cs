namespace BrandRiot.Application.Dtos.Api.Lor;

public sealed record LorMatchResponse(
    string MatchId,
    string Cluster,
    DateTime GameStartUtc,
    string GameMode,
    string GameType,
    string GameVersion,
    string GameFormat,
    int TotalTurnCount,
    IReadOnlyList<LorMatchPlayerResponse> Players);

public sealed record LorMatchPlayerResponse(
    string Puuid,
    string DeckId,
    string DeckCode,
    string GameOutcome,
    int OrderOfPlay);

public sealed record LorMatchIdsResponse(string Puuid, string Cluster, IReadOnlyList<string> MatchIds);

public sealed record LorLeaderboardResponse(
    string Cluster,
    DateTime FetchedAtUtc,
    IReadOnlyList<LorLeaderboardEntryResponse> Entries);

public sealed record LorLeaderboardEntryResponse(int Rank, string Name, int LeaguePoints);

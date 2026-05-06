namespace BrandRiot.Application.Dtos.Api.Valorant;

public sealed record ValorantMatchResponse(
    string MatchId,
    string Platform,
    string MapId,
    string GameVersion,
    string QueueId,
    DateTime GameStartUtc,
    long GameLengthMillis,
    bool IsCompleted,
    string SeasonId,
    IReadOnlyList<ValorantMatchPlayerResponse> Players);

public sealed record ValorantMatchPlayerResponse(
    string Puuid,
    string TeamId,
    string CharacterId,
    int Score,
    int RoundsPlayed,
    int Kills,
    int Deaths,
    int Assists);

public sealed record ValorantContentResponse(
    string Version,
    int CharacterCount,
    int MapCount,
    int GameModeCount,
    int ActCount);

public sealed record ValorantRankedResponse(
    string Puuid,
    string ActId,
    int Tier,
    int RankedRating,
    int NumberOfWins);

public sealed record ValorantMatchHistoryResponse(
    string Puuid,
    IReadOnlyList<ValorantMatchHistoryEntryResponse> History);

public sealed record ValorantMatchHistoryEntryResponse(
    string MatchId,
    DateTime GameStartUtc,
    string QueueId);

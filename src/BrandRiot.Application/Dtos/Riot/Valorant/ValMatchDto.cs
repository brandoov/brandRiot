namespace BrandRiot.Application.Dtos.Riot.Valorant;

public sealed record ValMatchDto(ValMatchInfoDto MatchInfo, IReadOnlyList<ValMatchPlayerDto> Players);

public sealed record ValMatchInfoDto(
    string MatchId,
    string MapId,
    long GameLengthMillis,
    long GameStartMillis,
    string ProvisioningFlowId,
    bool IsCompleted,
    string CustomGameName,
    string QueueId,
    string GameMode,
    string GameVersion,
    string SeasonId);

public sealed record ValMatchPlayerDto(
    string Puuid,
    string TeamId,
    string CharacterId,
    ValPlayerStatsDto Stats);

public sealed record ValPlayerStatsDto(int Score, int RoundsPlayed, int Kills, int Deaths, int Assists, long PlaytimeMillis);

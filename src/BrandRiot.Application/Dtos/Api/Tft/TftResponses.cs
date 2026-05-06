namespace BrandRiot.Application.Dtos.Api.Tft;

public sealed record TftPlayerResponse(
    string Puuid,
    string GameName,
    string TagLine,
    string Platform,
    string SummonerId,
    int ProfileIconId,
    long SummonerLevel);

public sealed record TftMatchResponse(
    string MatchId,
    string Cluster,
    DateTime GameDateUtc,
    long GameLengthSeconds,
    string GameVersion,
    int QueueId,
    int TftSetNumber,
    string TftGameType,
    IReadOnlyList<TftMatchParticipantResponse> Participants);

public sealed record TftMatchParticipantResponse(
    string Puuid,
    int Placement,
    int Level,
    int LastRound,
    int PlayersEliminated,
    long TotalDamageToPlayers,
    int GoldLeft);

public sealed record TftRankedResponse(string Puuid, IReadOnlyList<TftRankedEntryResponse> Entries);

public sealed record TftRankedEntryResponse(
    string QueueType,
    string Tier,
    string Rank,
    int LeaguePoints,
    int Wins,
    int Losses,
    bool HotStreak);

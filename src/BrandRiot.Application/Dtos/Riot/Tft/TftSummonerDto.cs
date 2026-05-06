namespace BrandRiot.Application.Dtos.Riot.Tft;

public sealed record TftSummonerDto(
    string Id,
    string AccountId,
    string Puuid,
    int ProfileIconId,
    long RevisionDate,
    long SummonerLevel);

public sealed record TftLeagueEntryDto(
    string LeagueId,
    string SummonerId,
    string QueueType,
    string Tier,
    string Rank,
    int LeaguePoints,
    int Wins,
    int Losses,
    bool HotStreak,
    bool Veteran,
    bool FreshBlood,
    bool Inactive);

public sealed record TftMatchDto(TftMatchMetadataDto Metadata, TftMatchInfoDto Info);

public sealed record TftMatchMetadataDto(string MatchId, IReadOnlyList<string> Participants);

public sealed record TftMatchInfoDto(
    long GameDatetime,
    double GameLength,
    string GameVersion,
    int QueueId,
    string TftGameType,
    int TftSetNumber,
    IReadOnlyList<TftMatchParticipantDto> Participants);

public sealed record TftMatchParticipantDto(
    string Puuid,
    int Placement,
    int Level,
    int LastRound,
    int PlayersEliminated,
    long TotalDamageToPlayers,
    int GoldLeft,
    double TimeEliminated,
    string CompanionContentId,
    System.Text.Json.JsonElement Traits,
    System.Text.Json.JsonElement Units,
    System.Text.Json.JsonElement? Augments);

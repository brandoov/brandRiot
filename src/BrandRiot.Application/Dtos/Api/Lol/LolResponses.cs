namespace BrandRiot.Application.Dtos.Api.Lol;

public sealed record LolPlayerResponse(
    string Puuid,
    string GameName,
    string TagLine,
    string Platform,
    string SummonerId,
    int ProfileIconId,
    long SummonerLevel,
    long RevisionDate);

public sealed record LolMatchResponse(
    string MatchId,
    string Platform,
    DateTime GameCreationUtc,
    long GameDurationSeconds,
    string GameVersion,
    int QueueId,
    int MapId,
    string GameMode,
    string GameType,
    IReadOnlyList<LolMatchParticipantResponse> Participants);

public sealed record LolMatchParticipantResponse(
    string Puuid,
    int ChampionId,
    string ChampionName,
    int TeamId,
    bool Win,
    int Kills,
    int Deaths,
    int Assists,
    long GoldEarned,
    long TotalDamageDealtToChampions,
    int VisionScore,
    int CsTotal,
    string Lane,
    string Role);

public sealed record LolRankedResponse(
    string Puuid,
    IReadOnlyList<LolRankedEntryResponse> Entries);

public sealed record LolRankedEntryResponse(
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

public sealed record LolChampionMasteryResponse(
    int ChampionId,
    int ChampionLevel,
    long ChampionPoints,
    DateTime LastPlayTimeUtc,
    long ChampionPointsSinceLastLevel,
    long ChampionPointsUntilNextLevel,
    int TokensEarned,
    bool ChestGranted);

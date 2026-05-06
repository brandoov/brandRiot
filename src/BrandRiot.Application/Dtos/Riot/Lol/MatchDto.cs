namespace BrandRiot.Application.Dtos.Riot.Lol;

public sealed record MatchDto(MatchMetadataDto Metadata, MatchInfoDto Info);

public sealed record MatchMetadataDto(string DataVersion, string MatchId, IReadOnlyList<string> Participants);

public sealed record MatchInfoDto(
    long GameCreation,
    long GameDuration,
    long GameStartTimestamp,
    long? GameEndTimestamp,
    string GameVersion,
    string GameMode,
    string GameType,
    int MapId,
    string PlatformId,
    int QueueId,
    IReadOnlyList<MatchParticipantDto> Participants);

public sealed record MatchParticipantDto(
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
    int TotalMinionsKilled,
    int NeutralMinionsKilled,
    string Lane,
    string Role,
    int Item0,
    int Item1,
    int Item2,
    int Item3,
    int Item4,
    int Item5,
    int Item6,
    int Summoner1Id,
    int Summoner2Id,
    PerksDto? Perks);

public sealed record PerksDto(PerkStyleDto? PrimaryStyle);

public sealed record PerkStyleDto(int Style, IReadOnlyList<PerkSelectionDto> Selections);

public sealed record PerkSelectionDto(int Perk);

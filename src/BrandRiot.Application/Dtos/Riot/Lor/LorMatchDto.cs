namespace BrandRiot.Application.Dtos.Riot.Lor;

public sealed record LorMatchDto(LorMatchMetadataDto Metadata, LorMatchInfoDto Info);

public sealed record LorMatchMetadataDto(string MatchId, IReadOnlyList<string> Participants);

public sealed record LorMatchInfoDto(
    string GameMode,
    string GameType,
    string GameStartTimeUtc,
    string GameVersion,
    string GameFormat,
    int TotalTurnCount,
    IReadOnlyList<LorPlayerDto> Players);

public sealed record LorPlayerDto(
    string Puuid,
    string DeckId,
    string DeckCode,
    IReadOnlyList<string> Factions,
    string GameOutcome,
    int OrderOfPlay);

public sealed record LorMatchIdsDto(IReadOnlyList<string> MatchIds);

public sealed record LorLeaderboardDto(IReadOnlyList<LorLeaderboardPlayerDto> Players);

public sealed record LorLeaderboardPlayerDto(string Name, int Rank, int LeaguePoints);

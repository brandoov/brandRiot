namespace BrandRiot.Application.Dtos.Riot.Valorant;

public sealed record ValRankedDto(
    string Puuid,
    string ActId,
    int Tier,
    int RankedRating,
    int NumberOfWins);

public sealed record ValMatchHistoryEntryDto(string MatchId, long GameStartTimeMillis, string QueueId);
public sealed record ValMatchHistoryDto(string Puuid, IReadOnlyList<ValMatchHistoryEntryDto> History);

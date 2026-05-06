namespace BrandRiot.Application.Dtos.Riot.Lol;

public sealed record LeagueEntryDto(
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

using BrandRiot.Domain.Common;

namespace BrandRiot.Domain.Entities.Lol;

public class LolLeagueEntry : Entity
{
    public string Puuid { get; set; } = string.Empty;
    public string SummonerId { get; set; } = string.Empty;
    public string QueueType { get; set; } = string.Empty;
    public string Tier { get; set; } = string.Empty;
    public string Rank { get; set; } = string.Empty;
    public int LeaguePoints { get; set; }
    public int Wins { get; set; }
    public int Losses { get; set; }
    public bool HotStreak { get; set; }
    public bool Veteran { get; set; }
    public bool FreshBlood { get; set; }
    public bool Inactive { get; set; }
    public DateTime FetchedAtUtc { get; set; }
}

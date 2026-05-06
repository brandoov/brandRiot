using BrandRiot.Domain.Common;
using BrandRiot.Domain.Enums;

namespace BrandRiot.Domain.Entities.Tft;

public class TftSummoner : Entity
{
    public string Puuid { get; set; } = string.Empty;
    public string SummonerId { get; set; } = string.Empty;
    public string AccountId { get; set; } = string.Empty;
    public int ProfileIconId { get; set; }
    public long SummonerLevel { get; set; }
    public long RevisionDate { get; set; }
    public RiotPlatform Platform { get; set; }
}

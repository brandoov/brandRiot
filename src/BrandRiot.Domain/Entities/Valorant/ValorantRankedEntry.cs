using BrandRiot.Domain.Common;

namespace BrandRiot.Domain.Entities.Valorant;

public class ValorantRankedEntry : Entity
{
    public string Puuid { get; set; } = string.Empty;
    public string ActId { get; set; } = string.Empty;
    public int Tier { get; set; }
    public int RankedRating { get; set; }
    public int NumberOfWins { get; set; }
    public DateTime FetchedAtUtc { get; set; }
}

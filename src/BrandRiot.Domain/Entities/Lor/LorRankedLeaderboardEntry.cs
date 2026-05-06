using BrandRiot.Domain.Common;
using BrandRiot.Domain.Enums;

namespace BrandRiot.Domain.Entities.Lor;

public class LorRankedLeaderboardEntry : Entity
{
    public RiotCluster Cluster { get; set; }
    public int Rank { get; set; }
    public string Name { get; set; } = string.Empty;
    public int LeaguePoints { get; set; }
    public DateTime FetchedAtUtc { get; set; }
}

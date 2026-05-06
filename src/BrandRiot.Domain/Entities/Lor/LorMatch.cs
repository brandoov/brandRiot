using BrandRiot.Domain.Common;
using BrandRiot.Domain.Enums;

namespace BrandRiot.Domain.Entities.Lor;

public class LorMatch : Entity
{
    public string MatchId { get; set; } = string.Empty;
    public RiotCluster Cluster { get; set; }
    public DateTime GameStartUtc { get; set; }
    public string GameMode { get; set; } = string.Empty;
    public string GameType { get; set; } = string.Empty;
    public string GameVersion { get; set; } = string.Empty;
    public string GameFormat { get; set; } = string.Empty;
    public int TotalTurnCount { get; set; }

    public ICollection<LorMatchPlayer> Players { get; set; } = new List<LorMatchPlayer>();
}

using BrandRiot.Domain.Common;
using BrandRiot.Domain.Enums;

namespace BrandRiot.Domain.Entities.Accounts;

public class RiotAccount : Entity
{
    public string Puuid { get; set; } = string.Empty;
    public string GameName { get; set; } = string.Empty;
    public string TagLine { get; set; } = string.Empty;
    public RiotCluster ResolvedCluster { get; set; }
    public RiotPlatform? LastSeenPlatform { get; set; }
    public DateTime FirstFetchedUtc { get; set; }
    public DateTime LastFetchedUtc { get; set; }
}

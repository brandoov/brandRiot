using BrandRiot.Domain.Common;
using BrandRiot.Domain.Enums;

namespace BrandRiot.Domain.Entities.Valorant;

public class ValorantMatch : Entity
{
    public string MatchId { get; set; } = string.Empty;
    public RiotPlatform Platform { get; set; }
    public string MapId { get; set; } = string.Empty;
    public string GameVersion { get; set; } = string.Empty;
    public string QueueId { get; set; } = string.Empty;
    public DateTime GameStartUtc { get; set; }
    public long GameLengthMillis { get; set; }
    public bool IsCompleted { get; set; }
    public string SeasonId { get; set; } = string.Empty;

    public ICollection<ValorantMatchPlayer> Players { get; set; } = new List<ValorantMatchPlayer>();
}

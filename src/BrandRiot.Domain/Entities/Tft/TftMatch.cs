using BrandRiot.Domain.Common;
using BrandRiot.Domain.Enums;

namespace BrandRiot.Domain.Entities.Tft;

public class TftMatch : Entity
{
    public string MatchId { get; set; } = string.Empty;
    public RiotCluster Cluster { get; set; }
    public DateTime GameDateUtc { get; set; }
    public long GameLengthSeconds { get; set; }
    public string GameVersion { get; set; } = string.Empty;
    public int QueueId { get; set; }
    public int TftSetNumber { get; set; }
    public string TftGameType { get; set; } = string.Empty;

    public ICollection<TftMatchParticipant> Participants { get; set; } = new List<TftMatchParticipant>();
}

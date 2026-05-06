using BrandRiot.Domain.Common;
using BrandRiot.Domain.Enums;

namespace BrandRiot.Domain.Entities.Lol;

public class LolMatch : Entity
{
    public string MatchId { get; set; } = string.Empty;
    public RiotPlatform Platform { get; set; }
    public DateTime GameCreationUtc { get; set; }
    public long GameDurationSeconds { get; set; }
    public string GameVersion { get; set; } = string.Empty;
    public int QueueId { get; set; }
    public int MapId { get; set; }
    public string GameMode { get; set; } = string.Empty;
    public string GameType { get; set; } = string.Empty;

    public ICollection<LolMatchParticipant> Participants { get; set; } = new List<LolMatchParticipant>();
}

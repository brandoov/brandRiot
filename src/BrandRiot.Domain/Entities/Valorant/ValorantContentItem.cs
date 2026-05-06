using BrandRiot.Domain.Common;

namespace BrandRiot.Domain.Entities.Valorant;

public class ValorantContentItem : Entity
{
    public string ContentType { get; set; } = string.Empty;
    public string ContentId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string LocalizedNamesJson { get; set; } = "{}";
    public string AssetPath { get; set; } = string.Empty;
    public DateTime FetchedAtUtc { get; set; }
    public bool IsActive { get; set; }
}

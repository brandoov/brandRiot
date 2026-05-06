namespace BrandRiot.Domain.Entities.Valorant;

public class ValorantMatchPlayer
{
    public string MatchId { get; set; } = string.Empty;
    public string Puuid { get; set; } = string.Empty;

    public string TeamId { get; set; } = string.Empty;
    public string CharacterId { get; set; } = string.Empty;
    public int Score { get; set; }
    public int RoundsPlayed { get; set; }
    public int Kills { get; set; }
    public int Deaths { get; set; }
    public int Assists { get; set; }
    public long PlaytimeMillis { get; set; }
    public string AbilityCastsJson { get; set; } = "{}";
    public string DamagePerRoundJson { get; set; } = "[]";

    public ValorantMatch? Match { get; set; }
}

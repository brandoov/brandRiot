namespace BrandRiot.Domain.Entities.Tft;

public class TftMatchParticipant
{
    public string MatchId { get; set; } = string.Empty;
    public string Puuid { get; set; } = string.Empty;

    public int Placement { get; set; }
    public int Level { get; set; }
    public int LastRound { get; set; }
    public int PlayersEliminated { get; set; }
    public long TotalDamageToPlayers { get; set; }
    public int GoldLeft { get; set; }
    public double TimeEliminatedSeconds { get; set; }
    public string CompanionContentId { get; set; } = string.Empty;
    public string TraitsJson { get; set; } = "[]";
    public string UnitsJson { get; set; } = "[]";
    public string AugmentsJson { get; set; } = "[]";

    public TftMatch? Match { get; set; }
}

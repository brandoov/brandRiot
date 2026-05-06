namespace BrandRiot.Domain.Entities.Lor;

public class LorMatchPlayer
{
    public string MatchId { get; set; } = string.Empty;
    public string Puuid { get; set; } = string.Empty;

    public string DeckCode { get; set; } = string.Empty;
    public string DeckId { get; set; } = string.Empty;
    public string GameOutcome { get; set; } = string.Empty;
    public int OrderOfPlay { get; set; }
    public string FactionsJson { get; set; } = "[]";

    public LorMatch? Match { get; set; }
}

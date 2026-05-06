namespace BrandRiot.Domain.Entities.Lol;

public class LolMatchParticipant
{
    public string MatchId { get; set; } = string.Empty;
    public string Puuid { get; set; } = string.Empty;

    public int ChampionId { get; set; }
    public string ChampionName { get; set; } = string.Empty;
    public int TeamId { get; set; }
    public bool Win { get; set; }
    public int Kills { get; set; }
    public int Deaths { get; set; }
    public int Assists { get; set; }
    public long GoldEarned { get; set; }
    public long TotalDamageDealtToChampions { get; set; }
    public int VisionScore { get; set; }
    public int CsTotal { get; set; }
    public string Lane { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int Item0 { get; set; }
    public int Item1 { get; set; }
    public int Item2 { get; set; }
    public int Item3 { get; set; }
    public int Item4 { get; set; }
    public int Item5 { get; set; }
    public int Item6 { get; set; }
    public int Summoner1Id { get; set; }
    public int Summoner2Id { get; set; }
    public int? KeystonePerk { get; set; }

    public LolMatch? Match { get; set; }
}

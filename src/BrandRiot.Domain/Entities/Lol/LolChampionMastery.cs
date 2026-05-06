namespace BrandRiot.Domain.Entities.Lol;

public class LolChampionMastery
{
    public string Puuid { get; set; } = string.Empty;
    public int ChampionId { get; set; }

    public int ChampionLevel { get; set; }
    public long ChampionPoints { get; set; }
    public DateTime LastPlayTimeUtc { get; set; }
    public long ChampionPointsSinceLastLevel { get; set; }
    public long ChampionPointsUntilNextLevel { get; set; }
    public int TokensEarned { get; set; }
    public bool ChestGranted { get; set; }
    public DateTime FetchedAtUtc { get; set; }
}

namespace BrandRiot.Application.Dtos.Riot.Lol;

public sealed record ChampionMasteryDto(
    string Puuid,
    int ChampionId,
    int ChampionLevel,
    long ChampionPoints,
    long LastPlayTime,
    long ChampionPointsSinceLastLevel,
    long ChampionPointsUntilNextLevel,
    int TokensEarned,
    bool ChestGranted);

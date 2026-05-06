namespace BrandRiot.Application.Dtos.Api;

public sealed record PlayerSummaryResponse(
    string Puuid,
    string GameName,
    string TagLine,
    string Cluster,
    string? LastSeenPlatform,
    DateTime FirstFetchedUtc,
    DateTime LastFetchedUtc);

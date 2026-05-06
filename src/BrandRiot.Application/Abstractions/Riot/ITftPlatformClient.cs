using BrandRiot.Application.Dtos.Riot.Tft;
using BrandRiot.Domain.Enums;

namespace BrandRiot.Application.Abstractions.Riot;

public interface ITftPlatformClient
{
    Task<TftSummonerDto> GetSummonerByPuuidAsync(string puuid, RiotPlatform platform, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<TftLeagueEntryDto>> GetLeagueEntriesByPuuidAsync(string puuid, RiotPlatform platform, CancellationToken cancellationToken = default);
}

public interface ITftMatchClient
{
    Task<IReadOnlyList<string>> GetRecentMatchIdsAsync(string puuid, RiotCluster cluster, int start, int count, CancellationToken cancellationToken = default);
    Task<TftMatchDto> GetMatchAsync(string matchId, RiotCluster cluster, CancellationToken cancellationToken = default);
}

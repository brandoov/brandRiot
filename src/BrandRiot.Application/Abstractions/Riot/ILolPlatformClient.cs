using BrandRiot.Application.Dtos.Riot.Lol;
using BrandRiot.Domain.Enums;

namespace BrandRiot.Application.Abstractions.Riot;

public interface ILolPlatformClient
{
    Task<SummonerDto> GetSummonerByPuuidAsync(string puuid, RiotPlatform platform, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<LeagueEntryDto>> GetLeagueEntriesByPuuidAsync(string puuid, RiotPlatform platform, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<ChampionMasteryDto>> GetTopChampionMasteriesAsync(string puuid, RiotPlatform platform, int top, CancellationToken cancellationToken = default);
}

public interface ILolMatchClient
{
    Task<IReadOnlyList<string>> GetRecentMatchIdsAsync(string puuid, RiotCluster cluster, int start, int count, int? queue, string? type, CancellationToken cancellationToken = default);
    Task<MatchDto> GetMatchAsync(string matchId, RiotCluster cluster, CancellationToken cancellationToken = default);
}

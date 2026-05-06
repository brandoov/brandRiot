using BrandRiot.Application.Dtos.Riot.Lor;
using BrandRiot.Domain.Enums;

namespace BrandRiot.Application.Abstractions.Riot;

public interface ILorMatchClient
{
    Task<IReadOnlyList<string>> GetRecentMatchIdsAsync(string puuid, RiotCluster cluster, CancellationToken cancellationToken = default);
    Task<LorMatchDto> GetMatchAsync(string matchId, RiotCluster cluster, CancellationToken cancellationToken = default);
    Task<LorLeaderboardDto> GetMasterLeaderboardAsync(RiotCluster cluster, CancellationToken cancellationToken = default);
}

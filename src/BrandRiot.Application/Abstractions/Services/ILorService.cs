using BrandRiot.Application.Common;
using BrandRiot.Application.Dtos.Api.Lor;
using BrandRiot.Domain.Enums;

namespace BrandRiot.Application.Abstractions.Services;

public interface ILorService
{
    Task<Result<LorMatchIdsResponse>> GetRecentMatchIdsAsync(string puuid, RiotCluster? cluster, CancellationToken cancellationToken = default);
    Task<Result<LorMatchResponse>> GetMatchByIdAsync(string matchId, RiotCluster? cluster, CancellationToken cancellationToken = default);
    Task<Result<LorLeaderboardResponse>> GetMasterLeaderboardAsync(RiotCluster? cluster, CancellationToken cancellationToken = default);
}

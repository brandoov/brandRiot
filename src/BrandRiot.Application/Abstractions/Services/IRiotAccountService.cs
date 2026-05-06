using BrandRiot.Application.Common;
using BrandRiot.Application.Dtos.Api;
using BrandRiot.Domain.Enums;

namespace BrandRiot.Application.Abstractions.Services;

public interface IRiotAccountService
{
    Task<Result<PlayerSummaryResponse>> GetByRiotIdAsync(string gameName, string tagLine, RiotCluster? cluster, CancellationToken cancellationToken = default);
    Task<Result<PlayerSummaryResponse>> GetByPuuidAsync(string puuid, RiotCluster? cluster, CancellationToken cancellationToken = default);
}

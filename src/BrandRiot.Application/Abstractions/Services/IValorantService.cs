using BrandRiot.Application.Common;
using BrandRiot.Application.Dtos.Api.Valorant;
using BrandRiot.Domain.Enums;

namespace BrandRiot.Application.Abstractions.Services;

public interface IValorantService
{
    Task<Result<ValorantMatchHistoryResponse>> GetMatchHistoryAsync(string puuid, RiotPlatform? platform, CancellationToken cancellationToken = default);
    Task<Result<ValorantMatchResponse>> GetMatchByIdAsync(string matchId, RiotPlatform? platform, CancellationToken cancellationToken = default);
    Task<Result<ValorantContentResponse>> GetContentAsync(RiotPlatform? platform, string? locale, CancellationToken cancellationToken = default);
    Task<Result<ValorantRankedResponse>> GetRankedAsync(string puuid, RiotPlatform? platform, CancellationToken cancellationToken = default);
}

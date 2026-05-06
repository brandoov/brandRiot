using BrandRiot.Application.Dtos.Riot.Valorant;
using BrandRiot.Domain.Enums;

namespace BrandRiot.Application.Abstractions.Riot;

public interface IValorantPlatformClient
{
    Task<ValMatchHistoryDto> GetMatchHistoryAsync(string puuid, RiotPlatform platform, CancellationToken cancellationToken = default);
    Task<ValMatchDto> GetMatchAsync(string matchId, RiotPlatform platform, CancellationToken cancellationToken = default);
    Task<ValContentDto> GetContentAsync(RiotPlatform platform, string? locale, CancellationToken cancellationToken = default);
    Task<ValRankedDto> GetRankedAsync(string puuid, RiotPlatform platform, CancellationToken cancellationToken = default);
}

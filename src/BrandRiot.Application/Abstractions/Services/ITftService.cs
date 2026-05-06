using BrandRiot.Application.Common;
using BrandRiot.Application.Dtos.Api.Tft;
using BrandRiot.Domain.Enums;

namespace BrandRiot.Application.Abstractions.Services;

public interface ITftService
{
    Task<Result<TftPlayerResponse>> GetPlayerByRiotIdAsync(string gameName, string tagLine, RiotPlatform? platform, RiotCluster? cluster, CancellationToken cancellationToken = default);
    Task<Result<TftPlayerResponse>> GetSummonerByPuuidAsync(string puuid, RiotPlatform? platform, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<TftMatchResponse>>> GetRecentMatchesAsync(string puuid, RiotCluster? cluster, int start, int count, CancellationToken cancellationToken = default);
    Task<Result<TftMatchResponse>> GetMatchByIdAsync(string matchId, RiotCluster? cluster, CancellationToken cancellationToken = default);
    Task<Result<TftRankedResponse>> GetRankedAsync(string puuid, RiotPlatform? platform, CancellationToken cancellationToken = default);
}

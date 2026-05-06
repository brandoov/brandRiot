using BrandRiot.Application.Common;
using BrandRiot.Application.Dtos.Api.Lol;
using BrandRiot.Domain.Enums;

namespace BrandRiot.Application.Abstractions.Services;

public interface ILolService
{
    Task<Result<LolPlayerResponse>> GetPlayerByRiotIdAsync(string gameName, string tagLine, RiotPlatform? platform, RiotCluster? cluster, CancellationToken cancellationToken = default);
    Task<Result<LolPlayerResponse>> GetSummonerByPuuidAsync(string puuid, RiotPlatform? platform, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<LolMatchResponse>>> GetRecentMatchesAsync(string puuid, RiotCluster? cluster, int start, int count, int? queue, string? type, CancellationToken cancellationToken = default);
    Task<Result<LolMatchResponse>> GetMatchByIdAsync(string matchId, RiotCluster? cluster, CancellationToken cancellationToken = default);
    Task<Result<LolRankedResponse>> GetRankedAsync(string puuid, RiotPlatform? platform, CancellationToken cancellationToken = default);
    Task<Result<IReadOnlyList<LolChampionMasteryResponse>>> GetChampionMasteriesAsync(string puuid, RiotPlatform? platform, int top, CancellationToken cancellationToken = default);
}

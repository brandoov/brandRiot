using BrandRiot.Application.Abstractions.Riot;
using BrandRiot.Application.Common;
using BrandRiot.Application.Dtos.Riot.Lor;
using BrandRiot.Domain.Enums;
using BrandRiot.Infrastructure.Riot.Http;

namespace BrandRiot.Infrastructure.Riot.Clients;

internal sealed class LorMatchClient : RiotClientBase, ILorMatchClient
{
    private readonly IHttpClientFactory _factory;

    public LorMatchClient(IHttpClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<IReadOnlyList<string>> GetRecentMatchIdsAsync(string puuid, RiotCluster cluster, CancellationToken cancellationToken = default)
    {
        var client = _factory.CreateClient(RiotClientNames.Cluster);
        var url = $"{RiotRouting.ClusterHost(cluster)}/lor/match/v1/matches/by-puuid/{Uri.EscapeDataString(puuid)}/ids";
        var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
        return await ReadAsync<List<string>>(response, cancellationToken).ConfigureAwait(false);
    }

    public async Task<LorMatchDto> GetMatchAsync(string matchId, RiotCluster cluster, CancellationToken cancellationToken = default)
    {
        var client = _factory.CreateClient(RiotClientNames.Cluster);
        var url = $"{RiotRouting.ClusterHost(cluster)}/lor/match/v1/matches/{Uri.EscapeDataString(matchId)}";
        var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
        return await ReadAsync<LorMatchDto>(response, cancellationToken).ConfigureAwait(false);
    }

    public async Task<LorLeaderboardDto> GetMasterLeaderboardAsync(RiotCluster cluster, CancellationToken cancellationToken = default)
    {
        var client = _factory.CreateClient(RiotClientNames.Cluster);
        var url = $"{RiotRouting.ClusterHost(cluster)}/lor/ranked/v1/leaderboards";
        var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
        return await ReadAsync<LorLeaderboardDto>(response, cancellationToken).ConfigureAwait(false);
    }
}

using BrandRiot.Application.Abstractions.Riot;
using BrandRiot.Application.Common;
using BrandRiot.Application.Dtos.Riot.Account;
using BrandRiot.Domain.Enums;
using BrandRiot.Infrastructure.Riot.Http;

namespace BrandRiot.Infrastructure.Riot.Clients;

internal sealed class RiotAccountClient : RiotClientBase, IRiotAccountClient
{
    private readonly IHttpClientFactory _factory;

    public RiotAccountClient(IHttpClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<AccountDto> GetByRiotIdAsync(string gameName, string tagLine, RiotCluster cluster, CancellationToken cancellationToken = default)
    {
        var client = _factory.CreateClient(RiotClientNames.Cluster);
        var url = $"{RiotRouting.ClusterHost(cluster)}/riot/account/v1/accounts/by-riot-id/{Uri.EscapeDataString(gameName)}/{Uri.EscapeDataString(tagLine)}";
        var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
        return await ReadAsync<AccountDto>(response, cancellationToken).ConfigureAwait(false);
    }

    public async Task<AccountDto> GetByPuuidAsync(string puuid, RiotCluster cluster, CancellationToken cancellationToken = default)
    {
        var client = _factory.CreateClient(RiotClientNames.Cluster);
        var url = $"{RiotRouting.ClusterHost(cluster)}/riot/account/v1/accounts/by-puuid/{Uri.EscapeDataString(puuid)}";
        var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
        return await ReadAsync<AccountDto>(response, cancellationToken).ConfigureAwait(false);
    }
}

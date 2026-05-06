using BrandRiot.Application.Abstractions.Riot;
using BrandRiot.Application.Common;
using BrandRiot.Application.Dtos.Riot.Tft;
using BrandRiot.Domain.Enums;
using BrandRiot.Infrastructure.Riot.Http;

namespace BrandRiot.Infrastructure.Riot.Clients;

internal sealed class TftPlatformClient : RiotClientBase, ITftPlatformClient
{
    private readonly IHttpClientFactory _factory;

    public TftPlatformClient(IHttpClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<TftSummonerDto> GetSummonerByPuuidAsync(string puuid, RiotPlatform platform, CancellationToken cancellationToken = default)
    {
        var client = _factory.CreateClient(RiotClientNames.Platform);
        var url = $"{RiotRouting.PlatformHost(platform)}/tft/summoner/v1/summoners/by-puuid/{Uri.EscapeDataString(puuid)}";
        var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
        return await ReadAsync<TftSummonerDto>(response, cancellationToken).ConfigureAwait(false);
    }

    public async Task<IReadOnlyList<TftLeagueEntryDto>> GetLeagueEntriesByPuuidAsync(string puuid, RiotPlatform platform, CancellationToken cancellationToken = default)
    {
        var client = _factory.CreateClient(RiotClientNames.Platform);
        var url = $"{RiotRouting.PlatformHost(platform)}/tft/league/v1/entries/by-puuid/{Uri.EscapeDataString(puuid)}";
        var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
        return await ReadAsync<List<TftLeagueEntryDto>>(response, cancellationToken).ConfigureAwait(false);
    }
}

internal sealed class TftMatchClient : RiotClientBase, ITftMatchClient
{
    private readonly IHttpClientFactory _factory;

    public TftMatchClient(IHttpClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<IReadOnlyList<string>> GetRecentMatchIdsAsync(string puuid, RiotCluster cluster, int start, int count, CancellationToken cancellationToken = default)
    {
        var client = _factory.CreateClient(RiotClientNames.Cluster);
        var url = $"{RiotRouting.ClusterHost(cluster)}/tft/match/v1/matches/by-puuid/{Uri.EscapeDataString(puuid)}/ids?start={start}&count={count}";
        var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
        return await ReadAsync<List<string>>(response, cancellationToken).ConfigureAwait(false);
    }

    public async Task<TftMatchDto> GetMatchAsync(string matchId, RiotCluster cluster, CancellationToken cancellationToken = default)
    {
        var client = _factory.CreateClient(RiotClientNames.Cluster);
        var url = $"{RiotRouting.ClusterHost(cluster)}/tft/match/v1/matches/{Uri.EscapeDataString(matchId)}";
        var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
        return await ReadAsync<TftMatchDto>(response, cancellationToken).ConfigureAwait(false);
    }
}

using BrandRiot.Application.Abstractions.Riot;
using BrandRiot.Application.Common;
using BrandRiot.Application.Dtos.Riot.Lol;
using BrandRiot.Domain.Enums;
using BrandRiot.Infrastructure.Riot.Http;

namespace BrandRiot.Infrastructure.Riot.Clients;

internal sealed class LolPlatformClient : RiotClientBase, ILolPlatformClient
{
    private readonly IHttpClientFactory _factory;

    public LolPlatformClient(IHttpClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<SummonerDto> GetSummonerByPuuidAsync(string puuid, RiotPlatform platform, CancellationToken cancellationToken = default)
    {
        var client = _factory.CreateClient(RiotClientNames.Platform);
        var url = $"{RiotRouting.PlatformHost(platform)}/lol/summoner/v4/summoners/by-puuid/{Uri.EscapeDataString(puuid)}";
        var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
        return await ReadAsync<SummonerDto>(response, cancellationToken).ConfigureAwait(false);
    }

    public async Task<IReadOnlyList<LeagueEntryDto>> GetLeagueEntriesByPuuidAsync(string puuid, RiotPlatform platform, CancellationToken cancellationToken = default)
    {
        var client = _factory.CreateClient(RiotClientNames.Platform);
        var url = $"{RiotRouting.PlatformHost(platform)}/lol/league/v4/entries/by-puuid/{Uri.EscapeDataString(puuid)}";
        var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
        return await ReadAsync<List<LeagueEntryDto>>(response, cancellationToken).ConfigureAwait(false);
    }

    public async Task<IReadOnlyList<ChampionMasteryDto>> GetTopChampionMasteriesAsync(string puuid, RiotPlatform platform, int top, CancellationToken cancellationToken = default)
    {
        var client = _factory.CreateClient(RiotClientNames.Platform);
        var url = $"{RiotRouting.PlatformHost(platform)}/lol/champion-mastery/v4/champion-masteries/by-puuid/{Uri.EscapeDataString(puuid)}/top?count={top}";
        var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
        return await ReadAsync<List<ChampionMasteryDto>>(response, cancellationToken).ConfigureAwait(false);
    }
}

internal sealed class LolMatchClient : RiotClientBase, ILolMatchClient
{
    private readonly IHttpClientFactory _factory;

    public LolMatchClient(IHttpClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<IReadOnlyList<string>> GetRecentMatchIdsAsync(string puuid, RiotCluster cluster, int start, int count, int? queue, string? type, CancellationToken cancellationToken = default)
    {
        var client = _factory.CreateClient(RiotClientNames.Cluster);
        var query = new List<string> { $"start={start}", $"count={count}" };
        if (queue.HasValue) query.Add($"queue={queue.Value}");
        if (!string.IsNullOrEmpty(type)) query.Add($"type={Uri.EscapeDataString(type)}");
        var url = $"{RiotRouting.ClusterHost(cluster)}/lol/match/v5/matches/by-puuid/{Uri.EscapeDataString(puuid)}/ids?{string.Join('&', query)}";
        var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
        return await ReadAsync<List<string>>(response, cancellationToken).ConfigureAwait(false);
    }

    public async Task<MatchDto> GetMatchAsync(string matchId, RiotCluster cluster, CancellationToken cancellationToken = default)
    {
        var client = _factory.CreateClient(RiotClientNames.Cluster);
        var url = $"{RiotRouting.ClusterHost(cluster)}/lol/match/v5/matches/{Uri.EscapeDataString(matchId)}";
        var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
        return await ReadAsync<MatchDto>(response, cancellationToken).ConfigureAwait(false);
    }
}

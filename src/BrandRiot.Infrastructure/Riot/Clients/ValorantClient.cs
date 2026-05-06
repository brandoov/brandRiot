using BrandRiot.Application.Abstractions.Riot;
using BrandRiot.Application.Common;
using BrandRiot.Application.Dtos.Riot.Valorant;
using BrandRiot.Domain.Enums;
using BrandRiot.Infrastructure.Riot.Http;

namespace BrandRiot.Infrastructure.Riot.Clients;

internal sealed class ValorantPlatformClient : RiotClientBase, IValorantPlatformClient
{
    private readonly IHttpClientFactory _factory;

    public ValorantPlatformClient(IHttpClientFactory factory)
    {
        _factory = factory;
    }

    public async Task<ValMatchHistoryDto> GetMatchHistoryAsync(string puuid, RiotPlatform platform, CancellationToken cancellationToken = default)
    {
        var client = _factory.CreateClient(RiotClientNames.Platform);
        var url = $"{RiotRouting.PlatformHost(platform)}/val/match/v1/matchlists/by-puuid/{Uri.EscapeDataString(puuid)}";
        var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
        return await ReadAsync<ValMatchHistoryDto>(response, cancellationToken).ConfigureAwait(false);
    }

    public async Task<ValMatchDto> GetMatchAsync(string matchId, RiotPlatform platform, CancellationToken cancellationToken = default)
    {
        var client = _factory.CreateClient(RiotClientNames.Platform);
        var url = $"{RiotRouting.PlatformHost(platform)}/val/match/v1/matches/{Uri.EscapeDataString(matchId)}";
        var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
        return await ReadAsync<ValMatchDto>(response, cancellationToken).ConfigureAwait(false);
    }

    public async Task<ValContentDto> GetContentAsync(RiotPlatform platform, string? locale, CancellationToken cancellationToken = default)
    {
        var client = _factory.CreateClient(RiotClientNames.Platform);
        var url = $"{RiotRouting.PlatformHost(platform)}/val/content/v1/contents";
        if (!string.IsNullOrEmpty(locale))
        {
            url += $"?locale={Uri.EscapeDataString(locale)}";
        }
        var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
        return await ReadAsync<ValContentDto>(response, cancellationToken).ConfigureAwait(false);
    }

    public async Task<ValRankedDto> GetRankedAsync(string puuid, RiotPlatform platform, CancellationToken cancellationToken = default)
    {
        var client = _factory.CreateClient(RiotClientNames.Platform);
        var url = $"{RiotRouting.PlatformHost(platform)}/val/ranked/v1/by-puuid/{Uri.EscapeDataString(puuid)}";
        var response = await client.GetAsync(url, cancellationToken).ConfigureAwait(false);
        return await ReadAsync<ValRankedDto>(response, cancellationToken).ConfigureAwait(false);
    }
}

using BrandRiot.Infrastructure.Riot.Options;
using Microsoft.Extensions.Options;

namespace BrandRiot.Infrastructure.Riot.Http;

public sealed class RiotApiKeyHandler : DelegatingHandler
{
    private readonly IOptionsMonitor<RiotOptions> _options;

    public RiotApiKeyHandler(IOptionsMonitor<RiotOptions> options)
    {
        _options = options;
    }

    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var options = _options.CurrentValue;
        if (!string.IsNullOrWhiteSpace(options.ApiKey))
        {
            request.Headers.Remove("X-Riot-Token");
            request.Headers.Add("X-Riot-Token", options.ApiKey);
        }

        if (!string.IsNullOrWhiteSpace(options.UserAgent) && !request.Headers.UserAgent.Any())
        {
            request.Headers.TryAddWithoutValidation("User-Agent", options.UserAgent);
        }

        return base.SendAsync(request, cancellationToken);
    }
}

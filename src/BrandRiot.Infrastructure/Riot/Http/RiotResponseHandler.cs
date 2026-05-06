using System.Net;
using BrandRiot.Infrastructure.Riot.Exceptions;
using Microsoft.Extensions.Logging;

namespace BrandRiot.Infrastructure.Riot.Http;

public sealed class RiotResponseHandler : DelegatingHandler
{
    private readonly ILogger<RiotResponseHandler> _logger;

    public RiotResponseHandler(ILogger<RiotResponseHandler> logger)
    {
        _logger = logger;
    }

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var response = await base.SendAsync(request, cancellationToken).ConfigureAwait(false);

        if (response.Headers.TryGetValues("X-App-Rate-Limit-Count", out var appLimit))
        {
            _logger.LogDebug("Riot app rate limit count: {Limit}", string.Join(", ", appLimit));
        }
        if (response.Headers.TryGetValues("X-Method-Rate-Limit-Count", out var methodLimit))
        {
            _logger.LogDebug("Riot method rate limit count: {Limit}", string.Join(", ", methodLimit));
        }

        if (response.IsSuccessStatusCode)
        {
            return response;
        }

        var status = response.StatusCode;
        var retryAfter = response.Headers.RetryAfter?.Delta
            ?? (response.Headers.RetryAfter?.Date.HasValue == true
                ? response.Headers.RetryAfter.Date - DateTimeOffset.UtcNow
                : (TimeSpan?)null);

        if (status == HttpStatusCode.TooManyRequests)
        {
            response.Headers.TryGetValues("X-Rate-Limit-Type", out var rateType);
            var typeValue = rateType?.FirstOrDefault();
            _logger.LogWarning("Riot 429 received. Type={Type} RetryAfter={RetryAfter}", typeValue, retryAfter);
            throw new RiotRateLimitException(
                $"Riot API returned 429 (rate limit type: {typeValue ?? "unknown"})",
                retryAfter,
                typeValue);
        }

        if ((int)status >= 400)
        {
            var body = string.Empty;
            try
            {
                body = await response.Content.ReadAsStringAsync(cancellationToken).ConfigureAwait(false);
            }
            catch
            {
                // ignore body read errors
            }
            _logger.LogWarning("Riot API returned {Status} for {Url}: {Body}", (int)status, request.RequestUri, body);
            throw new RiotApiException(status, $"Riot API returned {(int)status} for {request.RequestUri}: {body}", retryAfter);
        }

        return response;
    }
}

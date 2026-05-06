using System.Net;

namespace BrandRiot.Infrastructure.Riot.Exceptions;

public class RiotApiException : Exception
{
    public HttpStatusCode StatusCode { get; }
    public TimeSpan? RetryAfter { get; }

    public RiotApiException(HttpStatusCode statusCode, string message, TimeSpan? retryAfter = null, Exception? innerException = null)
        : base(message, innerException)
    {
        StatusCode = statusCode;
        RetryAfter = retryAfter;
    }
}

public sealed class RiotRateLimitException : RiotApiException
{
    public string? RateLimitType { get; }

    public RiotRateLimitException(string message, TimeSpan? retryAfter, string? rateLimitType)
        : base(HttpStatusCode.TooManyRequests, message, retryAfter)
    {
        RateLimitType = rateLimitType;
    }
}

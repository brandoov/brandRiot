namespace BrandRiot.Application.Common.Errors;

public sealed record RiotApiError(int StatusCode, string Message, TimeSpan? RetryAfter = null);

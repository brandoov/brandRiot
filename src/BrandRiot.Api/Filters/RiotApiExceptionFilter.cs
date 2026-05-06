using BrandRiot.Infrastructure.Riot.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace BrandRiot.Api.Filters;

public sealed class RiotApiExceptionFilter : IExceptionFilter
{
    private readonly ILogger<RiotApiExceptionFilter> _logger;

    public RiotApiExceptionFilter(ILogger<RiotApiExceptionFilter> logger)
    {
        _logger = logger;
    }

    public void OnException(ExceptionContext context)
    {
        if (context.Exception is RiotRateLimitException rateLimit)
        {
            _logger.LogWarning(rateLimit, "Riot rate limit hit");
            var problem = new ProblemDetails
            {
                Type = "https://datatracker.ietf.org/doc/html/rfc6585#section-4",
                Title = "Riot API rate limit exceeded",
                Detail = rateLimit.Message,
                Status = StatusCodes.Status429TooManyRequests
            };
            problem.Extensions["rateLimitType"] = rateLimit.RateLimitType;
            problem.Extensions["retryAfterSeconds"] = rateLimit.RetryAfter?.TotalSeconds;

            var result = new ObjectResult(problem) { StatusCode = StatusCodes.Status429TooManyRequests };
            if (rateLimit.RetryAfter is { } retryAfter && retryAfter > TimeSpan.Zero)
            {
                context.HttpContext.Response.Headers["Retry-After"] = ((int)retryAfter.TotalSeconds).ToString();
            }
            context.Result = result;
            context.ExceptionHandled = true;
            return;
        }

        if (context.Exception is RiotApiException riot)
        {
            _logger.LogWarning(riot, "Riot API error");
            var status = (int)riot.StatusCode;
            var problem = new ProblemDetails
            {
                Title = "Riot API error",
                Detail = riot.Message,
                Status = status
            };
            context.Result = new ObjectResult(problem) { StatusCode = status };
            context.ExceptionHandled = true;
        }
    }
}

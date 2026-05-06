using BrandRiot.Application.Abstractions.Riot;
using BrandRiot.Domain.Abstractions;
using BrandRiot.Infrastructure.Persistence;
using BrandRiot.Infrastructure.Persistence.Repositories;
using BrandRiot.Infrastructure.Riot.Clients;
using BrandRiot.Infrastructure.Riot.Http;
using BrandRiot.Infrastructure.Riot.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Http.Resilience;
using Polly;

namespace BrandRiot.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<RiotOptions>(configuration.GetSection(RiotOptions.SectionName));
        services.Configure<RiotResilienceOptions>(configuration.GetSection(RiotResilienceOptions.SectionName));

        var connectionString = configuration.GetConnectionString("Default")
            ?? throw new InvalidOperationException("Missing connection string 'Default'.");

        services.AddDbContext<BrandRiotDbContext>(options =>
            options.UseNpgsql(connectionString, npgsql =>
                npgsql.MigrationsHistoryTable("__EFMigrationsHistory", BrandRiotDbContext.Schema)));

        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IRiotAccountRepository, RiotAccountRepository>();
        services.AddScoped<ILolRepository, LolRepository>();
        services.AddScoped<ITftRepository, TftRepository>();
        services.AddScoped<IValorantRepository, ValorantRepository>();
        services.AddScoped<ILorRepository, LorRepository>();

        services.AddTransient<RiotApiKeyHandler>();
        services.AddTransient<RiotResponseHandler>();

        var resilienceConfig = configuration.GetSection(RiotResilienceOptions.SectionName).Get<RiotResilienceOptions>() ?? new RiotResilienceOptions();

        AddRiotHttpClient(services, RiotClientNames.Platform, resilienceConfig);
        AddRiotHttpClient(services, RiotClientNames.Cluster, resilienceConfig);

        services.AddScoped<IRiotAccountClient, RiotAccountClient>();
        services.AddScoped<ILolPlatformClient, LolPlatformClient>();
        services.AddScoped<ILolMatchClient, LolMatchClient>();
        services.AddScoped<ITftPlatformClient, TftPlatformClient>();
        services.AddScoped<ITftMatchClient, TftMatchClient>();
        services.AddScoped<IValorantPlatformClient, ValorantPlatformClient>();
        services.AddScoped<ILorMatchClient, LorMatchClient>();

        return services;
    }

    private static void AddRiotHttpClient(IServiceCollection services, string name, RiotResilienceOptions resilience)
    {
        services.AddHttpClient(name, client =>
        {
            client.Timeout = TimeSpan.FromSeconds(Math.Max(resilience.TimeoutSeconds * 3, 30));
        })
        .AddHttpMessageHandler<RiotApiKeyHandler>()
        .AddHttpMessageHandler<RiotResponseHandler>()
        .AddResilienceHandler($"riot-{name}", builder =>
        {
            builder.AddRetry(new HttpRetryStrategyOptions
            {
                MaxRetryAttempts = resilience.RetryCount,
                Delay = TimeSpan.FromMilliseconds(resilience.BaseDelayMs),
                BackoffType = DelayBackoffType.Exponential,
                UseJitter = true,
                ShouldHandle = args =>
                {
                    if (args.Outcome.Exception is Riot.Exceptions.RiotRateLimitException)
                    {
                        return ValueTask.FromResult(true);
                    }
                    if (args.Outcome.Exception is HttpRequestException)
                    {
                        return ValueTask.FromResult(true);
                    }
                    var status = args.Outcome.Result?.StatusCode;
                    return ValueTask.FromResult(status.HasValue && (int)status.Value >= 500);
                },
                DelayGenerator = args =>
                {
                    if (args.Outcome.Exception is Riot.Exceptions.RiotApiException riotEx && riotEx.RetryAfter is { } retryAfter && retryAfter > TimeSpan.Zero)
                    {
                        return ValueTask.FromResult<TimeSpan?>(retryAfter);
                    }
                    return ValueTask.FromResult<TimeSpan?>(null);
                }
            });

            builder.AddCircuitBreaker(new HttpCircuitBreakerStrategyOptions
            {
                FailureRatio = resilience.CircuitBreakerFailureRatio,
                SamplingDuration = TimeSpan.FromSeconds(resilience.CircuitBreakerSamplingDurationSec),
                MinimumThroughput = resilience.CircuitBreakerMinThroughput,
                BreakDuration = TimeSpan.FromSeconds(30)
            });

            builder.AddTimeout(TimeSpan.FromSeconds(resilience.TimeoutSeconds));
        });
    }
}

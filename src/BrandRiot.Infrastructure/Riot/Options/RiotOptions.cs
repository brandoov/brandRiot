namespace BrandRiot.Infrastructure.Riot.Options;

public sealed class RiotOptions
{
    public const string SectionName = "Riot";

    public string ApiKey { get; set; } = string.Empty;
    public string DefaultPlatform { get; set; } = "Br1";
    public string DefaultCluster { get; set; } = "Americas";
    public string UserAgent { get; set; } = "BrandRiot/0.1";
    public bool AutoMigrate { get; set; }
}

public sealed class RiotResilienceOptions
{
    public const string SectionName = "RiotResilience";

    public int RetryCount { get; set; } = 4;
    public int BaseDelayMs { get; set; } = 500;
    public int TimeoutSeconds { get; set; } = 10;
    public double CircuitBreakerFailureRatio { get; set; } = 0.5;
    public int CircuitBreakerSamplingDurationSec { get; set; } = 30;
    public int CircuitBreakerMinThroughput { get; set; } = 8;
}

using BrandRiot.Domain.Enums;

namespace BrandRiot.Application.Common;

public static class RiotDefaults
{
    public static readonly RiotPlatform DefaultPlatform = RiotPlatform.Br1;
    public static readonly RiotCluster DefaultCluster = RiotCluster.Americas;
}

public static class RiotRouting
{
    public static RiotCluster ClusterFor(RiotPlatform platform) => platform switch
    {
        RiotPlatform.Br1 or RiotPlatform.Na1 or RiotPlatform.Lan or RiotPlatform.Las or RiotPlatform.Oc1 => RiotCluster.Americas,
        RiotPlatform.Euw1 or RiotPlatform.Eun1 or RiotPlatform.Tr1 or RiotPlatform.Ru => RiotCluster.Europe,
        RiotPlatform.Kr or RiotPlatform.Jp1 => RiotCluster.Asia,
        RiotPlatform.Ph2 or RiotPlatform.Sg2 or RiotPlatform.Th2 or RiotPlatform.Tw2 or RiotPlatform.Vn2 => RiotCluster.Sea,
        _ => RiotCluster.Americas
    };

    public static string PlatformHost(RiotPlatform platform) =>
        $"https://{platform.ToString().ToLowerInvariant()}.api.riotgames.com";

    public static string ClusterHost(RiotCluster cluster) =>
        $"https://{cluster.ToString().ToLowerInvariant()}.api.riotgames.com";
}

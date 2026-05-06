using BrandRiot.Domain.Entities.Accounts;

namespace BrandRiot.Domain.Abstractions;

public interface IRiotAccountRepository
{
    Task<RiotAccount?> GetByPuuidAsync(string puuid, CancellationToken cancellationToken = default);
    Task<RiotAccount?> GetByRiotIdAsync(string gameName, string tagLine, CancellationToken cancellationToken = default);
    Task UpsertAsync(RiotAccount account, CancellationToken cancellationToken = default);
}

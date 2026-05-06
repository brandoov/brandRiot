using BrandRiot.Domain.Abstractions;
using BrandRiot.Domain.Entities.Accounts;
using Microsoft.EntityFrameworkCore;

namespace BrandRiot.Infrastructure.Persistence.Repositories;

public sealed class RiotAccountRepository : IRiotAccountRepository
{
    private readonly BrandRiotDbContext _context;

    public RiotAccountRepository(BrandRiotDbContext context)
    {
        _context = context;
    }

    public Task<RiotAccount?> GetByPuuidAsync(string puuid, CancellationToken cancellationToken = default) =>
        _context.RiotAccounts.FirstOrDefaultAsync(a => a.Puuid == puuid, cancellationToken);

    public Task<RiotAccount?> GetByRiotIdAsync(string gameName, string tagLine, CancellationToken cancellationToken = default) =>
        _context.RiotAccounts.FirstOrDefaultAsync(a => a.GameName == gameName && a.TagLine == tagLine, cancellationToken);

    public async Task UpsertAsync(RiotAccount account, CancellationToken cancellationToken = default)
    {
        var entry = _context.Entry(account);
        if (entry.State == EntityState.Detached)
        {
            var existing = await _context.RiotAccounts.FirstOrDefaultAsync(a => a.Puuid == account.Puuid, cancellationToken).ConfigureAwait(false);
            if (existing is null)
            {
                _context.RiotAccounts.Add(account);
            }
            else
            {
                existing.GameName = account.GameName;
                existing.TagLine = account.TagLine;
                existing.ResolvedCluster = account.ResolvedCluster;
                existing.LastSeenPlatform = account.LastSeenPlatform;
                existing.LastFetchedUtc = account.LastFetchedUtc;
            }
        }
    }
}

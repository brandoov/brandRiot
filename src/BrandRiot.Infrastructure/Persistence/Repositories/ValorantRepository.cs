using BrandRiot.Domain.Abstractions;
using BrandRiot.Domain.Entities.Valorant;
using Microsoft.EntityFrameworkCore;

namespace BrandRiot.Infrastructure.Persistence.Repositories;

public sealed class ValorantRepository : IValorantRepository
{
    private readonly BrandRiotDbContext _context;

    public ValorantRepository(BrandRiotDbContext context)
    {
        _context = context;
    }

    public Task<ValorantMatch?> GetMatchByIdAsync(string matchId, CancellationToken cancellationToken = default) =>
        _context.ValorantMatches.Include(m => m.Players).FirstOrDefaultAsync(m => m.MatchId == matchId, cancellationToken);

    public async Task UpsertMatchAsync(ValorantMatch match, IEnumerable<ValorantMatchPlayer> players, CancellationToken cancellationToken = default)
    {
        var existing = await _context.ValorantMatches.Include(m => m.Players).FirstOrDefaultAsync(m => m.MatchId == match.MatchId, cancellationToken).ConfigureAwait(false);
        if (existing is null)
        {
            match.Players = players.ToList();
            _context.ValorantMatches.Add(match);
        }
        else
        {
            existing.Platform = match.Platform;
            existing.MapId = match.MapId;
            existing.GameVersion = match.GameVersion;
            existing.QueueId = match.QueueId;
            existing.GameStartUtc = match.GameStartUtc;
            existing.GameLengthMillis = match.GameLengthMillis;
            existing.IsCompleted = match.IsCompleted;
            existing.SeasonId = match.SeasonId;
            _context.ValorantMatchPlayers.RemoveRange(existing.Players);
            foreach (var p in players)
            {
                _context.ValorantMatchPlayers.Add(p);
            }
        }
    }

    public async Task<IReadOnlyList<ValorantContentItem>> GetContentAsync(CancellationToken cancellationToken = default) =>
        await _context.ValorantContentItems.ToListAsync(cancellationToken).ConfigureAwait(false);

    public async Task ReplaceContentAsync(IEnumerable<ValorantContentItem> items, CancellationToken cancellationToken = default)
    {
        var existing = await _context.ValorantContentItems.ToListAsync(cancellationToken).ConfigureAwait(false);
        _context.ValorantContentItems.RemoveRange(existing);
        await _context.ValorantContentItems.AddRangeAsync(items, cancellationToken).ConfigureAwait(false);
    }

    public Task<ValorantRankedEntry?> GetRankedEntryAsync(string puuid, string actId, CancellationToken cancellationToken = default) =>
        _context.ValorantRankedEntries.FirstOrDefaultAsync(e => e.Puuid == puuid && e.ActId == actId, cancellationToken);

    public async Task UpsertRankedEntryAsync(ValorantRankedEntry entry, CancellationToken cancellationToken = default)
    {
        var existing = await _context.ValorantRankedEntries.FirstOrDefaultAsync(e => e.Puuid == entry.Puuid && e.ActId == entry.ActId, cancellationToken).ConfigureAwait(false);
        if (existing is null)
        {
            _context.ValorantRankedEntries.Add(entry);
        }
        else
        {
            existing.Tier = entry.Tier;
            existing.RankedRating = entry.RankedRating;
            existing.NumberOfWins = entry.NumberOfWins;
            existing.FetchedAtUtc = entry.FetchedAtUtc;
        }
    }
}

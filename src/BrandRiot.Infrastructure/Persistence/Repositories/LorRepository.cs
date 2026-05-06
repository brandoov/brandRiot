using BrandRiot.Domain.Abstractions;
using BrandRiot.Domain.Entities.Lor;
using BrandRiot.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace BrandRiot.Infrastructure.Persistence.Repositories;

public sealed class LorRepository : ILorRepository
{
    private readonly BrandRiotDbContext _context;

    public LorRepository(BrandRiotDbContext context)
    {
        _context = context;
    }

    public Task<LorMatch?> GetMatchByIdAsync(string matchId, CancellationToken cancellationToken = default) =>
        _context.LorMatches.Include(m => m.Players).FirstOrDefaultAsync(m => m.MatchId == matchId, cancellationToken);

    public async Task UpsertMatchAsync(LorMatch match, IEnumerable<LorMatchPlayer> players, CancellationToken cancellationToken = default)
    {
        var existing = await _context.LorMatches.Include(m => m.Players).FirstOrDefaultAsync(m => m.MatchId == match.MatchId, cancellationToken).ConfigureAwait(false);
        if (existing is null)
        {
            match.Players = players.ToList();
            _context.LorMatches.Add(match);
        }
        else
        {
            existing.Cluster = match.Cluster;
            existing.GameStartUtc = match.GameStartUtc;
            existing.GameMode = match.GameMode;
            existing.GameType = match.GameType;
            existing.GameVersion = match.GameVersion;
            existing.GameFormat = match.GameFormat;
            existing.TotalTurnCount = match.TotalTurnCount;
            _context.LorMatchPlayers.RemoveRange(existing.Players);
            foreach (var p in players)
            {
                _context.LorMatchPlayers.Add(p);
            }
        }
    }

    public async Task<IReadOnlyList<LorRankedLeaderboardEntry>> GetMasterLeaderboardAsync(RiotCluster cluster, CancellationToken cancellationToken = default) =>
        await _context.LorRankedLeaderboardEntries.Where(e => e.Cluster == cluster).OrderBy(e => e.Rank).ToListAsync(cancellationToken).ConfigureAwait(false);

    public async Task ReplaceMasterLeaderboardAsync(RiotCluster cluster, IEnumerable<LorRankedLeaderboardEntry> entries, CancellationToken cancellationToken = default)
    {
        var existing = await _context.LorRankedLeaderboardEntries.Where(e => e.Cluster == cluster).ToListAsync(cancellationToken).ConfigureAwait(false);
        _context.LorRankedLeaderboardEntries.RemoveRange(existing);
        await _context.LorRankedLeaderboardEntries.AddRangeAsync(entries, cancellationToken).ConfigureAwait(false);
    }
}

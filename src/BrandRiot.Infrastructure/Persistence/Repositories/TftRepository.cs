using BrandRiot.Domain.Abstractions;
using BrandRiot.Domain.Entities.Tft;
using Microsoft.EntityFrameworkCore;

namespace BrandRiot.Infrastructure.Persistence.Repositories;

public sealed class TftRepository : ITftRepository
{
    private readonly BrandRiotDbContext _context;

    public TftRepository(BrandRiotDbContext context)
    {
        _context = context;
    }

    public Task<TftSummoner?> GetSummonerByPuuidAsync(string puuid, CancellationToken cancellationToken = default) =>
        _context.TftSummoners.FirstOrDefaultAsync(s => s.Puuid == puuid, cancellationToken);

    public async Task UpsertSummonerAsync(TftSummoner summoner, CancellationToken cancellationToken = default)
    {
        if (_context.Entry(summoner).State != EntityState.Detached)
        {
            return;
        }
        var existing = await _context.TftSummoners.FirstOrDefaultAsync(s => s.Puuid == summoner.Puuid, cancellationToken).ConfigureAwait(false);
        if (existing is null)
        {
            _context.TftSummoners.Add(summoner);
        }
    }

    public Task<TftMatch?> GetMatchByIdAsync(string matchId, CancellationToken cancellationToken = default) =>
        _context.TftMatches.Include(m => m.Participants).FirstOrDefaultAsync(m => m.MatchId == matchId, cancellationToken);

    public async Task UpsertMatchAsync(TftMatch match, IEnumerable<TftMatchParticipant> participants, CancellationToken cancellationToken = default)
    {
        var existing = await _context.TftMatches.Include(m => m.Participants).FirstOrDefaultAsync(m => m.MatchId == match.MatchId, cancellationToken).ConfigureAwait(false);
        if (existing is null)
        {
            match.Participants = participants.ToList();
            _context.TftMatches.Add(match);
        }
        else
        {
            existing.Cluster = match.Cluster;
            existing.GameDateUtc = match.GameDateUtc;
            existing.GameLengthSeconds = match.GameLengthSeconds;
            existing.GameVersion = match.GameVersion;
            existing.QueueId = match.QueueId;
            existing.TftSetNumber = match.TftSetNumber;
            existing.TftGameType = match.TftGameType;
            _context.TftMatchParticipants.RemoveRange(existing.Participants);
            foreach (var p in participants)
            {
                _context.TftMatchParticipants.Add(p);
            }
        }
    }

    public async Task<IReadOnlyList<TftLeagueEntry>> GetLeagueEntriesByPuuidAsync(string puuid, CancellationToken cancellationToken = default) =>
        await _context.TftLeagueEntries.Where(e => e.Puuid == puuid).ToListAsync(cancellationToken).ConfigureAwait(false);

    public async Task ReplaceLeagueEntriesAsync(string puuid, IEnumerable<TftLeagueEntry> entries, CancellationToken cancellationToken = default)
    {
        var existing = await _context.TftLeagueEntries.Where(e => e.Puuid == puuid).ToListAsync(cancellationToken).ConfigureAwait(false);
        _context.TftLeagueEntries.RemoveRange(existing);
        await _context.TftLeagueEntries.AddRangeAsync(entries, cancellationToken).ConfigureAwait(false);
    }
}

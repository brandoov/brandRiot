using BrandRiot.Domain.Abstractions;
using BrandRiot.Domain.Entities.Lol;
using Microsoft.EntityFrameworkCore;

namespace BrandRiot.Infrastructure.Persistence.Repositories;

public sealed class LolRepository : ILolRepository
{
    private readonly BrandRiotDbContext _context;

    public LolRepository(BrandRiotDbContext context)
    {
        _context = context;
    }

    public Task<Summoner?> GetSummonerByPuuidAsync(string puuid, CancellationToken cancellationToken = default) =>
        _context.Summoners.FirstOrDefaultAsync(s => s.Puuid == puuid, cancellationToken);

    public async Task UpsertSummonerAsync(Summoner summoner, CancellationToken cancellationToken = default)
    {
        var entry = _context.Entry(summoner);
        if (entry.State != EntityState.Detached)
        {
            return;
        }
        var existing = await _context.Summoners.FirstOrDefaultAsync(s => s.Puuid == summoner.Puuid, cancellationToken).ConfigureAwait(false);
        if (existing is null)
        {
            _context.Summoners.Add(summoner);
        }
    }

    public Task<LolMatch?> GetMatchByIdAsync(string matchId, CancellationToken cancellationToken = default) =>
        _context.LolMatches.Include(m => m.Participants).FirstOrDefaultAsync(m => m.MatchId == matchId, cancellationToken);

    public async Task UpsertMatchAsync(LolMatch match, IEnumerable<LolMatchParticipant> participants, CancellationToken cancellationToken = default)
    {
        var existing = await _context.LolMatches.Include(m => m.Participants).FirstOrDefaultAsync(m => m.MatchId == match.MatchId, cancellationToken).ConfigureAwait(false);
        if (existing is null)
        {
            match.Participants = participants.ToList();
            _context.LolMatches.Add(match);
        }
        else
        {
            existing.Platform = match.Platform;
            existing.GameCreationUtc = match.GameCreationUtc;
            existing.GameDurationSeconds = match.GameDurationSeconds;
            existing.GameVersion = match.GameVersion;
            existing.QueueId = match.QueueId;
            existing.MapId = match.MapId;
            existing.GameMode = match.GameMode;
            existing.GameType = match.GameType;
            _context.LolMatchParticipants.RemoveRange(existing.Participants);
            foreach (var p in participants)
            {
                _context.LolMatchParticipants.Add(p);
            }
        }
    }

    public async Task<IReadOnlyList<LolLeagueEntry>> GetLeagueEntriesByPuuidAsync(string puuid, CancellationToken cancellationToken = default) =>
        await _context.LolLeagueEntries.Where(e => e.Puuid == puuid).ToListAsync(cancellationToken).ConfigureAwait(false);

    public async Task ReplaceLeagueEntriesAsync(string puuid, IEnumerable<LolLeagueEntry> entries, CancellationToken cancellationToken = default)
    {
        var existing = await _context.LolLeagueEntries.Where(e => e.Puuid == puuid).ToListAsync(cancellationToken).ConfigureAwait(false);
        _context.LolLeagueEntries.RemoveRange(existing);
        await _context.LolLeagueEntries.AddRangeAsync(entries, cancellationToken).ConfigureAwait(false);
    }

    public async Task<IReadOnlyList<LolChampionMastery>> GetChampionMasteriesAsync(string puuid, CancellationToken cancellationToken = default) =>
        await _context.LolChampionMasteries.Where(m => m.Puuid == puuid).ToListAsync(cancellationToken).ConfigureAwait(false);

    public async Task UpsertChampionMasteriesAsync(string puuid, IEnumerable<LolChampionMastery> masteries, CancellationToken cancellationToken = default)
    {
        var existing = await _context.LolChampionMasteries.Where(m => m.Puuid == puuid).ToListAsync(cancellationToken).ConfigureAwait(false);
        var existingByChamp = existing.ToDictionary(e => e.ChampionId);
        foreach (var m in masteries)
        {
            if (existingByChamp.TryGetValue(m.ChampionId, out var current))
            {
                current.ChampionLevel = m.ChampionLevel;
                current.ChampionPoints = m.ChampionPoints;
                current.LastPlayTimeUtc = m.LastPlayTimeUtc;
                current.ChampionPointsSinceLastLevel = m.ChampionPointsSinceLastLevel;
                current.ChampionPointsUntilNextLevel = m.ChampionPointsUntilNextLevel;
                current.TokensEarned = m.TokensEarned;
                current.ChestGranted = m.ChestGranted;
                current.FetchedAtUtc = m.FetchedAtUtc;
            }
            else
            {
                _context.LolChampionMasteries.Add(m);
            }
        }
    }
}

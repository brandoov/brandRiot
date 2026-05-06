using BrandRiot.Domain.Entities.Tft;

namespace BrandRiot.Domain.Abstractions;

public interface ITftRepository
{
    Task<TftSummoner?> GetSummonerByPuuidAsync(string puuid, CancellationToken cancellationToken = default);
    Task UpsertSummonerAsync(TftSummoner summoner, CancellationToken cancellationToken = default);

    Task<TftMatch?> GetMatchByIdAsync(string matchId, CancellationToken cancellationToken = default);
    Task UpsertMatchAsync(TftMatch match, IEnumerable<TftMatchParticipant> participants, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<TftLeagueEntry>> GetLeagueEntriesByPuuidAsync(string puuid, CancellationToken cancellationToken = default);
    Task ReplaceLeagueEntriesAsync(string puuid, IEnumerable<TftLeagueEntry> entries, CancellationToken cancellationToken = default);
}

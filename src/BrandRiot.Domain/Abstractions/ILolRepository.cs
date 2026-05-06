using BrandRiot.Domain.Entities.Lol;

namespace BrandRiot.Domain.Abstractions;

public interface ILolRepository
{
    Task<Summoner?> GetSummonerByPuuidAsync(string puuid, CancellationToken cancellationToken = default);
    Task UpsertSummonerAsync(Summoner summoner, CancellationToken cancellationToken = default);

    Task<LolMatch?> GetMatchByIdAsync(string matchId, CancellationToken cancellationToken = default);
    Task UpsertMatchAsync(LolMatch match, IEnumerable<LolMatchParticipant> participants, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<LolLeagueEntry>> GetLeagueEntriesByPuuidAsync(string puuid, CancellationToken cancellationToken = default);
    Task ReplaceLeagueEntriesAsync(string puuid, IEnumerable<LolLeagueEntry> entries, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<LolChampionMastery>> GetChampionMasteriesAsync(string puuid, CancellationToken cancellationToken = default);
    Task UpsertChampionMasteriesAsync(string puuid, IEnumerable<LolChampionMastery> masteries, CancellationToken cancellationToken = default);
}

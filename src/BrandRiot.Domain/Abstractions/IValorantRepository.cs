using BrandRiot.Domain.Entities.Valorant;

namespace BrandRiot.Domain.Abstractions;

public interface IValorantRepository
{
    Task<ValorantMatch?> GetMatchByIdAsync(string matchId, CancellationToken cancellationToken = default);
    Task UpsertMatchAsync(ValorantMatch match, IEnumerable<ValorantMatchPlayer> players, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<ValorantContentItem>> GetContentAsync(CancellationToken cancellationToken = default);
    Task ReplaceContentAsync(IEnumerable<ValorantContentItem> items, CancellationToken cancellationToken = default);

    Task<ValorantRankedEntry?> GetRankedEntryAsync(string puuid, string actId, CancellationToken cancellationToken = default);
    Task UpsertRankedEntryAsync(ValorantRankedEntry entry, CancellationToken cancellationToken = default);
}

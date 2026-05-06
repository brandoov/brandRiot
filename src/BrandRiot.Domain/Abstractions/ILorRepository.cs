using BrandRiot.Domain.Entities.Lor;
using BrandRiot.Domain.Enums;

namespace BrandRiot.Domain.Abstractions;

public interface ILorRepository
{
    Task<LorMatch?> GetMatchByIdAsync(string matchId, CancellationToken cancellationToken = default);
    Task UpsertMatchAsync(LorMatch match, IEnumerable<LorMatchPlayer> players, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<LorRankedLeaderboardEntry>> GetMasterLeaderboardAsync(RiotCluster cluster, CancellationToken cancellationToken = default);
    Task ReplaceMasterLeaderboardAsync(RiotCluster cluster, IEnumerable<LorRankedLeaderboardEntry> entries, CancellationToken cancellationToken = default);
}

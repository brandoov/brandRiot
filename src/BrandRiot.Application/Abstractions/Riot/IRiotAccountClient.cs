using BrandRiot.Application.Dtos.Riot.Account;
using BrandRiot.Domain.Enums;

namespace BrandRiot.Application.Abstractions.Riot;

public interface IRiotAccountClient
{
    Task<AccountDto> GetByRiotIdAsync(string gameName, string tagLine, RiotCluster cluster, CancellationToken cancellationToken = default);
    Task<AccountDto> GetByPuuidAsync(string puuid, RiotCluster cluster, CancellationToken cancellationToken = default);
}

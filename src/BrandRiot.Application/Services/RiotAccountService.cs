using BrandRiot.Application.Abstractions.Riot;
using BrandRiot.Application.Abstractions.Services;
using BrandRiot.Application.Common;
using BrandRiot.Application.Dtos.Api;
using BrandRiot.Domain.Abstractions;
using BrandRiot.Domain.Entities.Accounts;
using BrandRiot.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace BrandRiot.Application.Services;

public sealed class RiotAccountService : IRiotAccountService
{
    private readonly IRiotAccountClient _accountClient;
    private readonly IRiotAccountRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<RiotAccountService> _logger;

    public RiotAccountService(
        IRiotAccountClient accountClient,
        IRiotAccountRepository repository,
        IUnitOfWork unitOfWork,
        ILogger<RiotAccountService> logger)
    {
        _accountClient = accountClient;
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Result<PlayerSummaryResponse>> GetByRiotIdAsync(string gameName, string tagLine, RiotCluster? cluster, CancellationToken cancellationToken = default)
    {
        var resolved = cluster ?? RiotDefaults.DefaultCluster;
        _logger.LogInformation("Fetching Riot account by RiotId {GameName}#{TagLine} on cluster {Cluster}", gameName, tagLine, resolved);
        var dto = await _accountClient.GetByRiotIdAsync(gameName, tagLine, resolved, cancellationToken).ConfigureAwait(false);
        var account = await UpsertAsync(dto.Puuid, dto.GameName, dto.TagLine, resolved, cancellationToken).ConfigureAwait(false);
        return Result<PlayerSummaryResponse>.Ok(Map(account));
    }

    public async Task<Result<PlayerSummaryResponse>> GetByPuuidAsync(string puuid, RiotCluster? cluster, CancellationToken cancellationToken = default)
    {
        var resolved = cluster ?? RiotDefaults.DefaultCluster;
        var dto = await _accountClient.GetByPuuidAsync(puuid, resolved, cancellationToken).ConfigureAwait(false);
        var account = await UpsertAsync(dto.Puuid, dto.GameName, dto.TagLine, resolved, cancellationToken).ConfigureAwait(false);
        return Result<PlayerSummaryResponse>.Ok(Map(account));
    }

    private async Task<RiotAccount> UpsertAsync(string puuid, string gameName, string tagLine, RiotCluster cluster, CancellationToken cancellationToken)
    {
        var existing = await _repository.GetByPuuidAsync(puuid, cancellationToken).ConfigureAwait(false);
        var now = DateTime.UtcNow;
        if (existing is null)
        {
            existing = new RiotAccount
            {
                Puuid = puuid,
                GameName = gameName,
                TagLine = tagLine,
                ResolvedCluster = cluster,
                FirstFetchedUtc = now,
                LastFetchedUtc = now
            };
        }
        else
        {
            existing.GameName = gameName;
            existing.TagLine = tagLine;
            existing.ResolvedCluster = cluster;
            existing.LastFetchedUtc = now;
        }

        await _repository.UpsertAsync(existing, cancellationToken).ConfigureAwait(false);
        await _unitOfWork.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        return existing;
    }

    private static PlayerSummaryResponse Map(RiotAccount a) => new(
        a.Puuid,
        a.GameName,
        a.TagLine,
        a.ResolvedCluster.ToString(),
        a.LastSeenPlatform?.ToString(),
        a.FirstFetchedUtc,
        a.LastFetchedUtc);
}

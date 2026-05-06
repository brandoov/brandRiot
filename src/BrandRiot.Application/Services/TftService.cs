using System.Text.Json;
using BrandRiot.Application.Abstractions.Riot;
using BrandRiot.Application.Abstractions.Services;
using BrandRiot.Application.Common;
using BrandRiot.Application.Dtos.Api.Tft;
using BrandRiot.Application.Dtos.Riot.Tft;
using BrandRiot.Domain.Abstractions;
using BrandRiot.Domain.Entities.Accounts;
using BrandRiot.Domain.Entities.Tft;
using BrandRiot.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace BrandRiot.Application.Services;

public sealed class TftService : ITftService
{
    private readonly IRiotAccountClient _accountClient;
    private readonly ITftPlatformClient _platformClient;
    private readonly ITftMatchClient _matchClient;
    private readonly IRiotAccountRepository _accountRepository;
    private readonly ITftRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<TftService> _logger;

    public TftService(
        IRiotAccountClient accountClient,
        ITftPlatformClient platformClient,
        ITftMatchClient matchClient,
        IRiotAccountRepository accountRepository,
        ITftRepository repository,
        IUnitOfWork unitOfWork,
        ILogger<TftService> logger)
    {
        _accountClient = accountClient;
        _platformClient = platformClient;
        _matchClient = matchClient;
        _accountRepository = accountRepository;
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Result<TftPlayerResponse>> GetPlayerByRiotIdAsync(string gameName, string tagLine, RiotPlatform? platform, RiotCluster? cluster, CancellationToken cancellationToken = default)
    {
        var resolvedPlatform = platform ?? RiotDefaults.DefaultPlatform;
        var resolvedCluster = cluster ?? RiotRouting.ClusterFor(resolvedPlatform);
        var account = await _accountClient.GetByRiotIdAsync(gameName, tagLine, resolvedCluster, cancellationToken).ConfigureAwait(false);
        await UpsertAccountAsync(account.Puuid, account.GameName, account.TagLine, resolvedCluster, resolvedPlatform, cancellationToken).ConfigureAwait(false);

        var summoner = await _platformClient.GetSummonerByPuuidAsync(account.Puuid, resolvedPlatform, cancellationToken).ConfigureAwait(false);
        var entity = await PersistSummonerAsync(summoner, resolvedPlatform, cancellationToken).ConfigureAwait(false);

        return Result<TftPlayerResponse>.Ok(new TftPlayerResponse(
            entity.Puuid, account.GameName, account.TagLine, resolvedPlatform.ToString(),
            entity.SummonerId, entity.ProfileIconId, entity.SummonerLevel));
    }

    public async Task<Result<TftPlayerResponse>> GetSummonerByPuuidAsync(string puuid, RiotPlatform? platform, CancellationToken cancellationToken = default)
    {
        var resolved = platform ?? RiotDefaults.DefaultPlatform;
        var summoner = await _platformClient.GetSummonerByPuuidAsync(puuid, resolved, cancellationToken).ConfigureAwait(false);
        var entity = await PersistSummonerAsync(summoner, resolved, cancellationToken).ConfigureAwait(false);
        var account = await _accountRepository.GetByPuuidAsync(puuid, cancellationToken).ConfigureAwait(false);

        return Result<TftPlayerResponse>.Ok(new TftPlayerResponse(
            entity.Puuid, account?.GameName ?? string.Empty, account?.TagLine ?? string.Empty, resolved.ToString(),
            entity.SummonerId, entity.ProfileIconId, entity.SummonerLevel));
    }

    public async Task<Result<IReadOnlyList<TftMatchResponse>>> GetRecentMatchesAsync(string puuid, RiotCluster? cluster, int start, int count, CancellationToken cancellationToken = default)
    {
        var resolved = cluster ?? RiotDefaults.DefaultCluster;
        var ids = await _matchClient.GetRecentMatchIdsAsync(puuid, resolved, start, count, cancellationToken).ConfigureAwait(false);
        var responses = new List<TftMatchResponse>(ids.Count);
        foreach (var id in ids)
        {
            var dto = await _matchClient.GetMatchAsync(id, resolved, cancellationToken).ConfigureAwait(false);
            responses.Add(await PersistAndMapMatchAsync(dto, resolved, cancellationToken).ConfigureAwait(false));
        }
        return Result<IReadOnlyList<TftMatchResponse>>.Ok(responses);
    }

    public async Task<Result<TftMatchResponse>> GetMatchByIdAsync(string matchId, RiotCluster? cluster, CancellationToken cancellationToken = default)
    {
        var resolved = cluster ?? RiotDefaults.DefaultCluster;
        var dto = await _matchClient.GetMatchAsync(matchId, resolved, cancellationToken).ConfigureAwait(false);
        var response = await PersistAndMapMatchAsync(dto, resolved, cancellationToken).ConfigureAwait(false);
        return Result<TftMatchResponse>.Ok(response);
    }

    public async Task<Result<TftRankedResponse>> GetRankedAsync(string puuid, RiotPlatform? platform, CancellationToken cancellationToken = default)
    {
        var resolved = platform ?? RiotDefaults.DefaultPlatform;
        var entries = await _platformClient.GetLeagueEntriesByPuuidAsync(puuid, resolved, cancellationToken).ConfigureAwait(false);
        var now = DateTime.UtcNow;
        var domain = entries.Select(e => new TftLeagueEntry
        {
            Puuid = puuid,
            SummonerId = e.SummonerId,
            QueueType = e.QueueType,
            Tier = e.Tier,
            Rank = e.Rank,
            LeaguePoints = e.LeaguePoints,
            Wins = e.Wins,
            Losses = e.Losses,
            HotStreak = e.HotStreak,
            Veteran = e.Veteran,
            FreshBlood = e.FreshBlood,
            Inactive = e.Inactive,
            FetchedAtUtc = now
        }).ToList();

        await _repository.ReplaceLeagueEntriesAsync(puuid, domain, cancellationToken).ConfigureAwait(false);
        await _unitOfWork.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        var response = new TftRankedResponse(puuid, domain
            .Select(e => new TftRankedEntryResponse(e.QueueType, e.Tier, e.Rank, e.LeaguePoints, e.Wins, e.Losses, e.HotStreak))
            .ToList());

        return Result<TftRankedResponse>.Ok(response);
    }

    private async Task UpsertAccountAsync(string puuid, string gameName, string tagLine, RiotCluster cluster, RiotPlatform platform, CancellationToken cancellationToken)
    {
        var existing = await _accountRepository.GetByPuuidAsync(puuid, cancellationToken).ConfigureAwait(false);
        var now = DateTime.UtcNow;
        if (existing is null)
        {
            existing = new RiotAccount
            {
                Puuid = puuid,
                GameName = gameName,
                TagLine = tagLine,
                ResolvedCluster = cluster,
                LastSeenPlatform = platform,
                FirstFetchedUtc = now,
                LastFetchedUtc = now
            };
        }
        else
        {
            existing.GameName = gameName;
            existing.TagLine = tagLine;
            existing.ResolvedCluster = cluster;
            existing.LastSeenPlatform = platform;
            existing.LastFetchedUtc = now;
        }
        await _accountRepository.UpsertAsync(existing, cancellationToken).ConfigureAwait(false);
    }

    private async Task<TftSummoner> PersistSummonerAsync(TftSummonerDto dto, RiotPlatform platform, CancellationToken cancellationToken)
    {
        var existing = await _repository.GetSummonerByPuuidAsync(dto.Puuid, cancellationToken).ConfigureAwait(false);
        if (existing is null)
        {
            existing = new TftSummoner
            {
                Puuid = dto.Puuid,
                SummonerId = dto.Id,
                AccountId = dto.AccountId,
                ProfileIconId = dto.ProfileIconId,
                SummonerLevel = dto.SummonerLevel,
                RevisionDate = dto.RevisionDate,
                Platform = platform
            };
        }
        else
        {
            existing.SummonerId = dto.Id;
            existing.AccountId = dto.AccountId;
            existing.ProfileIconId = dto.ProfileIconId;
            existing.SummonerLevel = dto.SummonerLevel;
            existing.RevisionDate = dto.RevisionDate;
            existing.Platform = platform;
        }
        await _repository.UpsertSummonerAsync(existing, cancellationToken).ConfigureAwait(false);
        await _unitOfWork.SaveChangesAsync(cancellationToken).ConfigureAwait(false);
        return existing;
    }

    private async Task<TftMatchResponse> PersistAndMapMatchAsync(TftMatchDto dto, RiotCluster cluster, CancellationToken cancellationToken)
    {
        var info = dto.Info;
        var match = new TftMatch
        {
            MatchId = dto.Metadata.MatchId,
            Cluster = cluster,
            GameDateUtc = DateTimeOffset.FromUnixTimeMilliseconds(info.GameDatetime).UtcDateTime,
            GameLengthSeconds = (long)Math.Round(info.GameLength),
            GameVersion = info.GameVersion,
            QueueId = info.QueueId,
            TftSetNumber = info.TftSetNumber,
            TftGameType = info.TftGameType
        };

        var participants = info.Participants.Select(p => new TftMatchParticipant
        {
            MatchId = match.MatchId,
            Puuid = p.Puuid,
            Placement = p.Placement,
            Level = p.Level,
            LastRound = p.LastRound,
            PlayersEliminated = p.PlayersEliminated,
            TotalDamageToPlayers = p.TotalDamageToPlayers,
            GoldLeft = p.GoldLeft,
            TimeEliminatedSeconds = p.TimeEliminated,
            CompanionContentId = p.CompanionContentId,
            TraitsJson = SerializeJson(p.Traits),
            UnitsJson = SerializeJson(p.Units),
            AugmentsJson = p.Augments.HasValue ? SerializeJson(p.Augments.Value) : "[]"
        }).ToList();

        await _repository.UpsertMatchAsync(match, participants, cancellationToken).ConfigureAwait(false);
        await _unitOfWork.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return new TftMatchResponse(
            match.MatchId, match.Cluster.ToString(), match.GameDateUtc, match.GameLengthSeconds,
            match.GameVersion, match.QueueId, match.TftSetNumber, match.TftGameType,
            participants.Select(p => new TftMatchParticipantResponse(
                p.Puuid, p.Placement, p.Level, p.LastRound, p.PlayersEliminated, p.TotalDamageToPlayers, p.GoldLeft)).ToList());
    }

    private static string SerializeJson(JsonElement element) =>
        element.ValueKind is JsonValueKind.Undefined or JsonValueKind.Null ? "[]" : element.GetRawText();
}

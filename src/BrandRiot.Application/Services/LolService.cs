using BrandRiot.Application.Abstractions.Riot;
using BrandRiot.Application.Abstractions.Services;
using BrandRiot.Application.Common;
using BrandRiot.Application.Dtos.Api.Lol;
using BrandRiot.Application.Dtos.Riot.Lol;
using BrandRiot.Domain.Abstractions;
using BrandRiot.Domain.Entities.Accounts;
using BrandRiot.Domain.Entities.Lol;
using BrandRiot.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace BrandRiot.Application.Services;

public sealed class LolService : ILolService
{
    private readonly IRiotAccountClient _accountClient;
    private readonly ILolPlatformClient _platformClient;
    private readonly ILolMatchClient _matchClient;
    private readonly IRiotAccountRepository _accountRepository;
    private readonly ILolRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<LolService> _logger;

    public LolService(
        IRiotAccountClient accountClient,
        ILolPlatformClient platformClient,
        ILolMatchClient matchClient,
        IRiotAccountRepository accountRepository,
        ILolRepository repository,
        IUnitOfWork unitOfWork,
        ILogger<LolService> logger)
    {
        _accountClient = accountClient;
        _platformClient = platformClient;
        _matchClient = matchClient;
        _accountRepository = accountRepository;
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Result<LolPlayerResponse>> GetPlayerByRiotIdAsync(string gameName, string tagLine, RiotPlatform? platform, RiotCluster? cluster, CancellationToken cancellationToken = default)
    {
        var resolvedPlatform = platform ?? RiotDefaults.DefaultPlatform;
        var resolvedCluster = cluster ?? RiotRouting.ClusterFor(resolvedPlatform);

        var account = await _accountClient.GetByRiotIdAsync(gameName, tagLine, resolvedCluster, cancellationToken).ConfigureAwait(false);
        await UpsertAccountAsync(account.Puuid, account.GameName, account.TagLine, resolvedCluster, resolvedPlatform, cancellationToken).ConfigureAwait(false);

        var summoner = await _platformClient.GetSummonerByPuuidAsync(account.Puuid, resolvedPlatform, cancellationToken).ConfigureAwait(false);
        var entity = await PersistSummonerAsync(summoner, resolvedPlatform, cancellationToken).ConfigureAwait(false);

        return Result<LolPlayerResponse>.Ok(new LolPlayerResponse(
            entity.Puuid, account.GameName, account.TagLine, resolvedPlatform.ToString(),
            entity.SummonerId, entity.ProfileIconId, entity.SummonerLevel, entity.RevisionDate));
    }

    public async Task<Result<LolPlayerResponse>> GetSummonerByPuuidAsync(string puuid, RiotPlatform? platform, CancellationToken cancellationToken = default)
    {
        var resolved = platform ?? RiotDefaults.DefaultPlatform;
        var summoner = await _platformClient.GetSummonerByPuuidAsync(puuid, resolved, cancellationToken).ConfigureAwait(false);
        var entity = await PersistSummonerAsync(summoner, resolved, cancellationToken).ConfigureAwait(false);
        var account = await _accountRepository.GetByPuuidAsync(puuid, cancellationToken).ConfigureAwait(false);

        return Result<LolPlayerResponse>.Ok(new LolPlayerResponse(
            entity.Puuid, account?.GameName ?? string.Empty, account?.TagLine ?? string.Empty, resolved.ToString(),
            entity.SummonerId, entity.ProfileIconId, entity.SummonerLevel, entity.RevisionDate));
    }

    public async Task<Result<IReadOnlyList<LolMatchResponse>>> GetRecentMatchesAsync(string puuid, RiotCluster? cluster, int start, int count, int? queue, string? type, CancellationToken cancellationToken = default)
    {
        var resolvedCluster = cluster ?? RiotDefaults.DefaultCluster;
        var ids = await _matchClient.GetRecentMatchIdsAsync(puuid, resolvedCluster, start, count, queue, type, cancellationToken).ConfigureAwait(false);

        var responses = new List<LolMatchResponse>(ids.Count);
        foreach (var matchId in ids)
        {
            var dto = await _matchClient.GetMatchAsync(matchId, resolvedCluster, cancellationToken).ConfigureAwait(false);
            responses.Add(await PersistAndMapMatchAsync(dto, cancellationToken).ConfigureAwait(false));
        }

        return Result<IReadOnlyList<LolMatchResponse>>.Ok(responses);
    }

    public async Task<Result<LolMatchResponse>> GetMatchByIdAsync(string matchId, RiotCluster? cluster, CancellationToken cancellationToken = default)
    {
        var resolvedCluster = cluster ?? RiotDefaults.DefaultCluster;
        var dto = await _matchClient.GetMatchAsync(matchId, resolvedCluster, cancellationToken).ConfigureAwait(false);
        var response = await PersistAndMapMatchAsync(dto, cancellationToken).ConfigureAwait(false);
        return Result<LolMatchResponse>.Ok(response);
    }

    public async Task<Result<LolRankedResponse>> GetRankedAsync(string puuid, RiotPlatform? platform, CancellationToken cancellationToken = default)
    {
        var resolved = platform ?? RiotDefaults.DefaultPlatform;
        var entries = await _platformClient.GetLeagueEntriesByPuuidAsync(puuid, resolved, cancellationToken).ConfigureAwait(false);
        var now = DateTime.UtcNow;
        var domainEntries = entries.Select(e => new LolLeagueEntry
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

        await _repository.ReplaceLeagueEntriesAsync(puuid, domainEntries, cancellationToken).ConfigureAwait(false);
        await _unitOfWork.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        var response = new LolRankedResponse(puuid, domainEntries
            .Select(e => new LolRankedEntryResponse(e.QueueType, e.Tier, e.Rank, e.LeaguePoints, e.Wins, e.Losses, e.HotStreak, e.Veteran, e.FreshBlood, e.Inactive))
            .ToList());

        return Result<LolRankedResponse>.Ok(response);
    }

    public async Task<Result<IReadOnlyList<LolChampionMasteryResponse>>> GetChampionMasteriesAsync(string puuid, RiotPlatform? platform, int top, CancellationToken cancellationToken = default)
    {
        var resolved = platform ?? RiotDefaults.DefaultPlatform;
        var dtos = await _platformClient.GetTopChampionMasteriesAsync(puuid, resolved, top, cancellationToken).ConfigureAwait(false);
        var now = DateTime.UtcNow;

        var domain = dtos.Select(m => new LolChampionMastery
        {
            Puuid = puuid,
            ChampionId = m.ChampionId,
            ChampionLevel = m.ChampionLevel,
            ChampionPoints = m.ChampionPoints,
            LastPlayTimeUtc = DateTimeOffset.FromUnixTimeMilliseconds(m.LastPlayTime).UtcDateTime,
            ChampionPointsSinceLastLevel = m.ChampionPointsSinceLastLevel,
            ChampionPointsUntilNextLevel = m.ChampionPointsUntilNextLevel,
            TokensEarned = m.TokensEarned,
            ChestGranted = m.ChestGranted,
            FetchedAtUtc = now
        }).ToList();

        await _repository.UpsertChampionMasteriesAsync(puuid, domain, cancellationToken).ConfigureAwait(false);
        await _unitOfWork.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        var response = domain.Select(d => new LolChampionMasteryResponse(
            d.ChampionId, d.ChampionLevel, d.ChampionPoints, d.LastPlayTimeUtc,
            d.ChampionPointsSinceLastLevel, d.ChampionPointsUntilNextLevel, d.TokensEarned, d.ChestGranted)).ToList();

        return Result<IReadOnlyList<LolChampionMasteryResponse>>.Ok(response);
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

    private async Task<Summoner> PersistSummonerAsync(SummonerDto dto, RiotPlatform platform, CancellationToken cancellationToken)
    {
        var existing = await _repository.GetSummonerByPuuidAsync(dto.Puuid, cancellationToken).ConfigureAwait(false);
        if (existing is null)
        {
            existing = new Summoner
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

    private async Task<LolMatchResponse> PersistAndMapMatchAsync(MatchDto dto, CancellationToken cancellationToken)
    {
        var info = dto.Info;
        var match = new LolMatch
        {
            MatchId = dto.Metadata.MatchId,
            Platform = ParsePlatform(info.PlatformId),
            GameCreationUtc = DateTimeOffset.FromUnixTimeMilliseconds(info.GameCreation).UtcDateTime,
            GameDurationSeconds = info.GameDuration,
            GameVersion = info.GameVersion,
            QueueId = info.QueueId,
            MapId = info.MapId,
            GameMode = info.GameMode,
            GameType = info.GameType
        };

        var participants = info.Participants.Select(p => new LolMatchParticipant
        {
            MatchId = match.MatchId,
            Puuid = p.Puuid,
            ChampionId = p.ChampionId,
            ChampionName = p.ChampionName,
            TeamId = p.TeamId,
            Win = p.Win,
            Kills = p.Kills,
            Deaths = p.Deaths,
            Assists = p.Assists,
            GoldEarned = p.GoldEarned,
            TotalDamageDealtToChampions = p.TotalDamageDealtToChampions,
            VisionScore = p.VisionScore,
            CsTotal = p.TotalMinionsKilled + p.NeutralMinionsKilled,
            Lane = p.Lane,
            Role = p.Role,
            Item0 = p.Item0,
            Item1 = p.Item1,
            Item2 = p.Item2,
            Item3 = p.Item3,
            Item4 = p.Item4,
            Item5 = p.Item5,
            Item6 = p.Item6,
            Summoner1Id = p.Summoner1Id,
            Summoner2Id = p.Summoner2Id,
            KeystonePerk = p.Perks?.PrimaryStyle?.Selections.FirstOrDefault()?.Perk
        }).ToList();

        await _repository.UpsertMatchAsync(match, participants, cancellationToken).ConfigureAwait(false);
        await _unitOfWork.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return new LolMatchResponse(
            match.MatchId,
            match.Platform.ToString(),
            match.GameCreationUtc,
            match.GameDurationSeconds,
            match.GameVersion,
            match.QueueId,
            match.MapId,
            match.GameMode,
            match.GameType,
            participants.Select(p => new LolMatchParticipantResponse(
                p.Puuid, p.ChampionId, p.ChampionName, p.TeamId, p.Win, p.Kills, p.Deaths, p.Assists,
                p.GoldEarned, p.TotalDamageDealtToChampions, p.VisionScore, p.CsTotal, p.Lane, p.Role)).ToList());
    }

    private static RiotPlatform ParsePlatform(string platformId) =>
        Enum.TryParse<RiotPlatform>(platformId, true, out var parsed) ? parsed : RiotDefaults.DefaultPlatform;
}

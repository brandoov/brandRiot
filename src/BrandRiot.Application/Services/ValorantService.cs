using System.Text.Json;
using BrandRiot.Application.Abstractions.Riot;
using BrandRiot.Application.Abstractions.Services;
using BrandRiot.Application.Common;
using BrandRiot.Application.Dtos.Api.Valorant;
using BrandRiot.Application.Dtos.Riot.Valorant;
using BrandRiot.Domain.Abstractions;
using BrandRiot.Domain.Entities.Valorant;
using BrandRiot.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace BrandRiot.Application.Services;

public sealed class ValorantService : IValorantService
{
    private readonly IValorantPlatformClient _platformClient;
    private readonly IValorantRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ValorantService> _logger;

    public ValorantService(
        IValorantPlatformClient platformClient,
        IValorantRepository repository,
        IUnitOfWork unitOfWork,
        ILogger<ValorantService> logger)
    {
        _platformClient = platformClient;
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Result<ValorantMatchHistoryResponse>> GetMatchHistoryAsync(string puuid, RiotPlatform? platform, CancellationToken cancellationToken = default)
    {
        var resolved = platform ?? RiotDefaults.DefaultPlatform;
        var dto = await _platformClient.GetMatchHistoryAsync(puuid, resolved, cancellationToken).ConfigureAwait(false);
        var response = new ValorantMatchHistoryResponse(
            dto.Puuid,
            dto.History.Select(h => new ValorantMatchHistoryEntryResponse(
                h.MatchId,
                DateTimeOffset.FromUnixTimeMilliseconds(h.GameStartTimeMillis).UtcDateTime,
                h.QueueId)).ToList());
        return Result<ValorantMatchHistoryResponse>.Ok(response);
    }

    public async Task<Result<ValorantMatchResponse>> GetMatchByIdAsync(string matchId, RiotPlatform? platform, CancellationToken cancellationToken = default)
    {
        var resolved = platform ?? RiotDefaults.DefaultPlatform;
        var dto = await _platformClient.GetMatchAsync(matchId, resolved, cancellationToken).ConfigureAwait(false);
        var response = await PersistAndMapMatchAsync(dto, resolved, cancellationToken).ConfigureAwait(false);
        return Result<ValorantMatchResponse>.Ok(response);
    }

    public async Task<Result<ValorantContentResponse>> GetContentAsync(RiotPlatform? platform, string? locale, CancellationToken cancellationToken = default)
    {
        var resolved = platform ?? RiotDefaults.DefaultPlatform;
        var dto = await _platformClient.GetContentAsync(resolved, locale, cancellationToken).ConfigureAwait(false);
        var now = DateTime.UtcNow;

        var items = new List<ValorantContentItem>();
        items.AddRange(dto.Characters.Select(c => MapItem(c, "Character", now)));
        items.AddRange(dto.Maps.Select(c => MapItem(c, "Map", now)));
        items.AddRange(dto.GameModes.Select(c => MapItem(c, "GameMode", now)));
        items.AddRange(dto.Acts.Select(c => MapItem(c, "Act", now)));

        await _repository.ReplaceContentAsync(items, cancellationToken).ConfigureAwait(false);
        await _unitOfWork.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        var response = new ValorantContentResponse(dto.Version, dto.Characters.Count, dto.Maps.Count, dto.GameModes.Count, dto.Acts.Count);
        return Result<ValorantContentResponse>.Ok(response);
    }

    public async Task<Result<ValorantRankedResponse>> GetRankedAsync(string puuid, RiotPlatform? platform, CancellationToken cancellationToken = default)
    {
        var resolved = platform ?? RiotDefaults.DefaultPlatform;
        var dto = await _platformClient.GetRankedAsync(puuid, resolved, cancellationToken).ConfigureAwait(false);
        var entry = new ValorantRankedEntry
        {
            Puuid = dto.Puuid,
            ActId = dto.ActId,
            Tier = dto.Tier,
            RankedRating = dto.RankedRating,
            NumberOfWins = dto.NumberOfWins,
            FetchedAtUtc = DateTime.UtcNow
        };

        await _repository.UpsertRankedEntryAsync(entry, cancellationToken).ConfigureAwait(false);
        await _unitOfWork.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<ValorantRankedResponse>.Ok(new ValorantRankedResponse(entry.Puuid, entry.ActId, entry.Tier, entry.RankedRating, entry.NumberOfWins));
    }

    private async Task<ValorantMatchResponse> PersistAndMapMatchAsync(ValMatchDto dto, RiotPlatform platform, CancellationToken cancellationToken)
    {
        var info = dto.MatchInfo;
        var match = new ValorantMatch
        {
            MatchId = info.MatchId,
            Platform = platform,
            MapId = info.MapId,
            GameVersion = info.GameVersion,
            QueueId = info.QueueId,
            GameStartUtc = DateTimeOffset.FromUnixTimeMilliseconds(info.GameStartMillis).UtcDateTime,
            GameLengthMillis = info.GameLengthMillis,
            IsCompleted = info.IsCompleted,
            SeasonId = info.SeasonId
        };

        var players = dto.Players.Select(p => new ValorantMatchPlayer
        {
            MatchId = info.MatchId,
            Puuid = p.Puuid,
            TeamId = p.TeamId,
            CharacterId = p.CharacterId,
            Score = p.Stats.Score,
            RoundsPlayed = p.Stats.RoundsPlayed,
            Kills = p.Stats.Kills,
            Deaths = p.Stats.Deaths,
            Assists = p.Stats.Assists,
            PlaytimeMillis = p.Stats.PlaytimeMillis,
            AbilityCastsJson = "{}",
            DamagePerRoundJson = "[]"
        }).ToList();

        await _repository.UpsertMatchAsync(match, players, cancellationToken).ConfigureAwait(false);
        await _unitOfWork.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return new ValorantMatchResponse(
            match.MatchId, match.Platform.ToString(), match.MapId, match.GameVersion, match.QueueId,
            match.GameStartUtc, match.GameLengthMillis, match.IsCompleted, match.SeasonId,
            players.Select(p => new ValorantMatchPlayerResponse(p.Puuid, p.TeamId, p.CharacterId, p.Score, p.RoundsPlayed, p.Kills, p.Deaths, p.Assists)).ToList());
    }

    private static ValorantContentItem MapItem(ValContentItemDto dto, string contentType, DateTime now) => new()
    {
        ContentType = contentType,
        ContentId = dto.Id,
        Name = dto.Name,
        LocalizedNamesJson = string.IsNullOrEmpty(dto.LocalizedNames) ? "{}" : JsonSerializer.Serialize(dto.LocalizedNames),
        AssetPath = dto.AssetName,
        FetchedAtUtc = now,
        IsActive = dto.IsActive
    };
}

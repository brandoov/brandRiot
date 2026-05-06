using BrandRiot.Application.Abstractions.Riot;
using BrandRiot.Application.Abstractions.Services;
using BrandRiot.Application.Common;
using BrandRiot.Application.Dtos.Api.Lor;
using BrandRiot.Application.Dtos.Riot.Lor;
using BrandRiot.Domain.Abstractions;
using BrandRiot.Domain.Entities.Lor;
using BrandRiot.Domain.Enums;
using Microsoft.Extensions.Logging;

namespace BrandRiot.Application.Services;

public sealed class LorService : ILorService
{
    private readonly ILorMatchClient _matchClient;
    private readonly ILorRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<LorService> _logger;

    public LorService(
        ILorMatchClient matchClient,
        ILorRepository repository,
        IUnitOfWork unitOfWork,
        ILogger<LorService> logger)
    {
        _matchClient = matchClient;
        _repository = repository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<Result<LorMatchIdsResponse>> GetRecentMatchIdsAsync(string puuid, RiotCluster? cluster, CancellationToken cancellationToken = default)
    {
        var resolved = cluster ?? RiotDefaults.DefaultCluster;
        var ids = await _matchClient.GetRecentMatchIdsAsync(puuid, resolved, cancellationToken).ConfigureAwait(false);
        return Result<LorMatchIdsResponse>.Ok(new LorMatchIdsResponse(puuid, resolved.ToString(), ids));
    }

    public async Task<Result<LorMatchResponse>> GetMatchByIdAsync(string matchId, RiotCluster? cluster, CancellationToken cancellationToken = default)
    {
        var resolved = cluster ?? RiotDefaults.DefaultCluster;
        var dto = await _matchClient.GetMatchAsync(matchId, resolved, cancellationToken).ConfigureAwait(false);
        var response = await PersistAndMapMatchAsync(dto, resolved, cancellationToken).ConfigureAwait(false);
        return Result<LorMatchResponse>.Ok(response);
    }

    public async Task<Result<LorLeaderboardResponse>> GetMasterLeaderboardAsync(RiotCluster? cluster, CancellationToken cancellationToken = default)
    {
        var resolved = cluster ?? RiotDefaults.DefaultCluster;
        var dto = await _matchClient.GetMasterLeaderboardAsync(resolved, cancellationToken).ConfigureAwait(false);
        var now = DateTime.UtcNow;
        var entries = dto.Players.Select(p => new LorRankedLeaderboardEntry
        {
            Cluster = resolved,
            Rank = p.Rank,
            Name = p.Name,
            LeaguePoints = p.LeaguePoints,
            FetchedAtUtc = now
        }).ToList();

        await _repository.ReplaceMasterLeaderboardAsync(resolved, entries, cancellationToken).ConfigureAwait(false);
        await _unitOfWork.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return Result<LorLeaderboardResponse>.Ok(new LorLeaderboardResponse(
            resolved.ToString(),
            now,
            entries.Select(e => new LorLeaderboardEntryResponse(e.Rank, e.Name, e.LeaguePoints)).ToList()));
    }

    private async Task<LorMatchResponse> PersistAndMapMatchAsync(LorMatchDto dto, RiotCluster cluster, CancellationToken cancellationToken)
    {
        var info = dto.Info;
        var startUtc = DateTime.TryParse(info.GameStartTimeUtc, null, System.Globalization.DateTimeStyles.AssumeUniversal | System.Globalization.DateTimeStyles.AdjustToUniversal, out var parsed)
            ? parsed
            : DateTime.UtcNow;

        var match = new LorMatch
        {
            MatchId = dto.Metadata.MatchId,
            Cluster = cluster,
            GameStartUtc = startUtc,
            GameMode = info.GameMode,
            GameType = info.GameType,
            GameVersion = info.GameVersion,
            GameFormat = info.GameFormat,
            TotalTurnCount = info.TotalTurnCount
        };

        var players = info.Players.Select(p => new LorMatchPlayer
        {
            MatchId = match.MatchId,
            Puuid = p.Puuid,
            DeckId = p.DeckId,
            DeckCode = p.DeckCode,
            GameOutcome = p.GameOutcome,
            OrderOfPlay = p.OrderOfPlay,
            FactionsJson = System.Text.Json.JsonSerializer.Serialize(p.Factions)
        }).ToList();

        await _repository.UpsertMatchAsync(match, players, cancellationToken).ConfigureAwait(false);
        await _unitOfWork.SaveChangesAsync(cancellationToken).ConfigureAwait(false);

        return new LorMatchResponse(
            match.MatchId, match.Cluster.ToString(), match.GameStartUtc, match.GameMode, match.GameType,
            match.GameVersion, match.GameFormat, match.TotalTurnCount,
            players.Select(p => new LorMatchPlayerResponse(p.Puuid, p.DeckId, p.DeckCode, p.GameOutcome, p.OrderOfPlay)).ToList());
    }
}

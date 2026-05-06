using BrandRiot.Application.Abstractions.Services;
using BrandRiot.Application.Dtos.Api.Tft;
using BrandRiot.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace BrandRiot.Api.Controllers;

[ApiController]
[Route("api/tft")]
[Tags("Teamfight Tactics")]
public sealed class TftController : ControllerBase
{
    private readonly ITftService _service;

    public TftController(ITftService service)
    {
        _service = service;
    }

    /// <summary>Resolves a Riot ID and fetches the TFT summoner profile.</summary>
    [HttpGet("players/by-riot-id")]
    [ProducesResponseType(typeof(TftPlayerResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<TftPlayerResponse>> GetPlayerByRiotId([FromQuery] string gameName, [FromQuery] string tagLine, [FromQuery] RiotPlatform? platform, [FromQuery] RiotCluster? cluster, CancellationToken cancellationToken)
    {
        var result = await _service.GetPlayerByRiotIdAsync(gameName, tagLine, platform, cluster, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }

    /// <summary>Returns the TFT summoner data for the given puuid.</summary>
    [HttpGet("players/{puuid}/summoner")]
    [ProducesResponseType(typeof(TftPlayerResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<TftPlayerResponse>> GetSummoner(string puuid, [FromQuery] RiotPlatform? platform, CancellationToken cancellationToken)
    {
        var result = await _service.GetSummonerByPuuidAsync(puuid, platform, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }

    /// <summary>Returns recent TFT matches for the given puuid (full match data is persisted).</summary>
    [HttpGet("players/{puuid}/matches")]
    [ProducesResponseType(typeof(IReadOnlyList<TftMatchResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<TftMatchResponse>>> GetRecentMatches(string puuid, [FromQuery] RiotCluster? cluster, [FromQuery] int start = 0, [FromQuery] int count = 20, CancellationToken cancellationToken = default)
    {
        var result = await _service.GetRecentMatchesAsync(puuid, cluster, start, count, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }

    /// <summary>Returns a single TFT match by id.</summary>
    [HttpGet("matches/{matchId}")]
    [ProducesResponseType(typeof(TftMatchResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<TftMatchResponse>> GetMatchById(string matchId, [FromQuery] RiotCluster? cluster, CancellationToken cancellationToken)
    {
        var result = await _service.GetMatchByIdAsync(matchId, cluster, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }

    /// <summary>Returns the ranked entries for the given puuid.</summary>
    [HttpGet("players/{puuid}/ranked")]
    [ProducesResponseType(typeof(TftRankedResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<TftRankedResponse>> GetRanked(string puuid, [FromQuery] RiotPlatform? platform, CancellationToken cancellationToken)
    {
        var result = await _service.GetRankedAsync(puuid, platform, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }
}

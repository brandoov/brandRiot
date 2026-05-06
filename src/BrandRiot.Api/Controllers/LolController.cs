using BrandRiot.Application.Abstractions.Services;
using BrandRiot.Application.Dtos.Api.Lol;
using BrandRiot.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace BrandRiot.Api.Controllers;

[ApiController]
[Route("api/lol")]
[Tags("League of Legends")]
public sealed class LolController : ControllerBase
{
    private readonly ILolService _service;

    public LolController(ILolService service)
    {
        _service = service;
    }

    /// <summary>Resolves a Riot ID and fetches the LoL summoner profile.</summary>
    [HttpGet("players/by-riot-id")]
    [ProducesResponseType(typeof(LolPlayerResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<LolPlayerResponse>> GetPlayerByRiotId([FromQuery] string gameName, [FromQuery] string tagLine, [FromQuery] RiotPlatform? platform, [FromQuery] RiotCluster? cluster, CancellationToken cancellationToken)
    {
        var result = await _service.GetPlayerByRiotIdAsync(gameName, tagLine, platform, cluster, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }

    /// <summary>Returns the LoL summoner data for the given puuid.</summary>
    [HttpGet("players/{puuid}/summoner")]
    [ProducesResponseType(typeof(LolPlayerResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<LolPlayerResponse>> GetSummoner(string puuid, [FromQuery] RiotPlatform? platform, CancellationToken cancellationToken)
    {
        var result = await _service.GetSummonerByPuuidAsync(puuid, platform, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }

    /// <summary>Returns recent matches for the given puuid (full match data is persisted).</summary>
    [HttpGet("players/{puuid}/matches")]
    [ProducesResponseType(typeof(IReadOnlyList<LolMatchResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<LolMatchResponse>>> GetRecentMatches(
        string puuid,
        [FromQuery] RiotCluster? cluster,
        [FromQuery] int start = 0,
        [FromQuery] int count = 20,
        [FromQuery] int? queue = null,
        [FromQuery] string? type = null,
        CancellationToken cancellationToken = default)
    {
        var result = await _service.GetRecentMatchesAsync(puuid, cluster, start, count, queue, type, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }

    /// <summary>Returns a single LoL match by id.</summary>
    [HttpGet("matches/{matchId}")]
    [ProducesResponseType(typeof(LolMatchResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<LolMatchResponse>> GetMatchById(string matchId, [FromQuery] RiotCluster? cluster, CancellationToken cancellationToken)
    {
        var result = await _service.GetMatchByIdAsync(matchId, cluster, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }

    /// <summary>Returns the ranked entries for the given puuid.</summary>
    [HttpGet("players/{puuid}/ranked")]
    [ProducesResponseType(typeof(LolRankedResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<LolRankedResponse>> GetRanked(string puuid, [FromQuery] RiotPlatform? platform, CancellationToken cancellationToken)
    {
        var result = await _service.GetRankedAsync(puuid, platform, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }

    /// <summary>Returns top champion masteries for the given puuid.</summary>
    [HttpGet("players/{puuid}/champion-mastery")]
    [ProducesResponseType(typeof(IReadOnlyList<LolChampionMasteryResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<LolChampionMasteryResponse>>> GetChampionMastery(string puuid, [FromQuery] RiotPlatform? platform, [FromQuery] int top = 10, CancellationToken cancellationToken = default)
    {
        var result = await _service.GetChampionMasteriesAsync(puuid, platform, top, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }
}

using BrandRiot.Application.Abstractions.Services;
using BrandRiot.Application.Dtos.Api.Lor;
using BrandRiot.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace BrandRiot.Api.Controllers;

[ApiController]
[Route("api/lor")]
[Tags("Legends of Runeterra")]
public sealed class LorController : ControllerBase
{
    private readonly ILorService _service;

    public LorController(ILorService service)
    {
        _service = service;
    }

    /// <summary>Returns recent LoR match ids for the given puuid.</summary>
    [HttpGet("players/{puuid}/matches")]
    [ProducesResponseType(typeof(LorMatchIdsResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<LorMatchIdsResponse>> GetRecentMatches(string puuid, [FromQuery] RiotCluster? cluster, CancellationToken cancellationToken)
    {
        var result = await _service.GetRecentMatchIdsAsync(puuid, cluster, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }

    /// <summary>Returns a single LoR match by id.</summary>
    [HttpGet("matches/{matchId}")]
    [ProducesResponseType(typeof(LorMatchResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<LorMatchResponse>> GetMatchById(string matchId, [FromQuery] RiotCluster? cluster, CancellationToken cancellationToken)
    {
        var result = await _service.GetMatchByIdAsync(matchId, cluster, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }

    /// <summary>Returns the LoR Master tier leaderboard for the given regional cluster.</summary>
    [HttpGet("leaderboards/master")]
    [ProducesResponseType(typeof(LorLeaderboardResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<LorLeaderboardResponse>> GetMasterLeaderboard([FromQuery] RiotCluster? cluster, CancellationToken cancellationToken)
    {
        var result = await _service.GetMasterLeaderboardAsync(cluster, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }
}

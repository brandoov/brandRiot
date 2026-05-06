using BrandRiot.Application.Abstractions.Services;
using BrandRiot.Application.Dtos.Api.Valorant;
using BrandRiot.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace BrandRiot.Api.Controllers;

[ApiController]
[Route("api/valorant")]
[Tags("VALORANT (production key required)")]
public sealed class ValorantController : ControllerBase
{
    private readonly IValorantService _service;

    public ValorantController(IValorantService service)
    {
        _service = service;
    }

    /// <summary>Returns recent Valorant matches for the given puuid. Requires Riot production API key.</summary>
    [HttpGet("players/{puuid}/matches")]
    [SwaggerOperation(Description = "Requires Riot production API key — development keys typically return 403 Forbidden.")]
    [ProducesResponseType(typeof(ValorantMatchHistoryResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<ValorantMatchHistoryResponse>> GetMatchHistory(string puuid, [FromQuery] RiotPlatform? platform, CancellationToken cancellationToken)
    {
        var result = await _service.GetMatchHistoryAsync(puuid, platform, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }

    /// <summary>Returns a single Valorant match by id (requires production API key).</summary>
    [HttpGet("matches/{matchId}")]
    [SwaggerOperation(Description = "Requires Riot production API key.")]
    [ProducesResponseType(typeof(ValorantMatchResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<ValorantMatchResponse>> GetMatchById(string matchId, [FromQuery] RiotPlatform? platform, CancellationToken cancellationToken)
    {
        var result = await _service.GetMatchByIdAsync(matchId, platform, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }

    /// <summary>Returns Valorant content (characters, maps, modes, acts).</summary>
    [HttpGet("content")]
    [SwaggerOperation(Description = "Requires Riot production API key.")]
    [ProducesResponseType(typeof(ValorantContentResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<ValorantContentResponse>> GetContent([FromQuery] RiotPlatform? platform, [FromQuery] string? locale, CancellationToken cancellationToken)
    {
        var result = await _service.GetContentAsync(platform, locale, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }

    /// <summary>Returns the ranked entry for the given puuid.</summary>
    [HttpGet("players/{puuid}/ranked")]
    [SwaggerOperation(Description = "Requires Riot production API key.")]
    [ProducesResponseType(typeof(ValorantRankedResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<ValorantRankedResponse>> GetRanked(string puuid, [FromQuery] RiotPlatform? platform, CancellationToken cancellationToken)
    {
        var result = await _service.GetRankedAsync(puuid, platform, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }
}

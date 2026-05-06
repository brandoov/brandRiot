using BrandRiot.Application.Abstractions.Services;
using BrandRiot.Application.Dtos.Api;
using BrandRiot.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace BrandRiot.Api.Controllers;

[ApiController]
[Route("api/account")]
[Tags("Account")]
public sealed class AccountController : ControllerBase
{
    private readonly IRiotAccountService _service;

    public AccountController(IRiotAccountService service)
    {
        _service = service;
    }

    /// <summary>Resolves a Riot ID (gameName#tagLine) to a puuid and persists the account.</summary>
    [HttpGet("by-riot-id")]
    [SwaggerOperation(Summary = "Resolve Riot ID to puuid", Description = "Calls account-v1 by-riot-id and persists the account.")]
    [ProducesResponseType(typeof(PlayerSummaryResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<PlayerSummaryResponse>> GetByRiotId([FromQuery] string gameName, [FromQuery] string tagLine, [FromQuery] RiotCluster? cluster, CancellationToken cancellationToken)
    {
        var result = await _service.GetByRiotIdAsync(gameName, tagLine, cluster, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }

    /// <summary>Fetches the Riot account by puuid and persists/refreshes it.</summary>
    [HttpGet("by-puuid/{puuid}")]
    [ProducesResponseType(typeof(PlayerSummaryResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<PlayerSummaryResponse>> GetByPuuid(string puuid, [FromQuery] RiotCluster? cluster, CancellationToken cancellationToken)
    {
        var result = await _service.GetByPuuidAsync(puuid, cluster, cancellationToken);
        return result.IsSuccess ? Ok(result.Value) : Problem(result.Error, statusCode: result.StatusCode);
    }
}

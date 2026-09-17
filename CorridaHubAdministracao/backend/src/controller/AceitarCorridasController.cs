using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

[EnableRateLimiting("PorUsuario")]
[ApiController]
[Route("/api/adm-corrida")]
public class AceitarCorridasController : ControllerBase
{
    private readonly RequisicaoCorridaService _requisicaoService;

    public AceitarCorridasController(RequisicaoCorridaService requisicaoService)
    {
        _requisicaoService = requisicaoService;
    }

    [HttpPost("aceitar-solicitacoes-corridas")]
    public async Task<IActionResult> AceitarCorrida([FromQuery] string uid)
    {
        return await _requisicaoService.AceitarCorridas(uid) ? NoContent() : NotFound();
    }
}   

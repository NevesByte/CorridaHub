using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

[EnableRateLimiting("PorUsuario")]
[ApiController]
[Route("/api/adm-corrida")]
public class RemoverCorridasController : ControllerBase
{
    private readonly RequisicaoCorridaService _requisicaoService;

    public RemoverCorridasController(RequisicaoCorridaService requisicaoService)
    {
        _requisicaoService = requisicaoService;
    }

    [HttpDelete("remover-solicitacoes-corridas")]
    public async Task<IActionResult> RemoverCorrida([FromQuery] string uid)
    {
        return await _requisicaoService.RemoverCorridas(uid) ? NoContent() : NotFound();
    }
}   

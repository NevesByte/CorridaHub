using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

[EnableRateLimiting("PorUsuario")]
[ApiController]
[Route("/api/adm-corrida")]
public class ListarCorridasController : ControllerBase
{
    private readonly RequisicaoCorridaService _requisicaoService;

    public ListarCorridasController(RequisicaoCorridaService requisicaoService)
    {
        _requisicaoService = requisicaoService;
    }

    [HttpGet("listar-solicitacoes-corridas")]
    public async Task<IActionResult> ListarCorridas([FromQuery] int pagina, [FromQuery] int tamanhoPagina)
    {
        var corridas = await _requisicaoService.ListarCorridas(pagina, tamanhoPagina);
        return Ok(corridas);
    }
}   
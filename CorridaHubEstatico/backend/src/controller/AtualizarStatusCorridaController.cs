using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

[ApiController]
[Route("/api/atualizar-corrida")]
public class AtualizarCorridaController : ControllerBase
{
    private readonly RequisicaoCorridaService _requisicaoService;

    public AtualizarCorridaController(RequisicaoCorridaService requisicaoService)
    {
        _requisicaoService = requisicaoService;
    }

    [HttpPut]
    public async Task<IActionResult> AtualizarCorrida([FromBody] RequisicaoCorridaDto dto){
        try{
            var atualizada = await _requisicaoService.AtualizarCorrida(dto);
            return atualizada ? NoContent() : NotFound();
        }catch (Exception){
            return Problem(statusCode: StatusCodes.Status500InternalServerError);
        }
    }
}

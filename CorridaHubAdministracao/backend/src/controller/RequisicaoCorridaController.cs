using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

[EnableRateLimiting("PorUsuario")]
[ApiController]
[Route("/api/adm-corrida")]
public class RequisicaoCorridaController : ControllerBase
{
    private readonly RequisicaoCorridaService _requisicaoService;

    public RequisicaoCorridaController(RequisicaoCorridaService requisicaoService)
    {
        _requisicaoService = requisicaoService;
    }

    [HttpPost("lambda-publicacao-corrida")]
    public async Task<IActionResult> SolicitarCorrida([FromBody] RequisicaoCorridaDto dto)
    {
        
        try{
            await _requisicaoService.RequisicaoCorrida(dto);
            return Created();
        }catch (Exception e){
            Console.WriteLine(e.Message);
        }
        return StatusCode(404);
        
    }
}
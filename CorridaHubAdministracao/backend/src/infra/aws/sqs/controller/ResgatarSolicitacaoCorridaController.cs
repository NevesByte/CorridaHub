using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

[EnableRateLimiting("PorUsuario")]
[ApiController]
[Route("/api/administracao")]
public class ResgatarSolicitacaoCorridaController : ControllerBase
{
    [HttpPost("/lambda-publicacao-corrida")]
    public async Task<IActionResult> SolicitarCorrida([FromBody] RequisicaoCorridaDto dto){
        try{
            
        }catch (Exception e){
            Console.WriteLine(e.Message);
        }
        return StatusCode(404);
    }
}
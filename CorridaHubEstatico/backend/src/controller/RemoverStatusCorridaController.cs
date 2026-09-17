using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

[ApiController]
[Route("/api/remover-corrida")]
public class RemoverCorridaController : ControllerBase
{
    private readonly RequisicaoCorridaService _requisicaoService;

    public RemoverCorridaController(RequisicaoCorridaService requisicaoService)
    {
        _requisicaoService = requisicaoService;
    }

    [HttpDelete]
    public async Task<IActionResult> RemoverCorrida([FromQuery] string uid){
        try{
            var removida = await _requisicaoService.RemoverCorrida(uid);
            return removida ? NoContent() : NotFound();
        }catch (Exception){
            return Problem(statusCode: StatusCodes.Status500InternalServerError);
        }
    }
}

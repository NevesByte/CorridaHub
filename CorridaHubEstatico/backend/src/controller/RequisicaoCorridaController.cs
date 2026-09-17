using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

[EnableRateLimiting("PorUsuario")]
[ApiController]
[Route("/api/solicitacao-corrida")]
public class RequisicaoCorridaController : ControllerBase
{
    private readonly RequisicaoCorridaService _requisicaoService;

    public RequisicaoCorridaController(RequisicaoCorridaService requisicaoService)
    {
        _requisicaoService = requisicaoService;
    }

    [HttpPost]
    public async Task<IActionResult> SolicitarCorrida(
        [FromForm] RequisicaoCorridaDto dto,
        [FromForm] IFormFile? imagem,
        CancellationToken cancellationToken){
        try{
            var corrida = await _requisicaoService.RequisicaoCorrida(dto);
            string? imagemKey = null;

            if (imagem is not null)
            {
                imagemKey = await _requisicaoService.EnviarImagemAsync(
                    corrida.id,
                    imagem,
                    cancellationToken);
                corrida.imagemKey = imagemKey;
                await _requisicaoService.AtualizarRequisicaoAsync(corrida);
            }
            Console.WriteLine("ANTES DO SQS");
            await _requisicaoService.EnviarParaAnaliseAsync(corrida);
            Console.WriteLine("DEPOIS DO SQS");
            return Created($"/api/solicitacao-corrida/{corrida.id}", new { corrida.id, imagemKey });
        }catch (ArgumentException exception){
            return BadRequest(new { erro = exception.Message });
        }catch (Exception){
            return Problem(statusCode: StatusCodes.Status500InternalServerError);
        }
    }

    
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

[ApiController]
[Route("/api/buscar-corridas")]
public class BuscarCorridasController : ControllerBase
{
    private readonly RequisicaoCorridaService _requisicaoService;

    public BuscarCorridasController(
        RequisicaoCorridaService requisicaoService)
    {
        _requisicaoService = requisicaoService;
    }

    [HttpGet]
    public async Task<IActionResult> BuscarCorridas(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var resultado =
                await _requisicaoService.BuscarCorridasPaginadasAsync(
                    page,
                    pageSize,
                    cancellationToken);

            return Ok(resultado);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new
            {
                erro = exception.Message
            });
        }
        catch (Exception)
        {
            return Problem(
                statusCode: StatusCodes.Status500InternalServerError);
        }
    }

}
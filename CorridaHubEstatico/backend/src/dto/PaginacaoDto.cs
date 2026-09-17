public class PaginacaoCorridaDto
{
    public int pagina { get; set; }
    public int tamanhoPagina { get; set; }
    public int totalItens { get; set; }
    public int totalPaginas { get; set; }

    public List<RequisicaoCorridaResponseDto> itens { get; set; } = new();
}
using Microsoft.EntityFrameworkCore;

public interface ICorridaRequisicaoRepository
{
    public Task<RequisicaoCorridaEntity> AdicionarCorrida(RequisicaoCorridaEntity requisicaoCorrida);
    public Task<List<RequisicaoCorridaEntity>> ListarCorridas(int pagina, int tamanhoPagina);
    public Task<RequisicaoCorridaEntity?> BuscarCorrida(string uid);
    public Task RemoverCorridas(string uid);
}

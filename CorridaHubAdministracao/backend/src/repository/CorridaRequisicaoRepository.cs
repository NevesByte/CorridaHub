using Microsoft.EntityFrameworkCore;

public class CorridaRequisicaoRepository : ICorridaRequisicaoRepository
{
    private readonly AppDbContext _context;

    public CorridaRequisicaoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<RequisicaoCorridaEntity> AdicionarCorrida(RequisicaoCorridaEntity requisicaoCorrida)
    {
        _context.RequisicaoCorrida.Add(requisicaoCorrida);
        await _context.SaveChangesAsync();
        return requisicaoCorrida;
    }
    public async Task<List<RequisicaoCorridaEntity>> ListarCorridas(int pagina, int tamanhoPagina){
        return await _context.RequisicaoCorrida
            .OrderBy(x => x.dataEvento)
            .Skip((pagina - 1) * tamanhoPagina)
            .Take(tamanhoPagina)
            .ToListAsync();
    }

    public async Task<RequisicaoCorridaEntity?> BuscarCorrida(string uid)
    {
        return await _context.RequisicaoCorrida.FirstOrDefaultAsync(x => x.id == uid);
    }

    public async Task RemoverCorridas(string uid){
        var corrida = await _context.RequisicaoCorrida.FirstOrDefaultAsync(x => x.id == uid);
        if(corrida == null){
            return;
        }

        _context.RequisicaoCorrida.Remove(corrida);
        await _context.SaveChangesAsync();
    }
}

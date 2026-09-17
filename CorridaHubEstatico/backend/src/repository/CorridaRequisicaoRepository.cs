using Microsoft.EntityFrameworkCore;

public class CorridaRequisicaoRepository : ICorridaRequisicaoRepository
{
    private readonly AppDbContext _context;
    private readonly IS3Service _s3Service;

    public CorridaRequisicaoRepository(AppDbContext context, IS3Service s3Service)
    {
        _context = context;
        _s3Service = s3Service;
    }

    public async Task<RequisicaoCorridaEntity> AdicionarCorrida(RequisicaoCorridaEntity requisicaoCorrida)
    {
        _context.RequisicaoCorrida.Add(requisicaoCorrida);
        await _context.SaveChangesAsync();
        return requisicaoCorrida;
    }

    public Task EnviarArquivoAsync(
        string chaveObjeto,
        Stream conteudo,
        string contentType,
        IReadOnlyDictionary<string, string>? tags = null,
        CancellationToken cancellationToken = default)
    {
        return _s3Service.EnviarArquivoAsync(
            chaveObjeto,
            conteudo,
            contentType,
            tags,
            cancellationToken);
    }

    public async Task<bool> AtualizarCorrida(RequisicaoCorridaEntity requisicaoCorrida)
    {
        var corridaExistente = await _context.RequisicaoCorrida
            .FirstOrDefaultAsync(x => x.id == requisicaoCorrida.id);

        if (corridaExistente is null)
        {
            return false;
        }

        _context.Entry(corridaExistente).CurrentValues.SetValues(requisicaoCorrida);
        await _context.SaveChangesAsync();
        return true;
    }
    public async Task<bool> RemoverCorrida(string uid)
    {
        var corrida = await _context.RequisicaoCorrida.FirstOrDefaultAsync(x => x.id == uid);
        if (corrida is null)
        {
            return false;
        }

        _context.RequisicaoCorrida.Remove(corrida);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<(List<RequisicaoCorridaEntity> Itens, int TotalItens)> BuscarCorridasPaginadasAsync(int pagina,
                                                                                                          int tamanhoPagina,
                                                                                                          CancellationToken cancellationToken = default)
    {
        var query = _context.RequisicaoCorrida
            .AsNoTracking()
            .OrderByDescending(x => x.dataEvento);

        var totalItens = await query.CountAsync(cancellationToken);

        var itens = await query
            .Skip((pagina - 1) * tamanhoPagina)
            .Take(tamanhoPagina)
            .ToListAsync(cancellationToken);

        return (itens, totalItens);
    }
}
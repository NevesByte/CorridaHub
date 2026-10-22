using Microsoft.EntityFrameworkCore;
using MySqlConnector;

public class CorridaRequisicaoRepository : ICorridaRequisicaoRepository
{
    private readonly AppDbContext _context;

    public CorridaRequisicaoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<RequisicaoCorridaEntity> AdicionarCorrida(RequisicaoCorridaEntity requisicaoCorrida)
    {
        var existente = await BuscarCorrida(requisicaoCorrida.id);
        if (existente is not null) return existente;

        _context.RequisicaoCorrida.Add(requisicaoCorrida);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException exception) when (exception.InnerException is MySqlException { Number: 1062 })
        {
            // Outro consumidor pode ter recebido o mesmo ID simultaneamente.
            _context.Entry(requisicaoCorrida).State = EntityState.Detached;
            var concorrente = await BuscarCorrida(requisicaoCorrida.id);
            if (concorrente is null) throw;
            return concorrente;
        }
        return requisicaoCorrida;
    }
    public async Task<List<RequisicaoCorridaEntity>> ListarCorridas(int pagina, int tamanhoPagina){
        return await _context.RequisicaoCorrida
            .Where(x => x.statusAprovacao == StatusAprovacao.Pendente)
            .OrderBy(x => x.dataEvento)
            .Skip((pagina - 1) * tamanhoPagina)
            .Take(tamanhoPagina)
            .ToListAsync();
    }

    public async Task<RequisicaoCorridaEntity?> BuscarCorrida(string uid)
    {
        return await _context.RequisicaoCorrida.FirstOrDefaultAsync(x => x.id == uid);
    }

    public async Task<bool> ProcessarDecisao(string uid, StatusAprovacao status,
        Func<RequisicaoCorridaEntity, Task> executar)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();
        // O bloqueio no MySQL protege inclusive requests em containers diferentes.
        var corridas = await _context.RequisicaoCorrida
            .FromSqlInterpolated($"SELECT * FROM tb_administracao_requisicao_corrida WHERE id = {uid} FOR UPDATE")
            .AsTracking()
            .ToListAsync();
        var corrida = corridas.SingleOrDefault();
        if (corrida is null) return false;

        if (corrida.statusAprovacao != StatusAprovacao.Pendente)
            return corrida.statusAprovacao == status;

        await executar(corrida);
        corrida.statusAprovacao = status;
        corrida.assinatura = AssinaturaSistema.Administracao;
        await _context.SaveChangesAsync();
        await transaction.CommitAsync();
        return true;
    }
}

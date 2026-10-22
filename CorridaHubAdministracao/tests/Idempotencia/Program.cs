using Microsoft.EntityFrameworkCore;

// Execute somente contra um banco descartável; o teste cria suas tabelas.
var connection = Environment.GetEnvironmentVariable("IDEMPOTENCIA_TEST_CONNECTION")
    ?? throw new InvalidOperationException("Informe IDEMPOTENCIA_TEST_CONNECTION para um MySQL descartável.");
var options = new DbContextOptionsBuilder<AppDbContext>()
    .UseMySql(connection, new MySqlServerVersion(new Version(8, 0, 0))).Options;
await using (var db = new AppDbContext(options)) await db.Database.EnsureCreatedAsync();

RequisicaoCorridaEntity Nova(string id) => new()
{
    id = id, emailContato = "teste@example.invalid", telefone = "123",
    nomeAnunciante = "Teste", nomeEvento = "Teste", regiaoItapetininga = "Teste",
    dataEvento = DateTime.UtcNow
};
void Check(bool ok, string message)
{
    if (!ok) throw new Exception(message);
    Console.WriteLine($"PASS: {message}");
}

foreach (var status in new[] { StatusAprovacao.Aprovado, StatusAprovacao.Rejeitado })
{
    var id = Guid.NewGuid().ToString();
    await Task.WhenAll(Enumerable.Range(0, 4).Select(async _ =>
    {
        await using var db = new AppDbContext(options);
        await new CorridaRequisicaoRepository(db).AdicionarCorrida(Nova(id));
    }));
    await using (var db = new AppDbContext(options))
        Check(await db.RequisicaoCorrida.CountAsync(x => x.id == id) == 1, "Recebimentos concorrentes mantêm um registro");

    var effects = 0;
    async Task<bool> Decidir(StatusAprovacao decisao)
    {
        await using var db = new AppDbContext(options);
        return await new CorridaRequisicaoRepository(db).ProcessarDecisao(id, decisao, async _ =>
        {
            Interlocked.Increment(ref effects);
            await Task.Delay(100);
        });
    }
    var resultados = await Task.WhenAll(Enumerable.Range(0, 4).Select(_ => Decidir(status)));
    Check(resultados.All(x => x) && effects == 1, $"{status}: concorrência executa os efeitos uma vez");
    Check(await Decidir(status) && effects == 1, $"{status}: repetição concluída não repete efeitos");
    var oposta = status == StatusAprovacao.Aprovado ? StatusAprovacao.Rejeitado : StatusAprovacao.Aprovado;
    Check(!await Decidir(oposta) && effects == 1, "Decisão oposta não executa efeitos");
    await using (var db = new AppDbContext(options))
    {
        var repo = new CorridaRequisicaoRepository(db);
        await repo.AdicionarCorrida(Nova(id));
        Check((await repo.BuscarCorrida(id))!.statusAprovacao == status, "Reenvio não recria corrida pendente");
        Check(!(await repo.ListarCorridas(1, 100)).Any(x => x.id == id), "Processadas não aparecem nas pendências");
    }
}

var rollbackId = Guid.NewGuid().ToString();
await using (var db = new AppDbContext(options))
    await new CorridaRequisicaoRepository(db).AdicionarCorrida(Nova(rollbackId));
await using (var db = new AppDbContext(options))
{
    try
    {
        await new CorridaRequisicaoRepository(db).ProcessarDecisao(rollbackId, StatusAprovacao.Aprovado,
            _ => throw new InvalidOperationException("Falha simulada antes de efeitos externos"));
        throw new Exception("A falha deveria ter sido propagada");
    }
    catch (InvalidOperationException) { }
}
await using (var db = new AppDbContext(options))
    Check((await db.RequisicaoCorrida.SingleAsync(x => x.id == rollbackId)).statusAprovacao == StatusAprovacao.Pendente,
        "Falha não grava uma decisão concluída");

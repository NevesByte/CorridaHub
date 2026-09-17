public interface ICorridaRequisicaoRepository
{
    Task<RequisicaoCorridaEntity> AdicionarCorrida(
        RequisicaoCorridaEntity requisicaoCorrida);

    Task EnviarArquivoAsync(
        string chaveObjeto,
        Stream conteudo,
        string contentType,
        IReadOnlyDictionary<string, string>? tags = null,
        CancellationToken cancellationToken = default);

    Task<bool> AtualizarCorrida(
        RequisicaoCorridaEntity requisicaoCorrida);

    Task<bool> RemoverCorrida(string uid);

    Task<(List<RequisicaoCorridaEntity> Itens, int TotalItens)>
        BuscarCorridasPaginadasAsync(
            int pagina,
            int tamanhoPagina,
            CancellationToken cancellationToken = default);
}
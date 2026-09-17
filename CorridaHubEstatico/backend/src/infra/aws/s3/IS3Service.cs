public interface IS3Service
{
    Task EnviarArquivoAsync(
        string chaveObjeto,
        Stream conteudo,
        string contentType,
        IReadOnlyDictionary<string, string>? tags = null,
        CancellationToken cancellationToken = default);

    Task AtualizarStatusAsync(
        string chaveObjeto,
        StatusImagemS3 status,
        CancellationToken cancellationToken = default);

    Task<string> GerarUrlImagemAsync(
        string chaveObjeto,
        int minutosValidade = 15,
        CancellationToken cancellationToken = default);
}

public enum StatusImagemS3
{
    Pendente,
    Aprovado,
    Rejeitado
}

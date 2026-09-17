public interface IS3Service
{
    Task AtualizarStatusAsync(string chaveObjeto, StatusImagemS3 status,
        CancellationToken cancellationToken = default);
    Task ExcluirArquivoAsync(string chaveObjeto, CancellationToken cancellationToken = default);
}

public enum StatusImagemS3
{
    Aprovado
}

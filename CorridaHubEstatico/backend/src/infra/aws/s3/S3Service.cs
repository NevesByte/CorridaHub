using Amazon.S3;
using Amazon.S3.Model;

public class S3Service : IS3Service
{
    private readonly IAmazonS3 _s3;
    private readonly string _bucketName;

    public S3Service(IAmazonS3 s3, IConfiguration configuration)
    {
        _s3 = s3;
        _bucketName = configuration["AWS:S3:BucketName"]
            ?? throw new InvalidOperationException("AWS:S3:BucketName não foi configurado.");
    }

    public async Task EnviarArquivoAsync(string chaveObjeto, Stream conteudo, string contentType,
        IReadOnlyDictionary<string, string>? tags = null,
        CancellationToken cancellationToken = default)
    {
        var tagsDoObjeto = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["status"] = StatusImagemS3.Pendente.ToString().ToUpperInvariant()
        };

        if (tags is not null)
            foreach (var tag in tags) tagsDoObjeto[tag.Key] = tag.Value;

        await _s3.PutObjectAsync(new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = chaveObjeto,
            InputStream = conteudo,
            ContentType = contentType,
            AutoCloseStream = false,
            ServerSideEncryptionMethod = ServerSideEncryptionMethod.AES256,
            TagSet = tagsDoObjeto.Select(tag =>
                new Tag { Key = tag.Key, Value = tag.Value }).ToList()
        }, cancellationToken);
    }

    public async Task AtualizarStatusAsync(string chaveObjeto, StatusImagemS3 status,
        CancellationToken cancellationToken = default)
    {
        var resposta = await _s3.GetObjectTaggingAsync(new GetObjectTaggingRequest
        {
            BucketName = _bucketName,
            Key = chaveObjeto
        }, cancellationToken);

        var tags = resposta.Tagging
            .Where(tag => !string.Equals(tag.Key, "status", StringComparison.OrdinalIgnoreCase))
            .ToList();
        tags.Add(new Tag { Key = "status", Value = status.ToString().ToUpperInvariant() });

        await _s3.PutObjectTaggingAsync(new PutObjectTaggingRequest
        {
            BucketName = _bucketName,
            Key = chaveObjeto,
            Tagging = new Tagging { TagSet = tags }
        }, cancellationToken);
    }

    public async Task<string> GerarUrlImagemAsync(string chaveObjeto,
                                                  int minutosValidade = 15,
                                                  CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(chaveObjeto))
            throw new ArgumentException(
                "A chave da imagem é obrigatória.",
                nameof(chaveObjeto));

        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = chaveObjeto,
            Expires = DateTime.UtcNow.AddMinutes(minutosValidade),
            Verb = HttpVerb.GET
        };

        return await _s3.GetPreSignedURLAsync(request);
    }
}

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

    public Task ExcluirArquivoAsync(string chaveObjeto, CancellationToken cancellationToken = default) =>
        _s3.DeleteObjectAsync(new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = chaveObjeto
        }, cancellationToken);
}

using Amazon.SQS;
using Amazon.SQS.Model;
using System.Text.Json;
using System.Text.Json.Serialization;

public class SqsService : ISqsService 
{
    private static readonly JsonSerializerOptions SerializerOptions = new()
    {
        Converters = { new JsonStringEnumConverter() }
    };
    private readonly IAmazonSQS _sqs;
    private readonly string _queueUrl;

    public SqsService(IAmazonSQS sqs, IConfiguration configuration)
    {
        _sqs = sqs;
        _queueUrl = configuration["AWS:Sqs:QueueUrl"]
            ?? throw new InvalidOperationException("AWS:Sqs:QueueUrl não foi configurada.");
    }

    public async Task SendMessageAsync<T>(T message)
    {
        var json = JsonSerializer.Serialize(message, SerializerOptions);
        await _sqs.SendMessageAsync(new SendMessageRequest
        {
            QueueUrl = _queueUrl,
            MessageBody = json
        });
    }

    public async Task<List<T>> ReceiveMessageAsync<T>()
    {
        var response = await _sqs.ReceiveMessageAsync(
            new ReceiveMessageRequest
            {
                QueueUrl = _queueUrl,
                MaxNumberOfMessages = 10,
                WaitTimeSeconds = 20
            });

        return response.Messages
            .Select(x => JsonSerializer.Deserialize<T>(x.Body, SerializerOptions)!)
            .ToList();
    }
}

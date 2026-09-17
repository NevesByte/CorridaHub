public interface ISqsService
{
    Task SendMessageAsync<T>(T message);
    Task<List<T>> ReceiveMessageAsync<T>();
}
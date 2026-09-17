using Amazon.Lambda.Core;
using Amazon.Lambda.SQSEvents;
using System.Text;
using System.Text.Json;

[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace CorridaHubLambda;

public class Function
{
    private static readonly HttpClient HttpClient = new();

    public async Task FunctionHandler(
        SQSEvent sqsEvent,
        ILambdaContext context)
    {
        foreach (var record in sqsEvent.Records)
        {
            using var json = JsonDocument.Parse(record.Body);
            var raiz = json.RootElement;

            var assinatura = raiz.GetProperty("assinatura").GetString();
            var status = raiz.GetProperty("statusAprovacao").GetString();
            var id = raiz.GetProperty("id").GetString();

            HttpMethod metodo;
            string url;

            if (assinatura == "PainelCorridaHub")
            {
                metodo = HttpMethod.Post;

                url =
                    $"{Environment.GetEnvironmentVariable("ADMIN_API_BASE_URL")}" +
                    "/api/adm-corrida/lambda-publicacao-corrida";
            }
            else if (assinatura == "Administracao" && status == "Aprovado")
            {
                metodo = HttpMethod.Put;

                url =
                    $"{Environment.GetEnvironmentVariable("PUBLIC_API_BASE_URL")}" +
                    "/api/atualizar-corrida";
            }
            else if (assinatura == "Administracao" && status == "Rejeitado")
            {
                metodo = HttpMethod.Delete;

                url =
                    $"{Environment.GetEnvironmentVariable("PUBLIC_API_BASE_URL")}" +
                    $"/api/remover-corrida?uid={Uri.EscapeDataString(id!)}";
            }
            else
            {
                throw new InvalidOperationException(
                    "Assinatura ou status inválido.");
            }

            using var request = new HttpRequestMessage(metodo, url);

            if (metodo != HttpMethod.Delete)
            {
                request.Content = new StringContent(
                    record.Body,
                    Encoding.UTF8,
                    "application/json");
            }

            using var response = await HttpClient.SendAsync(request);

            response.EnsureSuccessStatusCode();

            context.Logger.LogInformation(
                $"Mensagem {record.MessageId} encaminhada.");
        }
    }
}
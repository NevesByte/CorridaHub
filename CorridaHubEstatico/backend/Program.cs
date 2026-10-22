using Amazon;
using Amazon.S3;
using Amazon.SQS;
using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// =====================================================
// CONFIGURAÇÕES
// =====================================================

builder.Configuration.AddEnvironmentVariables();


// =====================================================
// AWS REGION
// =====================================================

var awsRegion =
    builder.Configuration["AWS:Region"]
    ?? "us-east-1";

var regionEndpoint =
    RegionEndpoint.GetBySystemName(awsRegion);


// =====================================================
// CONNECTION STRING
// =====================================================

var dbConnectionString =
    builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(dbConnectionString))
{
    var secretsClient =
        new AmazonSecretsManagerClient(regionEndpoint);

    var secretResponse =
        await secretsClient.GetSecretValueAsync(
            new GetSecretValueRequest
            {
                SecretId = "corrida-hub/prod"
            }
        );

    if (string.IsNullOrWhiteSpace(secretResponse.SecretString))
    {
        throw new InvalidOperationException(
            "O Secret 'corrida-hub/prod' não possui SecretString."
        );
    }

    using var secretDocument =
        JsonDocument.Parse(secretResponse.SecretString);

    var secretRoot = secretDocument.RootElement;
    JsonElement connectionProperty = default;

    var hasConnectionProperty =
        secretRoot.ValueKind == JsonValueKind.Object
        && secretRoot.TryGetProperty(
            "ConnectionStrings__DefaultConnection",
            out connectionProperty
        );

    if (!hasConnectionProperty
        && secretRoot.ValueKind == JsonValueKind.Object
        && secretRoot.TryGetProperty("ConnectionStrings", out var connectionStrings)
        && connectionStrings.ValueKind == JsonValueKind.Object)
    {
        hasConnectionProperty =
            connectionStrings.TryGetProperty(
                "DefaultConnection",
                out connectionProperty
            );
    }

    dbConnectionString =
        hasConnectionProperty
        && connectionProperty.ValueKind == JsonValueKind.String
            ? connectionProperty.GetString()
            : null;

    if (string.IsNullOrWhiteSpace(dbConnectionString))
    {
        throw new InvalidOperationException(
            "A ConnectionString 'DefaultConnection' não foi encontrada na configuração nem no Secret 'corrida-hub/prod'."
        );
    }

    builder.Configuration["ConnectionStrings:DefaultConnection"] =
        dbConnectionString;
}


// =====================================================
// AWS SQS
// =====================================================

builder.Services.AddSingleton<IAmazonSQS>(
    new AmazonSQSClient(
        new AmazonSQSConfig
        {
            RegionEndpoint = regionEndpoint
        }
    )
);


// =====================================================
// AWS S3
// =====================================================

builder.Services.AddSingleton<IAmazonS3>(
    new AmazonS3Client(
        new AmazonS3Config
        {
            RegionEndpoint = regionEndpoint
        }
    )
);


// =====================================================
// SERVIÇOS AWS
// =====================================================

builder.Services.AddScoped<ISqsService, SqsService>();

builder.Services.AddScoped<IS3Service, S3Service>();


// =====================================================
// OPEN API
// =====================================================

builder.Services.AddOpenApi();


// =====================================================
// CONTROLLERS
// =====================================================

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter()
        )
    );


// =====================================================
// AUTOMAPPER
// =====================================================

builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<RequisicaoCorridaProfile>();
});


// =====================================================
// BANCO DE DADOS
// =====================================================

var connectionString =
    builder.Configuration.GetConnectionString(
        "DefaultConnection"
    );

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "A ConnectionString 'DefaultConnection' não foi encontrada."
    );
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        connectionString,
        new MySqlServerVersion(
            new Version(8, 0, 0)
        )
    )
);


// =====================================================
// CORS
// =====================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


// =====================================================
// SERVIÇO DE CORRIDAS
// =====================================================

builder.Services.AddScoped<RequisicaoCorridaService>();


// =====================================================
// REPOSITÓRIO
// =====================================================

builder.Services.AddScoped<
    ICorridaRequisicaoRepository,
    CorridaRequisicaoRepository
>();


// =====================================================
// RATE LIMITER
// =====================================================

builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter(
        "PorUsuario",
        limiterOptions =>
        {
            limiterOptions.PermitLimit = 10;

            limiterOptions.Window =
                TimeSpan.FromMinutes(1);

            limiterOptions.QueueLimit = 0;
        }
    );
});


// =====================================================
// BUILD
// =====================================================

var app = builder.Build();


// =====================================================
// OPEN API — SOMENTE DEVELOPMENT
// =====================================================

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


// =====================================================
// CORS
// =====================================================

app.UseCors("Frontend");


// =====================================================
// RATE LIMITER
// =====================================================

app.UseRateLimiter();


// =====================================================
// CONTROLLERS
// =====================================================

app.MapControllers();


// =====================================================
// EXECUÇÃO
// =====================================================

app.Run();
using Amazon;
using Amazon.S3;
using Amazon.SQS;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IAmazonSQS>(
    new AmazonSQSClient(
        new AmazonSQSConfig
        {
            RegionEndpoint = RegionEndpoint.GetBySystemName(
                builder.Configuration["AWS:Region"] ?? "us-east-1")
        }
    )
);

builder.Services.AddSingleton<IAmazonS3>(
    new AmazonS3Client(
        new AmazonS3Config
        {
            RegionEndpoint = RegionEndpoint.GetBySystemName(
                builder.Configuration["AWS:Region"] ?? "us-east-1")
        }
    )
);

builder.Services.AddScoped<ISqsService, SqsService>();
builder.Services.AddScoped<IS3Service, S3Service>();

builder.Services.AddOpenApi();

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter()
        )
    );

builder.Services.AddAutoMapper(cfg =>
{
    cfg.AddProfile<RequisicaoCorridaProfile>();
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 0))
    )
);

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

builder.Services.AddScoped<RequisicaoCorridaService>();

builder.Services.AddScoped<
    ICorridaRequisicaoRepository,
    CorridaRequisicaoRepository
>();

builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("PorUsuario", limiterOptions =>
    {
        limiterOptions.PermitLimit = 10;
        limiterOptions.Window = TimeSpan.FromMinutes(1);
        limiterOptions.QueueLimit = 0;
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("Frontend");

app.UseRateLimiter();

app.MapControllers();

app.Run();
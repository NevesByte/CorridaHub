# =====================================================
# STAGE 1 — BUILD
# =====================================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

# Copia o projeto
COPY backend.csproj ./

# Restaura os pacotes NuGet
RUN dotnet restore "backend.csproj"

# Copia o restante do backend
COPY . .

# Publica a aplicação
RUN dotnet publish "backend.csproj" \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false


# =====================================================
# STAGE 2 — RUNTIME
# =====================================================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final

WORKDIR /app

# Copia somente a aplicação publicada
COPY --from=build /app/publish .

# Porta da API
EXPOSE 8080

# ASP.NET Core escuta na porta 8080
ENV ASPNETCORE_HTTP_PORTS=8080

# Inicia o Backend
ENTRYPOINT ["dotnet", "backend.dll"]

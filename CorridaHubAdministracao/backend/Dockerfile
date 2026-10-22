# =====================================================
# STAGE 1 — BUILD
# =====================================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src

# Copia o projeto
COPY backend.csproj ./

# Restaura as dependências
RUN dotnet restore "backend.csproj"

# Copia o restante do código
COPY . .

# Compila em Release
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

# Porta HTTP da aplicação
EXPOSE 9090

# ASP.NET Core escutará na porta 8080
ENV ASPNETCORE_HTTP_PORTS=9090

# Inicializa a API
ENTRYPOINT ["dotnet", "backend.dll"]

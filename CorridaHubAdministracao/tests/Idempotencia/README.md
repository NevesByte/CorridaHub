Teste de integração de idempotência
=================================

Use somente um banco MySQL descartável. O teste cria tabelas e registros;
não use a connection string de produção.

```powershell
docker run -d --rm --name corridahub-idempotencia-test -p 127.0.0.1:33316:3306 -e MYSQL_ROOT_PASSWORD=local-test-only -e MYSQL_DATABASE=corridahub_idempotencia mysql:8.0
$env:IDEMPOTENCIA_TEST_CONNECTION = 'Server=127.0.0.1;Port=33316;Database=corridahub_idempotencia;User=root;Password=local-test-only'
dotnet run --project CorridaHubAdministracao/tests/Idempotencia/Idempotencia.csproj
docker stop corridahub-idempotencia-test
```

Cobertura: recebimento concorrente, decisões concorrentes de aprovação e rejeição,
repetição de decisões concluídas, decisão oposta, reenvio após decisão, listagem
somente de pendências e rollback de uma falha anterior aos efeitos externos.

As corridas processadas ficam na tabela administrativa com seu status final.
Não há alteração de schema. IDs removidos antes desta mudança não têm histórico
para deduplicação retroativa.

Limite: a transação MySQL não engloba S3, SQS ou SMTP. Uma interrupção depois de
um efeito externo e antes do commit pode repeti-lo numa tentativa posterior.
Garantia de entrega exatamente uma vez entre esses serviços requer outbox e
deduplicação nos consumidores; este teste não simula nem garante essa condição.

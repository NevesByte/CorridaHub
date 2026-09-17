using AutoMapper;
public class RequisicaoCorridaService
{    
    private const long TamanhoMaximoImagemEmBytes = 10 * 1024 * 1024;
    private static readonly HashSet<string> ContentTypesImagemPermitidos = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg",
        "image/png",
        "image/webp"
    };

    private readonly IMapper _mapper;
    private readonly ICorridaRequisicaoRepository _corridaRequisicaoRepository;
    private readonly ISqsService _sqsService;
    private readonly IS3Service _s3Service;

    public RequisicaoCorridaService(IMapper mapper,
                                    ICorridaRequisicaoRepository corridaRequisicaoRepository,
                                    ISqsService sqsService,
                                    IS3Service s3Service){
        _mapper = mapper;
        _corridaRequisicaoRepository = corridaRequisicaoRepository;
        _sqsService = sqsService;
        _corridaRequisicaoRepository = corridaRequisicaoRepository;
        _s3Service = s3Service;
    }

    public async Task<RequisicaoCorridaEntity> RequisicaoCorrida(RequisicaoCorridaDto dto){
        dto.id = Guid.NewGuid().ToString();
        dto.statusAprovacao = StatusAprovacao.Pendente;
        dto.assinatura = AssinaturaSistema.PainelCorridaHub;
        var requisicaoCorrida = _mapper.Map<RequisicaoCorridaEntity>(dto);
        await _corridaRequisicaoRepository.AdicionarCorrida(requisicaoCorrida);
        return requisicaoCorrida;
    }

    public Task EnviarParaAnaliseAsync(RequisicaoCorridaEntity requisicaoCorrida) =>
        _sqsService.SendMessageAsync(requisicaoCorrida);

    public Task<bool> AtualizarRequisicaoAsync(RequisicaoCorridaEntity requisicaoCorrida) =>
        _corridaRequisicaoRepository.AtualizarCorrida(requisicaoCorrida);

    public async Task<string> EnviarImagemAsync(
        string corridaId,
        IFormFile imagem,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(corridaId))
            throw new ArgumentException("O identificador da corrida é obrigatório.", nameof(corridaId));

        if (imagem is null || imagem.Length == 0)
            throw new ArgumentException("Uma imagem válida deve ser enviada.", nameof(imagem));

        if (imagem.Length > TamanhoMaximoImagemEmBytes)
            throw new ArgumentException("A imagem deve ter no máximo 10 MB.", nameof(imagem));

        if (!ContentTypesImagemPermitidos.Contains(imagem.ContentType))
            throw new ArgumentException("São aceitas somente imagens JPEG, PNG ou WebP.", nameof(imagem));

        var extensao = Path.GetExtension(imagem.FileName).ToLowerInvariant();
        if (extensao is not ".jpg" and not ".jpeg" and not ".png" and not ".webp")
            throw new ArgumentException("A extensão da imagem é inválida.", nameof(imagem));

        var chaveObjeto = $"corridas/{corridaId}/imagem{extensao}";
        await using var conteudo = imagem.OpenReadStream();

        try{
            await _corridaRequisicaoRepository.EnviarArquivoAsync(
                chaveObjeto,
                conteudo,
                imagem.ContentType,
                new Dictionary<string, string>
                {
                    ["corridaId"] = corridaId,
                    ["origem"] = "CorridaHub"
                },
                cancellationToken);
        }
        catch (Exception exception)
        {
            Console.WriteLine("ERRO:");
            Console.WriteLine(exception);

            throw;
        }
        

        return chaveObjeto;
    }

    public async Task<PaginacaoCorridaDto> BuscarCorridasPaginadasAsync(int pagina,
                                                                        int tamanhoPagina,
                                                                        CancellationToken cancellationToken = default)
    {
        if (pagina < 1)
            throw new ArgumentException(
                "A página deve ser maior ou igual a 1.");

        if (tamanhoPagina < 1 || tamanhoPagina > 100)
            throw new ArgumentException(
                "O tamanho da página deve estar entre 1 e 100.");

        var resultado =
            await _corridaRequisicaoRepository.BuscarCorridasPaginadasAsync(
                pagina,
                tamanhoPagina,
                cancellationToken);

        var totalPaginas = (int)Math.Ceiling(
            resultado.TotalItens / (double)tamanhoPagina);

        var itens = new List<RequisicaoCorridaResponseDto>();

        foreach (var corrida in resultado.Itens)
        {
            string? imagemUrl = null;

            if (!string.IsNullOrWhiteSpace(corrida.imagemKey))
            {
                imagemUrl = await _s3Service.GerarUrlImagemAsync(
                    corrida.imagemKey,
                    15,
                    cancellationToken);
            }

            itens.Add(new RequisicaoCorridaResponseDto
            {
                id = corrida.id,
                imagemKey = corrida.imagemKey,
                imagemUrl = imagemUrl,

                emailContato = corrida.emailContato,
                statusAprovacao = corrida.statusAprovacao,
                assinatura = corrida.assinatura,

                telefone = corrida.telefone,
                nomeAnunciante = corrida.nomeAnunciante,
                nomeEvento = corrida.nomeEvento,
                regiaoItapetininga = corrida.regiaoItapetininga,

                dataEvento = corrida.dataEvento,

                tipoCorrida = corrida.tipoCorrida,
                categoriaCorredores = corrida.categoriaCorredores,
                premiacao = corrida.premiacao
            });
        }

        return new PaginacaoCorridaDto
        {
            pagina = pagina,
            tamanhoPagina = tamanhoPagina,
            totalItens = resultado.TotalItens,
            totalPaginas = totalPaginas,
            itens = itens
        };
    }

    public async Task<bool> RemoverCorrida(string uid){
        return await _corridaRequisicaoRepository.RemoverCorrida(uid);
    }

    public async Task<bool> AtualizarCorrida(RequisicaoCorridaDto dto){
        var requisicaoCorrida = _mapper.Map<RequisicaoCorridaEntity>(dto);
        return await _corridaRequisicaoRepository.AtualizarCorrida(requisicaoCorrida);
    } 
}   

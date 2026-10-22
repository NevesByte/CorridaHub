using AutoMapper;

public class RequisicaoCorridaService
{
    private readonly IMapper _mapper;
    private readonly ICorridaRequisicaoRepository _corridaRequisicaoRepository;
    private readonly ISqsService _sqsService;
    private readonly IS3Service _s3Service;
    private readonly IEmailService _emailService;

    public RequisicaoCorridaService(IMapper mapper, ICorridaRequisicaoRepository corridaRequisicaoRepository,
        ISqsService sqsService, IS3Service s3Service, IEmailService emailService)
    {
        _mapper = mapper;
        _corridaRequisicaoRepository = corridaRequisicaoRepository;
        _sqsService = sqsService;
        _s3Service = s3Service;
        _emailService = emailService;
    }

    public async Task RequisicaoCorrida(RequisicaoCorridaDto dto)
    {
        if (!Guid.TryParse(dto.id, out _))
            throw new ArgumentException("O ID original da corrida deve ser um UUID válido.");

        var requisicao = _mapper.Map<RequisicaoCorridaEntity>(dto);
        requisicao.statusAprovacao = StatusAprovacao.Pendente;
        requisicao.assinatura = AssinaturaSistema.PainelCorridaHub;
        await _corridaRequisicaoRepository.AdicionarCorrida(requisicao);
    }

    public async Task<List<RequisicaoCorridaResponseDto>> ListarCorridas(int pagina, int tamanhoPagina)
    {
        var corridas = await _corridaRequisicaoRepository.ListarCorridas(pagina, tamanhoPagina);
        var resposta = new List<RequisicaoCorridaResponseDto>();
        foreach (var corrida in corridas)
        {
            var dto = _mapper.Map<RequisicaoCorridaResponseDto>(corrida);
            if (!string.IsNullOrWhiteSpace(corrida.imagemKey))
                dto.imagemUrl = await _s3Service.GerarUrlImagemAsync(corrida.imagemKey);
            resposta.Add(dto);
        }
        return resposta;
    }

    public Task<bool> RemoverCorridas(string uid) => ProcessarDecisao(
        uid, StatusAprovacao.Rejeitado, "Corrida não cadastrada",
        "Sua corrida não foi cadastrada. Sua corrida não demonstrou ser confiável.");

    public Task<bool> AceitarCorridas(string uid) => ProcessarDecisao(
        uid, StatusAprovacao.Aprovado, "Corrida cadastrada",
        "Sua corrida foi cadastrada. Consulte a corrida no Hub de Corridas!");

    private Task<bool> ProcessarDecisao(string uid, StatusAprovacao status,
        string assunto, string mensagem)
    {
        return _corridaRequisicaoRepository.ProcessarDecisao(uid, status, async requisicao =>
        {
            requisicao.statusAprovacao = status;
            requisicao.assinatura = AssinaturaSistema.Administracao;

            if (!string.IsNullOrWhiteSpace(requisicao.imagemKey))
            {
                if (status == StatusAprovacao.Aprovado)
                {
                    await _s3Service.AtualizarStatusAsync(requisicao.imagemKey, StatusImagemS3.Aprovado);
                }
                else if (status == StatusAprovacao.Rejeitado)
                {
                    await _s3Service.ExcluirArquivoAsync(requisicao.imagemKey);
                }
            }

            // Preserva o id recebido do portal para atualizar/remover a mesma corrida.
            await _sqsService.SendMessageAsync(requisicao);
            await _emailService.EnviarEmailAsync(requisicao.emailContato, assunto, mensagem);
        });
    }
}

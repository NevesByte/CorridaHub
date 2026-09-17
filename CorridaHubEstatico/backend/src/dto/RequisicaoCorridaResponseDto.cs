public class RequisicaoCorridaResponseDto
{
    public string id { get; set; } = string.Empty;
    public string? imagemKey { get; set; }
    public string? imagemUrl { get; set; }

    public string emailContato { get; set; }
    public StatusAprovacao statusAprovacao { get; set; }
    public AssinaturaSistema assinatura { get; set; }

    public string telefone { get; set; }
    public string nomeAnunciante { get; set; }
    public string nomeEvento { get; set; }
    public string regiaoItapetininga { get; set; }

    public DateTime dataEvento { get; set; }

    public TipoCorrida tipoCorrida { get; set; }
    public CategoriaCorredores categoriaCorredores { get; set; }
    public Premiacao premiacao { get; set; }
}
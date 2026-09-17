using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("tb_requisicao_corrida")]
public class RequisicaoCorridaEntity
{
    [Key]
    [Column("id")]
    [MaxLength(36)]
    public string id { get; set; } = Guid.NewGuid().ToString();

    [Column("imagem_key")]
    [MaxLength(512)]
    public string? imagemKey { get; set; }

    [Column("status_aprovacao")]
    [EnumDataType(typeof(StatusAprovacao))]
    public StatusAprovacao statusAprovacao {get; set;} = StatusAprovacao.Pendente;

    [Column("assinatura")]
    [EnumDataType(typeof(AssinaturaSistema))]
    public AssinaturaSistema assinatura { get; set; } = AssinaturaSistema.PainelCorridaHub;

    [Column("email_contato")]
    [MaxLength(255)]
    public string emailContato { get; set; }

    [Column("telefone")]
    [MaxLength(20)]
    public string telefone { get; set; }

    [Column("nome_anunciante")]
    [MaxLength(255)]
    public string nomeAnunciante { get; set; }

    [Column("nome_evento")]
    [MaxLength(255)]
    public string nomeEvento { get; set; }

    [Column("regiao_itapetininga")]
    [MaxLength(255)]
    public string regiaoItapetininga { get; set; }

    [Column("data_evento")]
    public DateTime dataEvento { get; set; }

    [Column("tipo_corrida")]
    [EnumDataType(typeof(TipoCorrida))]
    public TipoCorrida tipoCorrida { get; set; }

    [Column("categoria_corredores")]
    [EnumDataType(typeof(CategoriaCorredores))]
    public CategoriaCorredores categoriaCorredores { get; set; }

    [Column("premiacao")]
    [EnumDataType(typeof(Premiacao))]
    public Premiacao premiacao { get; set; }
}

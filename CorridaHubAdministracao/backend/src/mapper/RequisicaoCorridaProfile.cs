using AutoMapper;
public class RequisicaoCorridaProfile : Profile
{
   public RequisicaoCorridaProfile(){
        CreateMap<RequisicaoCorridaEntity, RequisicaoCorridaDto>();
        CreateMap<RequisicaoCorridaEntity, RequisicaoCorridaResponseDto>()
            .ForMember(x => x.imagemUrl, options => options.Ignore());
        CreateMap<RequisicaoCorridaDto, RequisicaoCorridaEntity>();
   }
}

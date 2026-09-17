using AutoMapper;
public class RequisicaoCorridaProfile : Profile
{
   public RequisicaoCorridaProfile(){
        CreateMap<RequisicaoCorridaEntity, RequisicaoCorridaDto>();
        CreateMap<RequisicaoCorridaDto, RequisicaoCorridaEntity>();
   }
}
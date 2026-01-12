using AutoMapper;
using KuyumHesapWeb.Core.Feature.AccountFeature.Command.Update;
using KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetById;
using KuyumHesapWeb.Core.Feature.StockTypeFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.StockTypeFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.StockTypeFeature.Queries.GetById;

namespace KuyumHesapWeb.Core.Commond.Abstract.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<GetByIdAccountQueryResponse, UpdateAccountCommandRequest>().ReverseMap();
            CreateMap<CreateStockTypeCommandRequest, UpdateStockTypeCommandRequest>().ReverseMap();
            CreateMap<GetByIdStockTypeQueryResponse, UpdateStockTypeCommandRequest>()
    .ForMember(d => d.StockGroupId, o => o.MapFrom(s => s.StockGroup.Id))
    .ForMember(d => d.CurrencyId, o => o.MapFrom(s => s.Currency.Id));

        }
    }
}

using AutoMapper;
using KuyumHesapWeb.Core.Feature.MovementTypeFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.MovementTypeFeature.Queries.GetById;
using KuyumHesapWeb.Core.Feature.ProductTypeFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.ProductTypeFeature.Queries.GetById;
using KuyumHesapWeb.Core.Feature.StockFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.StockFeature.Queries.GetById;
using KuyumHesapWeb.Core.Feature.StockGroupFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.StockGroupFeature.Queries.GetById;
using KuyumHesapWeb.Core.Feature.UserFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.UserFeature.Queries.GetById;

namespace KuyumHesapWeb.Core.Commond.Concrete.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<GetByIdStockGroupQueryResponse, UpdateStockGroupCommandRequest>().ReverseMap();
            CreateMap<GetByIdStockQueryResponse, UpdateStockCommandRequest>().ReverseMap();

            CreateMap<GetByIdProductTypeQueryResponse, UpdateProductTypeCommandRequest>().ReverseMap();

            CreateMap<UpdateUserCommandRequest, GetByIdUserQueryResponse>().ReverseMap();
            CreateMap<UpdateMovementTypeCommandRequest, GetByIdMovementTypeQueryResponse>().ReverseMap();
        }
    }
}

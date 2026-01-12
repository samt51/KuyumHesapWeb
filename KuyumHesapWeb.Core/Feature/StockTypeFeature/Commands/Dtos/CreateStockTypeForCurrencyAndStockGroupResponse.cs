using KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.StockGroupFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.StockTypeFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.StockTypeFeature.Queries.GetById;

namespace KuyumHesapWeb.Core.Feature.StockTypeFeature.Commands.Dtos
{
    public class CreateStockTypeForCurrencyAndStockGroupResponse
    {
        public CreateStockTypeCommandRequest createStockTypeCommandRequest { get; set; }
        public List<GetAllCurrencyQueryResponse> getAllCurrencyQueryResponses { get; set; }
        public List<GetAllStockGroupQueryResponse> getAllStockGroupQueryResponses { get; set; }
        public GetByIdStockTypeQueryResponse  GetByIdStockTypeQueryResponse{ get; set; }
    }
}

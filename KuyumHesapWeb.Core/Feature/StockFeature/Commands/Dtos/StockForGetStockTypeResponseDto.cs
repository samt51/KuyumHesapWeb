using KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.StockFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.StockFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.StockTypeFeature.Queries.GetAll;

namespace KuyumHesapWeb.Core.Feature.StockFeature.Commands.Dtos
{
    public class StockForGetStockTypeResponseDto
    {
        public List<GetAllStockTypeQueryResponse> getAllStockTypeQueryResponses { get; set; }
        public CreateStockCommandRequest CreateStockCommandRequest { get; set; }
        public UpdateStockCommandRequest UpdateStockCommandRequest { get; set; }
        public List<GetAllCurrencyQueryResponse> CurrencyQueryResponses{ get; set; }
    }
}

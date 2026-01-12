using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockFeature.Queries.GetStockByTypeId
{
    public class GetStockByTypeIdQueryRequest : IRequest<ResponseDto<List<GetStockByTypeIdQueryResponse>>>  
    {
        public int StockTypeId { get; set; }
        public GetStockByTypeIdQueryRequest(int stockTypeId)
        {
            this.StockTypeId = stockTypeId;
        }
    }
}

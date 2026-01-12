using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockTypeFeature.Queries.GetAll
{
    public class GetAllStockTypeQueryRequest : IRequest<ResponseDto<List<GetAllStockTypeQueryResponse>>>
    {
    }
}

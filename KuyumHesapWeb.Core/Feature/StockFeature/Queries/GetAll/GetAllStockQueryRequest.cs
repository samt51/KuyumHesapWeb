using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockFeature.Queries.GetAll
{
    public class GetAllStockQueryRequest : IRequest<ResponseDto<List<GetAllStockQueryResponse>>>
    {
    }
}

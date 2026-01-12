using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockGroupFeature.Queries.GetAll
{
    public class GetAllStockGroupQueryRequest : IRequest<ResponseDto<List<GetAllStockGroupQueryResponse>>>  
    {
    }
}

using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockTypeFeature.Queries.GetById
{
    public class GetByIdStockTypeQueryRequest : IRequest<ResponseDto<GetByIdStockTypeQueryResponse>>
    {
        public int Id { get; set; }
        public GetByIdStockTypeQueryRequest(int id)
        {
            this.Id = id;
        }
    }
}

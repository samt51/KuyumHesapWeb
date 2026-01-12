using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockFeature.Queries.GetById
{
    public class GetByIdStockQueryRequest : IRequest<ResponseDto<GetByIdStockQueryResponse>>
    {
        public int Id { get; set; }
        public GetByIdStockQueryRequest(int id)
        {
            this.Id = id;
        }
    }
}

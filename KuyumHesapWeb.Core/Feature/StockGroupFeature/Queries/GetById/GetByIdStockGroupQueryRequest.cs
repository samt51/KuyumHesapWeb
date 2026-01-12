using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockGroupFeature.Queries.GetById
{
    public class GetByIdStockGroupQueryRequest : IRequest<ResponseDto<GetByIdStockGroupQueryResponse>>
    {
        public int Id { get; set; }
        public GetByIdStockGroupQueryRequest(int id)
        {
            this.Id = id;
        }
    }
}

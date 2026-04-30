
using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.StockFeature.Queries.GetAll;
using MediatR;

namespace KuyumHesapWeb.Core.Features.StockFeature.Queries.GetByGroupId
{
    public class GetStockByGroupIdQueryRequest : IRequest<ResponseDto<List<GetAllStockQueryResponse>>>
    {
        public int GroupId { get; set; }
        public GetStockByGroupIdQueryRequest(int groupId)
        {
            GroupId = groupId;
        }
    }
}

using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockTypeFeature.Queries.GetStockTypeByIdGroupId
{
    public class GetStockTypeByIdGroupIdQueryRequest : IRequest<ResponseDto<List<GetStockTypeByIdGroupIdQueryResponse>>>
    {
        public int StokGrupID { get; set; }
        public GetStockTypeByIdGroupIdQueryRequest(int stokGrupId)
        {
            this.StokGrupID = stokGrupId;
        }
    }
}

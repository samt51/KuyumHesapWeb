using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockFeature.Queries.GetStockByTypeId
{
    public class GetStockByTypeIdQueryHandler : BaseHandler, IRequestHandler<GetStockByTypeIdQueryRequest, ResponseDto<List<GetStockByTypeIdQueryResponse>>>
    {
        public GetStockByTypeIdQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetStockByTypeIdQueryResponse>>> Handle(GetStockByTypeIdQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetStockByTypeIdQueryResponse>>($"Barcode/GetStock?stokTipID={request.StockTypeId}");
            return new ResponseDto<List<GetStockByTypeIdQueryResponse>>().Success(data.data);
        }
    }
}

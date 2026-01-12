using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockTypeFeature.Queries.GetAll
{
    public class GetAllStockTypeQueryHandler : BaseHandler, IRequestHandler<GetAllStockTypeQueryRequest, ResponseDto<List<GetAllStockTypeQueryResponse>>>
    {
        public GetAllStockTypeQueryHandler(IApiService apiService) : base(apiService)
        {
        }
        public async Task<ResponseDto<List<GetAllStockTypeQueryResponse>>> Handle(GetAllStockTypeQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetAllStockTypeQueryResponse>>("StockType/GetAll");

            return new ResponseDto<List<GetAllStockTypeQueryResponse>>().Success(data.data);
        }
    }
}

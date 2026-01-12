using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockFeature.Queries.GetAll
{
    public class GetAllStockQueryHandler : BaseHandler, IRequestHandler<GetAllStockQueryRequest, ResponseDto<List<GetAllStockQueryResponse>>>
    {
        public GetAllStockQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetAllStockQueryResponse>>> Handle(GetAllStockQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetAllStockQueryResponse>>("Stock/GetAll");

            return new ResponseDto<List<GetAllStockQueryResponse>>().Success(data.data);
        }
    }
}

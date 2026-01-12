using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockGroupFeature.Queries.GetAll
{
    public class GetAllStockGroupQueryHandler : BaseHandler, IRequestHandler<GetAllStockGroupQueryRequest, ResponseDto<List<GetAllStockGroupQueryResponse>>>
    {
        public GetAllStockGroupQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetAllStockGroupQueryResponse>>> Handle(GetAllStockGroupQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetAllStockGroupQueryResponse>>("StockGroup/GetAll");

            return new ResponseDto<List<GetAllStockGroupQueryResponse>>().Success(data.data);
        }
    }
}

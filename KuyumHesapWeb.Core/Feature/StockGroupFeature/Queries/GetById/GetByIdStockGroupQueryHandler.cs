using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockGroupFeature.Queries.GetById
{
    public class GetByIdStockGroupQueryHandler : BaseHandler, IRequestHandler<GetByIdStockGroupQueryRequest, ResponseDto<GetByIdStockGroupQueryResponse>>
    {
        public GetByIdStockGroupQueryHandler(IApiService apiService) : base(apiService)
        {
        }
        public async Task<ResponseDto<GetByIdStockGroupQueryResponse>> Handle(GetByIdStockGroupQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<GetByIdStockGroupQueryResponse>($"StockGroup/GetById/{request.Id}");

            return new ResponseDto<GetByIdStockGroupQueryResponse>().Success(data.data);
        }
    }
}

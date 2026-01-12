using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockFeature.Queries.GetById
{
    public class GetByIdStockQueryHandler : BaseHandler, IRequestHandler<GetByIdStockQueryRequest, ResponseDto<GetByIdStockQueryResponse>>
    {
        public GetByIdStockQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<GetByIdStockQueryResponse>> Handle(GetByIdStockQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<GetByIdStockQueryResponse>($"Stock/GetById/{request.Id}");

            return new ResponseDto<GetByIdStockQueryResponse>().Success(data.data);
        }
    }
}

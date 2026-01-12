using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockTypeFeature.Queries.GetById
{
    public class GetByIdStockTypeQueryHandler : BaseHandler, IRequestHandler<GetByIdStockTypeQueryRequest, ResponseDto<GetByIdStockTypeQueryResponse>>
    {
        public GetByIdStockTypeQueryHandler(IApiService apiService) : base(apiService)
        {

        }
        public async Task<ResponseDto<GetByIdStockTypeQueryResponse>> Handle(GetByIdStockTypeQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<GetByIdStockTypeQueryResponse>($"StockType/GetById/{request.Id}");

            return new ResponseDto<GetByIdStockTypeQueryResponse>().Success(data.data);
        }
    }
}

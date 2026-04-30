

using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.StockFeature.Queries.GetAll;
using MediatR;

namespace KuyumHesapWeb.Core.Features.StockFeature.Queries.GetByGroupId
{
    public class GetStockByGroupIdQueryHandler : BaseHandler, IRequestHandler<GetStockByGroupIdQueryRequest, ResponseDto<List<GetAllStockQueryResponse>>>
    {
        public GetStockByGroupIdQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetAllStockQueryResponse>>> Handle(GetStockByGroupIdQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetAllStockQueryResponse>>($"Stock/GetStockByGroupId/{request.GroupId}");

            return data;
        }
    }
}

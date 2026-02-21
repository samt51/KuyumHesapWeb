using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.DashboardFeature.Queries.GetAllDashboard
{
    public class GetAllDashboardQueryHandler : BaseHandler, IRequestHandler<GetAllDashboardQueryRequest, ResponseDto<GetAllDashboardQueryResponse>>
    {
        public GetAllDashboardQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<GetAllDashboardQueryResponse>> Handle(GetAllDashboardQueryRequest request, CancellationToken cancellationToken)
        {
          


            //var balanceTotal = await _apiService.GetAsync<GetAllDashboardQueryResponse>("Report/GetAllReport");

            return new ResponseDto<GetAllDashboardQueryResponse>().Success(new GetAllDashboardQueryResponse());
        }
    }
}

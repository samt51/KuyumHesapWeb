using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetCashReport;
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
            var response = new GetAllDashboardQueryResponse();

            var data = _apiService.GetAsync<GetCashReportQueryResponse>($"Report/GetCashReport");

            response.CashReport = data.Result.data;

            //var balanceTotal = await _apiService.GetAsync<GetAllDashboardQueryResponse>("Report/GetAllReport");

            return new ResponseDto<GetAllDashboardQueryResponse>().Success(response);
        }
    }
}

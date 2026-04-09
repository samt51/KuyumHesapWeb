using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetBankReport;
using KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetCashReport;
using KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetPosReport;
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

            var data = await _apiService.GetAsync<GetCashReportQueryResponse>($"Report/GetCashReport");

            var getPosReport = await _apiService.GetAsync<GetPosReportQueryResponse>("Report/GetPosReport");

            var bankReport = await _apiService.GetAsync<GetBankReportQueryResponse>("Report/GetBankReport");

            response.CashReport = data.data;

            response.PosReport = getPosReport.data;

            response.BankReport = bankReport.data;

            //var balanceTotal = await _apiService.GetAsync<GetAllDashboardQueryResponse>("Report/GetAllReport");

            return new ResponseDto<GetAllDashboardQueryResponse>().Success(response);
        }
    }
}

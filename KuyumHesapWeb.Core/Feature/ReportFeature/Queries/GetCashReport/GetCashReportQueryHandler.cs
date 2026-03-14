using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetCashReport
{
    public class GetCashReportQueryHandler : BaseHandler, IRequestHandler<GetCashReportQueryRequest, ResponseDto<GetCashReportQueryResponse>>
    {
        public GetCashReportQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<GetCashReportQueryResponse>> Handle(GetCashReportQueryRequest request, CancellationToken cancellationToken)
        {
            var data = _apiService.GetAsync<GetCashReportQueryResponse>($"Report/GetCashReport?accountId={request.AccountId}");

            return data;
        }
    }
}

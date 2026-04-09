using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetBankReport
{
    public class GetBankReportQueryHandler : BaseHandler, IRequestHandler<GetBankReportQueryRequest, ResponseDto<GetBankReportQueryResponse>>
    {
        public GetBankReportQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<GetBankReportQueryResponse>> Handle(GetBankReportQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<GetBankReportQueryResponse>("Report/GetBankReport");
            return data;
        }
    }
}

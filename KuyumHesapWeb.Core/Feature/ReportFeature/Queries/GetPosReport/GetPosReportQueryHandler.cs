using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetPosReport
{
    public class GetPosReportQueryHandler : BaseHandler, IRequestHandler<GetPosReportQueryRequest, ResponseDto<GetPosReportQueryResponse>>
    {
        public GetPosReportQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<GetPosReportQueryResponse>> Handle(GetPosReportQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<GetPosReportQueryResponse>("Report/GetPosReport");
            return data;
        }
    }
}

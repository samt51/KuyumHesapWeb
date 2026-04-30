using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Features.ReportFeature.Queries.GetFilterReport
{
    public class GetFilterReportQueryHandler : BaseHandler, IRequestHandler<GetFilterReportQueryRequest, ResponseDto<List<GetFilterReportQueryResponse>>>
    {
        public GetFilterReportQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetFilterReportQueryResponse>>> Handle(GetFilterReportQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<GetFilterReportQueryRequest, List<GetFilterReportQueryResponse>>("Report/GetFilterReport", request);
            return data;
        }
    }
}

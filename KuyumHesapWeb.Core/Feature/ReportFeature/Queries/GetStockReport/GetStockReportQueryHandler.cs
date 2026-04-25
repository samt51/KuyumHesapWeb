using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Features.ReportFeature.Queries.GetStockReport
{
    public class GetStockReportQueryHandler : BaseHandler, IRequestHandler<GetStockReportQueryRequest, ResponseDto<GetStockReportQueryResponse>>
    {
        public GetStockReportQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<GetStockReportQueryResponse>> Handle(GetStockReportQueryRequest request, CancellationToken cancellationToken)
        {

            var response = await _apiService.GetAsync<GetStockReportQueryResponse>($"Report/GetStockReport/{request.StockGroupAccounId}");

            return response;
        }
    }
}

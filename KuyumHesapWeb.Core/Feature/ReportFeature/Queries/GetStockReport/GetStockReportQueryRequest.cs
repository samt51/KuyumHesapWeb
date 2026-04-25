using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Features.ReportFeature.Queries.GetStockReport
{
    public class GetStockReportQueryRequest : IRequest<ResponseDto<GetStockReportQueryResponse>>
    {
        public int StockGroupAccounId { get; set; }
        public GetStockReportQueryRequest(int stockGroupAccounId)
        {
            this.StockGroupAccounId = stockGroupAccounId;
        }
    }
}

using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetCashReport
{
    public class GetCashReportQueryRequest : IRequest<ResponseDto<GetCashReportQueryResponse>>
    {
        public int? AccountId { get; set; }
        public GetCashReportQueryRequest(int? accountId)
        {
            this.AccountId = accountId;
        }
    }
}

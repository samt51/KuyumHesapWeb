using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetCashReport
{
    public class GetCashReportQueryRequest : IRequest<ResponseDto<GetCashReportQueryResponse>>
    {
     }
}

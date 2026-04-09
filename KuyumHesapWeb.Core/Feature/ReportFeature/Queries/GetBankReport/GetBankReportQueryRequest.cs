using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetBankReport
{
    public class GetBankReportQueryRequest : IRequest<ResponseDto<GetBankReportQueryResponse>>
    {
    }
}

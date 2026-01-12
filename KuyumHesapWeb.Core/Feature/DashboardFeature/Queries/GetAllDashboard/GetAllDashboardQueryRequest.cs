using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.DashboardFeature.Queries.GetAllDashboard
{
    public class GetAllDashboardQueryRequest : IRequest<ResponseDto<GetAllDashboardQueryResponse>>
    {
    }
}

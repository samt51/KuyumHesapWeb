using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.CureFeature.Queries.GetLatestCure
{
    public class GetLatestCureQueryRequest : IRequest<ResponseDto<List<GetLatestCureQueryResponse>>>
    {
    }
}

using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.UserFeature.Queries.Roles.GetAll
{
    public class GetAllRolesQueryRequest : IRequest<ResponseDto<List<GetAllRolesQueryResponse>>>
    {
    }
}

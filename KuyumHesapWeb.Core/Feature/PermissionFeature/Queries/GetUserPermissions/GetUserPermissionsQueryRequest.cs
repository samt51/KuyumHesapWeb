using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetUserPermissions
{
    public class GetUserPermissionsQueryRequest : IRequest<ResponseDto<List<GetUserPermissionsQueryResponse>>>
    {
        public GetUserPermissionsQueryRequest(int userId)
        {
            UserId = userId;
        }

        public int UserId { get; }
    }
}

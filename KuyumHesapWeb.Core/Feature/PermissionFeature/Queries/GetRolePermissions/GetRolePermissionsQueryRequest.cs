using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetRolePermissions
{
    public class GetRolePermissionsQueryRequest : IRequest<ResponseDto<List<GetRolePermissionsQueryResponse>>>
    {
        public GetRolePermissionsQueryRequest(int roleId)
        {
            RoleId = roleId;
        }

        public int RoleId { get; }
    }
}

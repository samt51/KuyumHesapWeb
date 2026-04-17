using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.AssignRolePermission
{
    public class AssignRolePermissionCommandRequest : IRequest<ResponseDto<AssignRolePermissionCommandResponse>>
    {
        public int RoleId { get; set; }
        public int PermissionId { get; set; }
    }
}

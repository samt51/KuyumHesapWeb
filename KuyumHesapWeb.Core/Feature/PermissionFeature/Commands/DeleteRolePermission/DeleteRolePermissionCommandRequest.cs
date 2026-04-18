using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.DeleteRolePermission
{
    public class DeleteRolePermissionCommandRequest : IRequest<ResponseDto<DeleteRolePermissionCommandResponse>>
    {
        public int RoleId { get; set; }
        public int PermissionId { get; set; }
    }
}

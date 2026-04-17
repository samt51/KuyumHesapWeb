using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.DeleteUserPermission
{
    public class DeleteUserPermissionCommandRequest : IRequest<ResponseDto<DeleteUserPermissionCommandResponse>>
    {
        public int UserId { get; set; }
        public int PermissionId { get; set; }
    }
}

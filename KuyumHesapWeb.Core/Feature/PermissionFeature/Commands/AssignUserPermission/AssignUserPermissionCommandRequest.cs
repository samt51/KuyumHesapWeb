using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.AssignUserPermission
{
    public class AssignUserPermissionCommandRequest : IRequest<ResponseDto<AssignUserPermissionCommandResponse>>
    {
        public int UserId { get; set; }
        public int PermissionId { get; set; }
    }
}

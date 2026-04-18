using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.DeleteRolePermission
{
    public class DeleteRolePermissionCommandHandler : BaseHandler, IRequestHandler<DeleteRolePermissionCommandRequest, ResponseDto<DeleteRolePermissionCommandResponse>>
    {
        public DeleteRolePermissionCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<DeleteRolePermissionCommandResponse>> Handle(DeleteRolePermissionCommandRequest request, CancellationToken cancellationToken)
        {
            return _apiService.DeleteAsync<DeleteRolePermissionCommandResponse>($"Role/DeletePermission?roleId={request.RoleId}&permissionId={request.PermissionId}");
        }
    }
}

using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.AssignRolePermission
{
    public class AssignRolePermissionCommandHandler : BaseHandler, IRequestHandler<AssignRolePermissionCommandRequest, ResponseDto<AssignRolePermissionCommandResponse>>
    {
        public AssignRolePermissionCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<AssignRolePermissionCommandResponse>> Handle(AssignRolePermissionCommandRequest request, CancellationToken cancellationToken)
        {
            return _apiService.PostAsync<AssignRolePermissionCommandRequest, AssignRolePermissionCommandResponse>("Role/AssignPermission", request);
        }
    }
}

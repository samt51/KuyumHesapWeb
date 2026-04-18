using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.DeleteUserPermission
{
    public class DeleteUserPermissionCommandHandler : BaseHandler, IRequestHandler<DeleteUserPermissionCommandRequest, ResponseDto<DeleteUserPermissionCommandResponse>>
    {
        public DeleteUserPermissionCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<DeleteUserPermissionCommandResponse>> Handle(DeleteUserPermissionCommandRequest request, CancellationToken cancellationToken)
        {
            return _apiService.DeleteAsync<DeleteUserPermissionCommandResponse>($"Users/DeletePermission?userId={request.UserId}&permissionId={request.PermissionId}");
        }
    }
}

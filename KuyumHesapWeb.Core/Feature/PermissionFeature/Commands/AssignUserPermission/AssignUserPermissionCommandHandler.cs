using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.AssignUserPermission
{
    public class AssignUserPermissionCommandHandler : BaseHandler, IRequestHandler<AssignUserPermissionCommandRequest, ResponseDto<AssignUserPermissionCommandResponse>>
    {
        public AssignUserPermissionCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<AssignUserPermissionCommandResponse>> Handle(AssignUserPermissionCommandRequest request, CancellationToken cancellationToken)
        {
            return _apiService.PostAsync<AssignUserPermissionCommandRequest, AssignUserPermissionCommandResponse>("Users/AssignPermission", request);
        }
    }
}

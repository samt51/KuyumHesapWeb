using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.Update
{
    public class UpdatePermissionCommandHandler : BaseHandler, IRequestHandler<UpdatePermissionCommandRequest, ResponseDto<UpdatePermissionCommandResponse>>
    {
        public UpdatePermissionCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<UpdatePermissionCommandResponse>> Handle(UpdatePermissionCommandRequest request, CancellationToken cancellationToken)
        {
            return _apiService.PutAsync<UpdatePermissionCommandRequest, UpdatePermissionCommandResponse>("Permission/Update", request);
        }
    }
}

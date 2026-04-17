using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.Create
{
    public class CreatePermissionCommandHandler : BaseHandler, IRequestHandler<CreatePermissionCommandRequest, ResponseDto<CreatePermissionCommandResponse>>
    {
        public CreatePermissionCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<CreatePermissionCommandResponse>> Handle(CreatePermissionCommandRequest request, CancellationToken cancellationToken)
        {
            return _apiService.PostAsync<CreatePermissionCommandRequest, CreatePermissionCommandResponse>("Permission/Create", request);
        }
    }
}

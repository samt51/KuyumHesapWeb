using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.UserFeature.Commands.Roles.Create
{
    public class CreateRolesCommandHandler : BaseHandler, IRequestHandler<CreateRolesCommandRequest, ResponseDto<CreateRolesCommandResponse>>
    {
        public CreateRolesCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<CreateRolesCommandResponse>> Handle(CreateRolesCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<CreateRolesCommandRequest, CreateRolesCommandResponse>("Users/CreateRole", request);

            return data;
        }
    }
}

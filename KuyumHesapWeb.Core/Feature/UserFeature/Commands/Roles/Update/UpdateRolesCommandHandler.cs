using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.UserFeature.Commands.Roles.Update
{
    public class UpdateRolesCommandHandler : BaseHandler, IRequestHandler<UpdateRolesCommandRequest, ResponseDto<UpdateRolesCommandResponse>>
    {
        public UpdateRolesCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<UpdateRolesCommandResponse>> Handle(UpdateRolesCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PutAsync<UpdateRolesCommandRequest, UpdateRolesCommandResponse>("Users/UpdateRole", request);

            return data;
        }
    }
}

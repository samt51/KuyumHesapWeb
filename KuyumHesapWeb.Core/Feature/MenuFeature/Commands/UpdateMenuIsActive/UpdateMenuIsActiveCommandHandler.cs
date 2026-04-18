using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MenuFeature.Commands.UpdateMenuIsActive
{
    public class UpdateMenuIsActiveCommandHandler : BaseHandler, IRequestHandler<UpdateMenuIsActiveCommandRequest, ResponseDto<UpdateMenuIsActiveCommandResponse>>
    {
        public UpdateMenuIsActiveCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<UpdateMenuIsActiveCommandResponse>> Handle(UpdateMenuIsActiveCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PutAsync<UpdateMenuIsActiveCommandRequest, UpdateMenuIsActiveCommandResponse>("Menu/UpdateIsActive", request);

            return data;
        }
    }
}

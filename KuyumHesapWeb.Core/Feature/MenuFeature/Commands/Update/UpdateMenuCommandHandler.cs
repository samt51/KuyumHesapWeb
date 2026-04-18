using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MenuFeature.Commands.Update
{
    public class UpdateMenuCommandHandler : BaseHandler, IRequestHandler<UpdateMenuCommandRequest, ResponseDto<UpdateMenuCommandResponse>>
    {
        public UpdateMenuCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<UpdateMenuCommandResponse>> Handle(UpdateMenuCommandRequest request, CancellationToken cancellationToken)
        {
            return  await _apiService.PutAsync<UpdateMenuCommandRequest, UpdateMenuCommandResponse>("Menu/Update", request);
        }
    }
}

using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.SettingsFeature.Commands.Update
{
    public class UpdateSettingCommandHandler : BaseHandler, IRequestHandler<UpdateSettingCommandRequest, ResponseDto<UpdateSettingCommandResponse>>
    {
        public UpdateSettingCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<UpdateSettingCommandResponse>> Handle(UpdateSettingCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<UpdateSettingCommandRequest, UpdateSettingCommandResponse>("Setting/Update", request);
            return data;
        }
    }
}

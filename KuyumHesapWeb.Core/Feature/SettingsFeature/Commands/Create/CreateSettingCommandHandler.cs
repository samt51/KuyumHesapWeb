using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.SettingsFeature.Commands.Create
{
    public class CreateSettingCommandHandler : BaseHandler, IRequestHandler<CreateSettingCommandRequest, ResponseDto<CreateSettingCommandResponse>>
    {
        public CreateSettingCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<CreateSettingCommandResponse>> Handle(CreateSettingCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<CreateSettingCommandRequest, CreateSettingCommandResponse>("Setting/Create", request);
            return data;
        }
    }
}

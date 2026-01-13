using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.BarcodeSettingFeature.Commands.Update
{
    public class UpdateBarcodeSettingCommandHandler : BaseHandler, IRequestHandler<UpdateBarcodeSettingCommandRequest, ResponseDto<UpdateBarcodeSettingCommandResponse>>
    {
        public UpdateBarcodeSettingCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<UpdateBarcodeSettingCommandResponse>> Handle(UpdateBarcodeSettingCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PutAsync<UpdateBarcodeSettingCommandRequest, UpdateBarcodeSettingCommandResponse>("BarcodeSetting/Update", request);

            return new ResponseDto<UpdateBarcodeSettingCommandResponse>().Success(data.data);
        }
    }
}

using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.BarcodeSettingFeature.Commands.Create
{
    public class CreateBarcodeSettingCommandHandler : BaseHandler, IRequestHandler<CreateBarcodeSettingCommandRequest, ResponseDto<CreateBarcodeSettingCommandResponse>>
    {
        public CreateBarcodeSettingCommandHandler(IApiService _apiService) : base(_apiService)
        {


        }
        public async Task<ResponseDto<CreateBarcodeSettingCommandResponse>> Handle(CreateBarcodeSettingCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<CreateBarcodeSettingCommandRequest, CreateBarcodeSettingCommandResponse>("BarcodeSetting/Create", request);

            return new ResponseDto<CreateBarcodeSettingCommandResponse>().Success(data.data);
        }
    }
}

using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.BarcodeSettingFeature.Queries.GetById
{
    public class GetByIdBarcodeSettingQueryHandler : BaseHandler, IRequestHandler<GetByIdBarcodeSettingQueryRequest, ResponseDto<GetByIdBarcodeSettingQueryResponse>>
    {
        public GetByIdBarcodeSettingQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<GetByIdBarcodeSettingQueryResponse>> Handle(GetByIdBarcodeSettingQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<GetByIdBarcodeSettingQueryResponse>($"BarcodeSetting/GetById/{request.Id}");

            return new ResponseDto<GetByIdBarcodeSettingQueryResponse>().Success(data.data);
        }
    }
}

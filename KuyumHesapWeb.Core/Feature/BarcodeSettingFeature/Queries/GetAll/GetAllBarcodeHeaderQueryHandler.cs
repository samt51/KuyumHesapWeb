using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.BarcodeSettingFeature.Queries.GetAll
{
    public class GetAllBarcodeHeaderQueryHandler : BaseHandler, IRequestHandler<GetAllBarcodeHeaderQueryRequest, ResponseDto<List<GetAllBarcodeHeaderQueryResponse>>>
    {
        public GetAllBarcodeHeaderQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetAllBarcodeHeaderQueryResponse>>> Handle(GetAllBarcodeHeaderQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetAllBarcodeHeaderQueryResponse>>("BarcodeSetting/GetAll");

            return new ResponseDto<List<GetAllBarcodeHeaderQueryResponse>>().Success(data.data);
        }
    }
}

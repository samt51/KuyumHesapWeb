using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.BarcodeFeature.GetAllMain
{
    public class GetAllMainQueryHandler : BaseHandler, IRequestHandler<GetAllMainQueryRequest, ResponseDto<GetAllMainQueryResponse>>
    {
        public GetAllMainQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<GetAllMainQueryResponse>> Handle(GetAllMainQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<GetAllMainQueryResponse>("Barcode/GetAllMainBarcode");

            return new ResponseDto<GetAllMainQueryResponse>().Success(data.data);
        }
    }
}

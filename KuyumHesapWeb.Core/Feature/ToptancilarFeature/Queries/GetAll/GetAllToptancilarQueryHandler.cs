using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ToptancilarFeature.Queries.GetAll
{
    public class GetAllToptancilarQueryHandler : BaseHandler, IRequestHandler<GetAllToptancilarQueryRequest, ResponseDto<List<GetAllToptancilarQueryResponse>>>
    {
        public GetAllToptancilarQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetAllToptancilarQueryResponse>>> Handle(GetAllToptancilarQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetAllToptancilarQueryResponse>>("Barcode/GetToptancilar");
            
            return new ResponseDto<List<GetAllToptancilarQueryResponse>>().Success(data.data);
        }
    }
}

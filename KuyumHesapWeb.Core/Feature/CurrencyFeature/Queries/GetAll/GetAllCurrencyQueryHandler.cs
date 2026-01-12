using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetAll
{
    public class GetAllCurrencyQueryHandler : BaseHandler, IRequestHandler<GetAllCurrencyQueryRequest, ResponseDto<List<GetAllCurrencyQueryResponse>>>
    {
        public GetAllCurrencyQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetAllCurrencyQueryResponse>>> Handle(GetAllCurrencyQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetAllCurrencyQueryResponse>>("Currency/GetAll");

            return new ResponseDto<List<GetAllCurrencyQueryResponse>>().Success(data.data);
        }
    }
}

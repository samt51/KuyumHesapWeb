using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ExchangeFeature.Queries.GetExchangeRateByCurrencyCode
{
    public class GetExchangeRateByCurrencyCodeHandler : BaseHandler, IRequestHandler<GetExchangeRateByCurrencyCodeRequest, ResponseDto<GetExchangeRateByCurrencyCodeResponse>>
    {
        public GetExchangeRateByCurrencyCodeHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<GetExchangeRateByCurrencyCodeResponse>> Handle(GetExchangeRateByCurrencyCodeRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<GetExchangeRateByCurrencyCodeResponse>($"Exchange/GetExchangeRateByCurrencyCode/{request.CurrencyId}");

            return data;
        }
    }
}

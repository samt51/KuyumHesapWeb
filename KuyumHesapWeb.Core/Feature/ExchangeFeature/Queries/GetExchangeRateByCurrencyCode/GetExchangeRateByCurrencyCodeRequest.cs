using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ExchangeFeature.Queries.GetExchangeRateByCurrencyCode
{
    public class GetExchangeRateByCurrencyCodeRequest : IRequest<ResponseDto<GetExchangeRateByCurrencyCodeResponse>>
    {
        public int CurrencyId { get; set; }
    }
}

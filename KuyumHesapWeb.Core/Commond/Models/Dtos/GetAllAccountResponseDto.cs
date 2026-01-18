using KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetAll;

namespace KuyumHesapWeb.Core.Commond.Models.Dtos
{
    public class GetAllAccountResponseDto
    {
        public List<GetAllAccountQueryResponse> getAllAccountQueryResponses { get; set; }
        public List<GetAllCurrencyQueryResponse> getAllCurrencyQueryResponses { get; set; }
    }

}

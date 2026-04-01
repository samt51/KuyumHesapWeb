using KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.SettingsFeature.Queries.GetAll;

namespace KuyumHesapWeb.Core.Commond.Models.Dtos
{
    public class GetAllAccountResponseDto
    {
        public List<GetAllAccountQueryResponse> getAllAccountQueryResponses { get; set; }
        public List<GetAllCurrencyQueryResponse> getAllCurrencyQueryResponses { get; set; }
        public List<GetAllSettingsQueryResponse> Settings { get; set; }
        public CreateReceiptCommandRequest createReceiptCommandRequest { get; set; }
        public CreateReceiptViewModel CreateReceiptViewModel { get; set; }
    }
}

using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetAll;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ExchangeFeature.Commands.Create
{
    public class CreateExchangeCommandRequest : IRequest<ResponseDto<CreateExchangeCommandResponse>>
    {
        /// <summary>
        /// Kurun geçerli olduğu tarih
        /// </summary>
        public DateTime RateDate { get; set; }

        /// <summary>
        /// Döviz kuru kimliği
        /// </summary>
        public int CurrencyId { get; set; }

        /// <summary>
        /// Alış kuru
        /// </summary>
        public decimal BuyRate { get; set; }

        /// <summary>
        /// Satış kuru
        /// </summary>
        public decimal SellRate { get; set; }

        /// <summary>
        /// Bir önceki günün kapanış kuru
        /// </summary>
        public decimal? PreviousCloseRate { get; set; }
    }
    public class CreateExchangeCommandRequestDto
    {
        public List<GetAllCurrencyQueryResponse> getAllCurrencyQueries { get; set; }
        public CreateExchangeCommandRequest CreateExchangeCommandRequest { get; set; }
    }
}

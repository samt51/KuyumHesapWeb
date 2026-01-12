using KuyumHesapWeb.Core.Feature.ExchangeFeature.Dtos;

namespace KuyumHesapWeb.Core.Feature.ExchangeFeature.Queries.GetAll
{
    public class GetAllExchangeQueryResponse
    {
        public int Id { get; set; }
        /// <summary>
        /// Kurun geçerli olduğu tarih
        /// </summary>
        public DateTime RateDate { get; set; }

        /// <summary>
        /// Döviz kuru kimliği
        /// </summary>
        public ExchangeForCurrencyResponseDto CurrencyDto { get; set; } = new ExchangeForCurrencyResponseDto();

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
}

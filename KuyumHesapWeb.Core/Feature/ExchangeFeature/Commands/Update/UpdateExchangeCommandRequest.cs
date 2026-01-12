using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ExchangeFeature.Commands.Update
{
    public class UpdateExchangeCommandRequest : IRequest<ResponseDto<UpdateExchangeCommandResponse>>
    {
        public int Id { get; set; }
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
 
}

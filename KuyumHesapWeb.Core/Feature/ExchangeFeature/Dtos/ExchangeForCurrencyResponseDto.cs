namespace KuyumHesapWeb.Core.Feature.ExchangeFeature.Dtos
{
    public class ExchangeForCurrencyResponseDto
    {
        public int Id { get; set; }
        /// <summary>
        /// Döviz kodu (ISO 4217 - TRY, USD, EUR vb.)
        /// </summary>
        public string CurrencyCode { get; set; } = null!;

        /// <summary>
        /// Döviz adı
        /// </summary>
        public string CurrencyName { get; set; } = null!;
    }
}

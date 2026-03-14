namespace KuyumHesapWeb.Core.Feature.ReportFeature.Dtos
{
    public class CashRegisterStatusResponseDto
    {
        public string CurrencyCode { get; set; } = string.Empty; // DovizKodu
        public decimal OpeningBalance { get; set; }              // Devreden
        public decimal DailyCredit { get; set; }                 // GunlukGiris
        public decimal DailyDebit { get; set; }                  // GunlukCikis
        public decimal Balance { get; set; }                     // Bakiye
        public decimal HasEquivalent { get; set; }
    }
}

using KuyumHesapWeb.Core.Feature.ReceiptFeature.Dtos;

namespace KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetEkstreByCustomer
{
    public class GetEkstreByCustomerQueryResponse
    {
        public int Id { get; set; }
        /// <summary>
        /// Fiş Numarası Otomatik Atama
        /// </summary>
        public string ReceiptNumber { get; set; } = string.Empty;
        /// <summary>
        /// Fiş Tarihi
        /// </summary>
        public DateTime ReceiptDate { get; set; }
        /// <summary>
        /// Cari Hesap Id
        /// </summary>
        public int AccountId { get; set; }
        public string AccountName { get; set; } = null!;
        public string AccountTypeName { get; set; } = null!;
        /// <summary>
        /// Personel Id Bilgisi
        /// </summary>
        public int? EmployeeId { get; set; }
        /// <summary>
        /// Açıklama
        /// </summary>
        public string? Description { get; set; }
        /// <summary>
        /// Cari Mi ? 
        /// </summary>
        public bool IsCustomerReceipt { get; set; }
        /// <summary>
        /// Para Birimi Kodu
        /// </summary>
        public string? CurrencyCode { get; set; }
        /// <summary>
        /// Açık Hesap Tutarı
        /// </summary>
        public decimal? OpenBalanceAmount { get; set; }
        public List<GetMovementByCustomerIdResponse> GetMovementByCustomerIdResponses { get; set; }
    }
}

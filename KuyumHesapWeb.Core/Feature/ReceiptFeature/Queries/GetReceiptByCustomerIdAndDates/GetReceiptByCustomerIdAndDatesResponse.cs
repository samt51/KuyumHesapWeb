using KuyumHesapWeb.Core.Feature.ReceiptFeature.Dtos;

namespace KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetReceiptByCustomerIdAndDates
{
    public class GetReceiptByCustomerIdAndDatesResponse
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
        /// <summary>
        /// Hesap adı (firma, kişi veya kurum adı)
        /// </summary>
        public string AccountName { get; set; } = null!;

        /// <summary>
        /// Hesap tipi kimliği (Foreign Key -> AccountTypes)
        /// </summary>
        public int AccountTypeId { get; set; }
        public string AccountTypeName { get; set; }
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


        public List<GetMovementByCustomerIdResponse> Movements { get; set; }
    }
}

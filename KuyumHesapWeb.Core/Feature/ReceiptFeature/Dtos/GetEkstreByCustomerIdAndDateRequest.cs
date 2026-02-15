namespace KuyumHesapWeb.Core.Feature.ReceiptFeature.Dtos
{
    public class GetEkstreByCustomerIdAndDateRequest
    {
        public int CustomerId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}

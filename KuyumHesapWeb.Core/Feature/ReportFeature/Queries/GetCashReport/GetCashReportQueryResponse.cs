using KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetEkstreByCustomer;

namespace KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetCashReport
{
    public class GetCashReportQueryResponse
    {
        public decimal? TotalHas { get; set; }
        public List<GetCashReportItemResponse> Items { get; set; } = new();
    }
    public class GetCashReportItemResponse
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; } = default!;
        public decimal TotalHas { get; set; }
        public List<EkstreBakiyeViewModel> DevredenBakiyeler { get; set; } = new();
        public List<EkstreSatirViewModel> Hareketler { get; set; } = new();
    }
}

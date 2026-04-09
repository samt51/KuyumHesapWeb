
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetEkstreByCustomer;

namespace KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetBankReport
{
    public class GetBankReportQueryResponse
    {
        public decimal? TotalHas { get; set; }
        public List<GetBankReportItemResponse> Items { get; set; } = new();
    }
    public class GetBankReportItemResponse
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; } = default!;
        public decimal TotalHas { get; set; }
        public List<EkstreBakiyeViewModel> DevredenBakiyeler { get; set; } = new();
        public List<EkstreSatirViewModel> Hareketler { get; set; } = new();
    }
}


using KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetEkstreByCustomer;

namespace KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetPosReport

{
    public class GetPosReportQueryResponse
    {
        public decimal? TotalHas { get; set; }
        public List<GetPosReportItemResponse> Items { get; set; } = new();
    }
    public class GetPosReportItemResponse
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; } = default!;
        public decimal TotalHas { get; set; }
        public List<EkstreBakiyeViewModel> DevredenBakiyeler { get; set; } = new();
        public List<EkstreSatirViewModel> Hareketler { get; set; } = new();
    }
}

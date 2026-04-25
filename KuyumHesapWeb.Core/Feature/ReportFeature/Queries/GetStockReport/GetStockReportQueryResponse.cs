
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetEkstreByCustomer;

namespace KuyumHesapWeb.Core.Features.ReportFeature.Queries.GetStockReport
{
    public class GetStockReportQueryResponse
    {
        public decimal? TotalHas { get; set; }
        public decimal TotalQuantity { get; set; }
        public List<GetStockReportQueryItemResponse> Items { get; set; }
    }
    public class GetStockReportQueryItemResponse
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; }
        public decimal TotalHas { get; set; }
        public List<EkstreBakiyeViewModel> DevredenBakiyeler { get; set; } = new();
        public List<EkstreSatirViewModel> Hareketler { get; set; } = new();
    }
}

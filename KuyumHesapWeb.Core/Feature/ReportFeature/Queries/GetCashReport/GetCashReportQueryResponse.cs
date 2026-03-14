using KuyumHesapWeb.Core.Feature.ReportFeature.Dtos;

namespace KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetCashReport
{
    public class GetCashReportQueryResponse
    {
        public decimal TotalBalanceHas { get; set; }
        public List<CashRegisterStatusResponseDto> Details { get; set; } = new();
    }
}

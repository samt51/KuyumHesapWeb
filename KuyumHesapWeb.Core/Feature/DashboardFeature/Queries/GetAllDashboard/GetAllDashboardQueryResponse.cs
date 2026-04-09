using KuyumHesapWeb.Core.Commond.Models.Dtos.MyTaskItemDtos;
using KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetBankReport;
using KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetCashReport;
using KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetPosReport;

namespace KuyumHesapWeb.Core.Feature.DashboardFeature.Queries.GetAllDashboard
{

    public class GetAllDashboardQueryResponse
    {

        public GetAllDashboardQueryResponse()
        {
            PastMissions = new List<GetAllMyTaskQueryResponseDto>();
            CurrentMissions = new List<GetAllMyTaskQueryResponseDto>();
            FutureMissions = new List<GetAllMyTaskQueryResponseDto>();
            CashReport = new();
        }
        /// <summary>
        /// Geçmiş Görevler 
        /// </summary>
        public List<GetAllMyTaskQueryResponseDto> PastMissions { get; set; }
        /// <summary>
        /// Bugünkü Görevler 
        /// </summary>
        public List<GetAllMyTaskQueryResponseDto> CurrentMissions { get; set; }
        /// <summary>
        /// Gelecek Görevler 
        /// </summary>
        public List<GetAllMyTaskQueryResponseDto> FutureMissions { get; set; }

        public GetCashReportQueryResponse CashReport { get; set; }
        public GetPosReportQueryResponse PosReport { get; set; }
        public GetBankReportQueryResponse BankReport { get; set; }
        public decimal BankBalanceTotal { get; set; }
        public decimal PosBalanceTotal { get; set; }


    }
}

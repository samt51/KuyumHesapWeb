using KuyumHesapWeb.Core.Commond.Models.Dtos.MyTaskItemDtos;
using KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetCashReport;

namespace KuyumHesapWeb.Core.Feature.DashboardFeature.Queries.GetAllDashboard
{
    
    public class GetAllDashboardQueryResponse
    {

        public GetAllDashboardQueryResponse()
        {
            PastMissions =new List<GetAllMyTaskQueryResponseDto>();
            CurrentMissions = new List<GetAllMyTaskQueryResponseDto>();
            FutureMissions = new List<GetAllMyTaskQueryResponseDto>();
            CashReport = new GetCashReportQueryResponse();
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

        public GetCashReportQueryResponse CashReport{ get; set; }
        public decimal BankBalanceTotal { get; set; }
        public decimal PosBalanceTotal { get; set; }


    }
    public class KasaDetayViewModel
    {
        public string DovizKodu { get; set; } = "";
        public decimal Devreden { get; set; }
        public decimal GunlukGiris { get; set; }
        public decimal GunlukCikis { get; set; }
        public decimal Bakiye { get; set; }
        public decimal HasKarsiligi { get; set; }
    }
}

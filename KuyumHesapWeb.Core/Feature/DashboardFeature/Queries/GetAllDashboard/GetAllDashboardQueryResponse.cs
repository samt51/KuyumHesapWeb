using KuyumHesapWeb.Core.Commond.Models.Dtos.MyTaskItemDtos;

namespace KuyumHesapWeb.Core.Feature.DashboardFeature.Queries.GetAllDashboard
{
    public class GetAllDashboardQueryResponse
    {
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

        public decimal ToplamBakiyeHas { get; set; }
        public List<KasaDetayViewModel> Detaylar { get; set; } = new();
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

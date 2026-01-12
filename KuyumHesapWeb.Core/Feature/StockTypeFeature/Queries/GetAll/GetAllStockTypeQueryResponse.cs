using KuyumHesapWeb.Core.Commond.Models.Dtos.CurrencyDtos.Response;
using KuyumHesapWeb.Core.Commond.Models.Dtos.StockGroupDtos.Response;

namespace KuyumHesapWeb.Core.Feature.StockTypeFeature.Queries.GetAll
{
    public class GetAllStockTypeQueryResponse
    {
        public int Id { get; set; }
        /// <summary>
        /// Stok tipi adı
        /// </summary>
        public string StockTypeName { get; set; } = null!;

        /// <summary>
        /// Bağlı olduğu stok grup kimliği (Foreign Key -> StockGroups)
        /// </summary>
        public StockGroupResponseDto StockGroup { get; set; }

        /// <summary>
        /// Stok tipine bağlı döviz kimliği (Foreign Key -> Currencies)
        /// </summary>
        public CurrencyResponseDto Currency { get; set; }

        /// <summary>
        /// Stok tipinin aktiflik durumu
        /// </summary>
        public bool IsActive { get; set; }
    }
}

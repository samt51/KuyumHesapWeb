using KuyumHesapWeb.Core.Commond.Models.Dtos.CurrencyDtos.Response;
using KuyumHesapWeb.Core.Commond.Models.Dtos.StockGroupDtos.Response;

namespace KuyumHesapWeb.Core.Commond.Models.Dtos.StockTypeDtos.Response
{
    public class StockTypeResponseDto
    {
        public int Id { get; set; }
        /// <summary>
        /// Stok tipi adı
        /// </summary>
        public string StockTypeName { get; set; } = null!;

        /// <summary>
        /// Bağlı olduğu stok grup kimliği (Foreign Key -> StockGroups)
        /// </summary>
        public StockGroupResponseDto stockGroupsResponseDto { get; set; }
        /// <summary>
        /// Stok tipine bağlı döviz kimliği (Foreign Key -> Currencies)
        /// </summary>
        public CurrencyResponseDto currencyResponseDto { get; set; }

        /// <summary>
        /// Stok tipinin aktiflik durumu
        /// </summary>
        public bool IsActive { get; set; }
    }
}

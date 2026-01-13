using KuyumHesapWeb.Core.Feature.BarcodeSettingFeature.Dtos;

namespace KuyumHesapWeb.Core.Feature.BarcodeSettingFeature.Queries.GetById
{
    public class GetByIdBarcodeSettingQueryResponse
    {
        public int Id { get; set; }
        /// <summary>
        /// Barkod başlık adı
        /// </summary>
        public string Name { get; set; } = null!;

        /// <summary>
        /// RFID barkod olup olmadığı bilgisi
        /// </summary>
        public bool IsRfid { get; set; }

        /// <summary>
        /// Barkodun başlangıç genişlik değeri
        /// </summary>
        public decimal StartWidth { get; set; }

        /// <summary>
        /// Barkodun başlangıç yükseklik değeri
        /// </summary>
        public decimal StartHeight { get; set; }
        public List<BarcodeDetailResponseDto> barcodeDetails { get; set; }
    }
}

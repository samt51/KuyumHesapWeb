namespace KuyumHesapWeb.Core.Feature.BarcodeSettingFeature.Dtos
{
    public class BarcodeDetailResponseDto
    {
        public int Id { get; set; }
        /// <summary>
        /// Bağlı olduğu barkod başlık kimliği (Foreign Key -> BarcodeHeaders)
        /// </summary>
        public int BarcodeHeaderId { get; set; }

        /// <summary>
        /// Başlık veya alanın görünen adı
        /// </summary>
        public string Title { get; set; } = null!;

        /// <summary>
        /// Etiket üzerinde gösterilecek alan adı
        /// </summary>
        public string FieldName { get; set; } = null!;

        /// <summary>
        /// Alan kodu (dinamik veri eşlemesi için)
        /// </summary>
        public string FieldCode { get; set; } = null!;

        /// <summary>
        /// Alan değeri için kullanılacak formül
        /// </summary>
        public string Formula { get; set; } = null!;

        /// <summary>
        /// Yazı tipi adı
        /// </summary>
        public string FontName { get; set; } = null!;

        /// <summary>
        /// Yazı boyutu
        /// </summary>
        public int FontSize { get; set; }

        /// <summary>
        /// Yazının kalın (bold) olup olmadığı
        /// </summary>
        public bool IsBold { get; set; }

        /// <summary>
        /// X eksenindeki konum (yatay)
        /// </summary>
        public int PositionX { get; set; }

        /// <summary>
        /// Y eksenindeki konum (dikey)
        /// </summary>
        public int PositionY { get; set; }

        /// <summary>
        /// Alan genişliği
        /// </summary>
        public int Width { get; set; }

        /// <summary>
        /// Alan yüksekliği
        /// </summary>
        public int Height { get; set; }
    }
}

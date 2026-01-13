using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.BarcodeSettingFeature.Dtos;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.BarcodeSettingFeature.Commands.Update
{
    public class UpdateBarcodeSettingCommandRequest : IRequest<ResponseDto<UpdateBarcodeSettingCommandResponse>>
    {
        /// <summary>
        /// Entitylerdeki Ortak Id alanı
        /// </summary>
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

        public List<BarcodeDetailRequestDto> barcodeDetails { get; set; }
    }
}

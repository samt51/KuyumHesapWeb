using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.AccountFeature.Command.Update
{
    public class UpdateAccountCommandRequest : IRequest<ResponseDto<UpdateAccountCommandResponse>>
    {
        public int Id { get; set; }
        /// <summary>
        /// Hesap adı (firma, kişi veya kurum adı)
        /// </summary>
        public string AccountName { get; set; } = null!;

        /// <summary>
        /// Hesap tipi kimliği (Foreign Key -> AccountTypes)
        /// </summary>
        public int AccountTypeId { get; set; }

        /// <summary>
        /// Müşteri tipi (Bireysel, Kurumsal vb.)
        /// </summary>
        public string CustomerType { get; set; } = null!;

        /// <summary>
        /// Cep telefonu numarası
        /// </summary>
        public string? MobilePhone { get; set; }

        /// <summary>
        /// E-posta adresi
        /// </summary>
        public string? Email { get; set; }

        /// <summary>
        /// T.C. Kimlik numarası
        /// </summary>
        public string? NationalIdNumber { get; set; }

        /// <summary>
        /// Vergi dairesi bilgisi
        /// </summary>
        public string? TaxOffice { get; set; }

        /// <summary>
        /// Vergi numarası
        /// </summary>
        public string? TaxNumber { get; set; }

        /// <summary>
        /// Ülke bilgisi
        /// </summary>
        public string? Country { get; set; }

        /// <summary>
        /// Şehir bilgisi
        /// </summary>
        public string? City { get; set; }

        /// <summary>
        /// İlçe bilgisi
        /// </summary>
        public string? District { get; set; }

        /// <summary>
        /// Mahalle bilgisi
        /// </summary>
        public string? Neighborhood { get; set; }

        /// <summary>
        /// Tam adres bilgisi
        /// </summary>
        public string? FullAddress { get; set; }

        /// <summary>
        /// Hesap ile ilgili genel açıklamalar
        /// </summary>
        public string? GeneralInformation { get; set; }

        /// <summary>
        /// Hesaba ait görsel / logo dosya yolu
        /// </summary>
        public string? ImagePath { get; set; }

        /// <summary>
        /// Hesabın aktiflik durumu
        /// </summary>
        public bool IsActive { get; set; }

        /// <summary>
        /// Hesabın tezgahtar (satış personeli) olup olmadığı
        /// </summary>
        public bool IsCashier { get; set; }
    }
}

using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.AccountTypeFeature.Commands.Create
{
    public class CreateAccountTypeCommandRequest : IRequest<ResponseDto<CreateAccountTypeCommandResponse>>
    {
        /// <summary>
        /// Hesap tipi adı
        /// </summary>
        public string AccountTypeName { get; set; } = null!;

        /// <summary>
        /// Bilançoda gösterim sırası
        /// </summary>
        public int BalanceOrder { get; set; }

        /// <summary>
        /// Bilançoda alt hesaplama yapılıp yapılmayacağı
        /// </summary>
        public bool IsSubBalanceCalculated { get; set; }

        /// <summary>
        /// Hesap tipinin aktiflik durumu
        /// </summary>
        public bool IsActive { get; set; }
    }
}

namespace KuyumHesapWeb.Core.Feature.AccountTypeFeature.Queries.GetAll
{
    public class GetAllAccountTypeQueryResponse
    {
        public int Id { get; set; }
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

        /// <summary>
        /// EKLEME TARİHİ
        /// </summary>
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        /// <summary>
        /// GÜNCELLEME TARİHİ
        /// </summary>
        public DateTime? ModifyDate { get; set; }
        /// <summary>
        /// Soft Delete için kullanılan alan
        /// </summary>
        public bool IsDeleted { get; set; } = false;
        /// <summary>
        /// Ekleyen Kullanıcı Id
        /// </summary>
        public int CreatedByUserId { get; set; }
        /// <summary>
        /// Güncelleyen Kullanıcı Id
        /// </summary>
        public int? UpdatedByUserId { get; set; }
    }
}

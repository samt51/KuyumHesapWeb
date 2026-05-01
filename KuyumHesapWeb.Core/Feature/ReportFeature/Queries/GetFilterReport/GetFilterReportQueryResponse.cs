namespace KuyumHesapWeb.Core.Features.ReportFeature.Queries.GetFilterReport
{
    public class GetFilterReportQueryResponse
    {
        public int DetailAccountId { get; set; }
        public string DetailTypeName { get; set; }
        /// <summary>
        /// Cari Hesap Id
        /// </summary>
        public int AccountId { get; set; }
        public string AccountName { get; set; } = null!;
        public string AccountTypeName { get; set; } = null!;

        public decimal? OpenBalanceAmount { get; set; }
        /// <summary>
        /// Fiş (Receipt) kimliği
        /// </summary>
        public int ReceiptId { get; set; }

        /// <summary>
        /// Hareket (Movement) kimliği
        /// </summary>
        public int MovementId { get; set; }

        /// <summary>
        /// İşlem tarihi
        /// </summary>
        public DateTime ReceiptDate { get; set; }

        /// <summary>
        /// İşlem/işlem tipi Id
        /// </summary>
        public int TransactionTypeId { get; set; }

        /// <summary>
        /// İşlem/işlem tipi adı
        /// </summary>
        public string TransactionName { get; set; } = "";

        /// <summary>
        /// Açıklama
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Giriş mi (true = giriş, false = çıkış)
        /// </summary>
        public bool IsEntry { get; set; }

        /// <summary>
        /// Miktar (stok veya döviz cinsinden)
        /// </summary>
        public decimal Quantity { get; set; }

        /// <summary>
        /// Birim kodu / adı
        /// </summary>
        public string Unit { get; set; } = "";

        /// <summary>
        /// Döviz / stok kuru
        /// </summary>
        public decimal ExchangeRate { get; set; }

        /// <summary>
        /// Karşılık miktar (döviz veya miktar)
        /// </summary>
        public decimal? CounterQuantity { get; set; }

        /// <summary>
        /// Karşılık birimi
        /// </summary>
        public string? CounterUnit { get; set; }

        /// <summary>
        /// Karşılık döviz kuru
        /// </summary>
        public decimal? CounterExchangeRate { get; set; }

        /// <summary>
        /// Önceki bakiye (satır işlendiğindeki önceki bakiye)
        /// </summary>
        public decimal OldBalance { get; set; }

        /// <summary>
        /// Sonraki / güncel bakiye (satır işlendiğinden sonra)
        /// </summary>
        public decimal FinalBalance { get; set; }

        /// <summary>
        /// Stok adı
        /// </summary>
        public string? StockName { get; set; }

        /// <summary>
        /// Milyem / ayar oranı
        /// </summary>
        public decimal? MillRate { get; set; }

        /// <summary>
        /// İşçilik tutarı
        /// </summary>
        public decimal? LaborCost { get; set; }

        /// <summary>
        /// İşçilik birimi (örn. adet, saat)
        /// </summary>
        public string? LaborUnit { get; set; }
        /// <summary>
        /// İşçilik adedi
        /// </summary>
        public int? LaborQuantity { get; set; }

        /// <summary>
        /// Mutabakat durumu (true = mutabakat sağlanmış)
        /// </summary>
        public bool IsReconciled { get; set; }

        /// <summary>
        /// Ürünün NET HAS değeri
        /// </summary>
        public decimal? NetProductValue { get; set; }

        /// <summary>
        /// Toplam işçilik tutarı
        /// </summary>
        public decimal? TotalLaborCost { get; set; }

        /// <summary>
        /// Bakiyeye etki eden miktar (view'deki BalanceEffectAmount)
        /// </summary>
        public decimal BalanceEffectAmount { get; set; }

        /// <summary>
        /// Bakiyenin para birimi / birim kodu (ör. HAS, USD)
        /// </summary>
        public string BalanceCurrency { get; set; } = "";

        /// <summary>
        /// Tutar (base currency / BPBR karşılığı gibi): view'deki Tutar_BPBR
        /// </summary>
        public decimal BaseCurrencyAmount { get; set; }

        /// <summary>
        /// Stok birimi (view'deki StockUnit / UnitName)
        /// </summary>
        public string StockUnit { get; set; } = "";
        public int ForeignCurrencyId { get; set; }
    }
}

namespace KuyumHesapWeb.Core.Feature.ReceiptFeature.Dtos
{
    public class GetMovementByCustomerIdResponse
    {
        public int Id { get; set; }
        /// <summary>
        /// Bağlı olduğu fişin kimliği (Foreign Key -> Receipts)
        /// </summary>
        public int ReceiptId { get; set; }


        /// <summary>
        /// Hareket tipi kimliği (Foreign Key -> TransactionTypes)
        /// </summary>
        public int TransactionTypeId { get; set; }
        public string TransactionCode { get; set; } = null!;

        /// <summary>
        /// Hareket tipi adı
        /// </summary>
        public string TransactionName { get; set; } = null!;

        /// <summary>
        /// İşlemin ait olduğu hesap kimliği (Foreign Key -> Accounts)
        /// </summary>
        public int AccountId { get; set; }

        /// <summary>
        /// İşleme konu olan stok kimliği (Foreign Key -> Stocks)
        /// </summary>
        public int? StockId { get; set; }

        /// <summary>
        /// Hareket açıklaması
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Döviz cinsinden işlem tutarı
        /// </summary>
        public decimal? ForeignCurrencyAmount { get; set; }

        /// <summary>
        /// Döviz kimliği (Foreign Key -> Currencies)
        /// </summary>
        public int? ForeignCurrencyId { get; set; }
        public string ForeignCurrencyCode { get; set; } = null!;

        /// <summary>
        /// Döviz kuru
        /// </summary>
        public decimal? ForeignExchangeRate { get; set; }

        /// <summary>
        /// Karşılık döviz tutarı
        /// </summary>
        public decimal? CounterCurrencyAmount { get; set; }

        /// <summary>
        /// Karşılık döviz kimliği (Foreign Key -> Currencies)
        /// </summary>
        public int? CounterCurrencyId { get; set; }
        public string CounterCurrencyCode { get; set; } = null!;

        /// <summary>
        /// Karşılık döviz kuru
        /// </summary>
        public decimal? CounterExchangeRate { get; set; }

        /// <summary>
        /// Baz para birimi cinsinden toplam tutar
        /// </summary>
        public decimal BaseCurrencyAmount { get; set; }

        /// <summary>
        /// Baz para birimi cinsinden maliyet
        /// </summary>
        public decimal? CostAmount { get; set; }

        /// <summary>
        /// Baz para birimi cinsinden kar tutarı
        /// </summary>
        public decimal? ProfitAmount { get; set; }

        /// <summary>
        /// Karşı hareketin kimliği (aynı fişteki ters kayıt)
        /// </summary>
        public int? CounterTransactionId { get; set; }

        /// <summary>
        /// Ürün veya hizmet miktarı
        /// </summary>
        public decimal? Quantity { get; set; }

        /// <summary>
        /// Milyem oranı
        /// </summary>
        public decimal? MillRate { get; set; }

        /// <summary>
        /// İşçilik birim bedeli
        /// </summary>
        public decimal? LaborCost { get; set; }

        /// <summary>
        /// İşçilik birimi (saat, adet vb.)
        /// </summary>
        public string? LaborUnit { get; set; }

        /// <summary>
        /// İşçilik adedi
        /// </summary>
        public int? LaborQuantity { get; set; }

        /// <summary>
        /// İşçiliğin tutara dahil olup olmadığı
        /// </summary>
        public bool? IsLaborIncluded { get; set; }

        /// <summary>
        /// Mutabakat durumu
        /// </summary>
        public bool? IsReconciled { get; set; }

        /// <summary>
        /// Ürünün has (saf) değeri
        /// </summary>
        public decimal? NetProductValue { get; set; }

        /// <summary>
        /// Toplam işçilik tutarı
        /// </summary>
        public decimal? TotalLaborCost { get; set; }
    }
}

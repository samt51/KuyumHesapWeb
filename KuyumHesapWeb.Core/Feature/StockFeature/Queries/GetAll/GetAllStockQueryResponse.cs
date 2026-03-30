namespace KuyumHesapWeb.Core.Feature.StockFeature.Queries.GetAll
{
    public class GetAllStockQueryResponse
    {
        public int Id { get; set; }
        public string StockName { get; set; } = null!;
        public int StockTypeId { get; set; }
        public string StockTypeName { get; set; } = null!;
        public int StockGroupId { get; set; }
        public string StockGroupName { get; set; } = null!;
        public string UnitName { get; set; } = null!;
        public int StockUnitId { get; set; }
        public int LaborUnitId { get; set; }
        // Burayı string yaptık — Currency.CurrencyCode gelecek
        public string LaborUnit { get; set; } = string.Empty;
        public decimal MillRate { get; set; }
        public bool IsActive { get; set; }
    }
}

namespace KuyumHesapWeb.Core.Feature.StockFeature.Queries.GetStockByTypeId
{
    public class GetStockByTypeIdQueryResponse
    {
        public int Id { get; set; }
        public string StockName { get; set; } = string.Empty;
        public decimal MillRate { get; set; }
        public string UnitName { get; set; } = string.Empty;
    }
}

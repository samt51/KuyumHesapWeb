using KuyumHesapWeb.Core.Feature.ProductTypeFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.StockFeature.Queries.GetStockByTypeId;
using KuyumHesapWeb.Core.Feature.StockGroupFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.StockTypeFeature.Queries.GetStockTypeByIdGroupId;
using KuyumHesapWeb.Core.Feature.ToptancilarFeature.Queries.GetAll;
using System.Text.Json.Serialization;

namespace KuyumHesapWeb.Core.Feature.BarcodeFeature.GetAllMain
{
    public class GetAllMainQueryResponse
    {
        [JsonPropertyName("getStockGroupQueries")]
        public List<GetAllStockGroupQueryResponse> getStockGroupQueries { get; set; }
        [JsonPropertyName("getStockTypeQueries")]
        public List<GetStockTypeByIdGroupIdQueryResponse> getStockTypeQueries { get; set; }
        [JsonPropertyName("getStockQueries")]
        public List<GetStockByTypeIdQueryResponse> getStockQueries { get; set; }
        [JsonPropertyName("getProductTypeQueries")]
        public List<GetAllProductTypeQueryResponse> getProductTypeQueries { get; set; }
        [JsonPropertyName("getPackerQueryResponses")]
        public List<GetAllToptancilarQueryResponse> getPackerQueryResponses { get; set; }
    }
}

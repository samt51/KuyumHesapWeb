
using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.ReportFeature.Dtos.Enums;
using MediatR;

namespace KuyumHesapWeb.Core.Features.ReportFeature.Queries.GetFilterReport
{
    public class GetFilterReportQueryRequest : IRequest<ResponseDto<List<GetFilterReportQueryResponse>>>
    {
        /// <summary>
        /// Filter tipini gönderecek 1.Finansal 2.Stock
        /// </summary>
        public FilterEnum FilterType { get; set; }
        /// <summary>
        ///Kasa Rapor Bölümündeki Tür Id'si. 1: Kasa Türü, 2: Banka Türü, 3: Pos Türü, 4: Stok Türü
        /// </summary>
        public int TypeId { get; set; }
        /// <summary>
        /// Eğer Type FinansalÖzetten biri seçili ise hangisini görecekse o seçili olacak 1.Kasa Türü, 2. Banka Türü, 3. Pos Türü 
        /// </summary>
        public int? TypeValueId { get; set; }
        /// <summary>
        /// Para Biri Id
        /// </summary>
        public int[]? CurrencyId { get; set; }
        /// <summary>
        /// Ürün StockId Id
        /// </summary>
        public int ProductId { get; set; }
        /// <summary>
        /// Filter Başlanguç ve Bitiş Tarihi    bir önceki gün kapanış 23:59 :59 olarak başlayacak ve seçilen bitiş tarihine kadar olan hareketleri göstermek için kullanılacak.
        /// </summary>
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

    }
}

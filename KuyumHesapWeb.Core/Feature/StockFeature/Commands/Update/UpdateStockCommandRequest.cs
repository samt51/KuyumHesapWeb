using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockFeature.Commands.Update
{
    public class UpdateStockCommandRequest : IRequest<ResponseDto<UpdateStockCommandResponse>>
    {
        public int Id { get; set; }
        /// <summary>
        /// Stok adı
        /// </summary>
        public string StockName { get; set; } = null!;

        /// <summary>
        /// Stok tipi kimliği (Foreign Key -> StockTypes)
        /// </summary>
        public int StockTypeId { get; set; }

        /// <summary>
        /// Stok grup kimliği (Foreign Key -> StockGroups)
        /// </summary>
        public int GroupId { get; set; }

        /// <summary>
        /// Stok birimi adı (adet, gram, kg vb.)
        /// </summary>
        public string UnitName { get; set; } = null!;

        /// <summary>
        /// Stok birimi kimliği
        /// </summary>
        public int StockUnitId { get; set; }

        /// <summary>
        /// İşçilik birimi kimliği
        /// </summary>
        public int LaborUnitId { get; set; }

        /// <summary>
        /// Ürünün milyem değeri
        /// </summary>
        public decimal MillRate { get; set; }

        /// <summary>
        /// Stok aktiflik durumu
        /// </summary>
        public bool IsActive { get; set; }
    }
}

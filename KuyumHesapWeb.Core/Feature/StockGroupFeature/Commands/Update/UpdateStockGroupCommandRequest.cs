using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockGroupFeature.Commands.Update
{
    public class UpdateStockGroupCommandRequest : IRequest<ResponseDto<UpdateStockGroupCommandResponse>>
    {
        public int Id { get; set; }
        public string StockGroupName { get; set; }
    }
}

using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockGroupFeature.Commands.Create
{
    public class CreateStockGroupCommandRequest : IRequest<ResponseDto<CreateStockGroupCommandResponse>>
    {
        public int Id { get; set; }
        public string StockGroupName { get; set; } = null!;
    }
}

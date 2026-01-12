using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ProductTypeFeature.Commands.Update
{
    public class UpdateProductTypeCommandRequest : IRequest<ResponseDto<UpdateProductTypeCommandResponse>>
    {
        public int Id { get; set; }
        public string ProductTypeName { get; set; } = null!;
    }
}

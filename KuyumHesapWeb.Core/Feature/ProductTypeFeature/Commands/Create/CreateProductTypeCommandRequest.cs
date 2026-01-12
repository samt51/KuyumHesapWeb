using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ProductTypeFeature.Commands.Create
{
    public class CreateProductTypeCommandRequest : IRequest<ResponseDto<CreateProductTypeCommandResponse>>
    {
        public string ProductTypeName { get; set; } = null!;
    }
}

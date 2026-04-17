using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MenuFeature.Commands.Create
{
    public class CreateMenuCommandRequest : IRequest<ResponseDto<CreateMenuCommandResponse>>
    {
        public string? Name { get; set; }
        public string? Code { get; set; }
        public string? Url { get; set; }
        public string? IconUrl { get; set; }
        public int? ParentId { get; set; }
        public int? OrderNo { get; set; }
        public string? RequiredPermissionCode { get; set; }
    }
}

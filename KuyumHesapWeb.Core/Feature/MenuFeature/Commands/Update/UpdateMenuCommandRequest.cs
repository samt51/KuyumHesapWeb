using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MenuFeature.Commands.Update
{
    public class UpdateMenuCommandRequest : IRequest<ResponseDto<UpdateMenuCommandResponse>>
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Code { get; set; }
        public string? Url { get; set; }
        public string IconUrl { get; set; } = string.Empty;
        public int? ParentId { get; set; }
        public int? OrderNo { get; set; }
        public string? RequiredPermissionCode { get; set; }
        public bool IsActive { get; set; } = true;
    }
}

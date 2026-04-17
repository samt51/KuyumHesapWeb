using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PageActionFeature.Commands.Create
{
    public class CreatePageActionCommandRequest : IRequest<ResponseDto<CreatePageActionCommandResponse>>
    {
        public string? Name { get; set; }
        public string? Code { get; set; }
        public string? PageCode { get; set; }
        public string? IconUrl { get; set; }
        public int? OrderNo { get; set; }
        public string? RequiredPermissionCode { get; set; }
    }
}

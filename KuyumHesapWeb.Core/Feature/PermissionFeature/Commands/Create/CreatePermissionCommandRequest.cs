using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.Create
{
    public class CreatePermissionCommandRequest : IRequest<ResponseDto<CreatePermissionCommandResponse>>
    {
        public string? Name { get; set; }
        public string? Code { get; set; }
        public string? Description { get; set; }
        public int? MenuId { get; set; }
        public bool IsActive { get; set; } = true;
    }
}

using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MenuFeature.Commands.UpdateMenuIsActive
{
    public class UpdateMenuIsActiveCommandRequest : IRequest<ResponseDto<UpdateMenuIsActiveCommandResponse>>
    {
        public int Id { get; set; }
        public bool IsActive { get; set; }
    }
}

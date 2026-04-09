using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.UserFeature.Commands.Roles.Create
{
    public class CreateRolesCommandRequest : IRequest<ResponseDto<CreateRolesCommandResponse>>
    {
        public string Name { get; set; }
    }
}

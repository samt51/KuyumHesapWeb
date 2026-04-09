using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.UserFeature.Commands.Roles.Update
{
    public class UpdateRolesCommandRequest : IRequest<ResponseDto<UpdateRolesCommandResponse>>
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}

using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.Delete
{
    public class DeletePermissionCommandRequest : IRequest<ResponseDto<DeletePermissionCommandResponse>>
    {
        public DeletePermissionCommandRequest(int id)
        {
            Id = id;
        }

        public int Id { get; }
    }
}

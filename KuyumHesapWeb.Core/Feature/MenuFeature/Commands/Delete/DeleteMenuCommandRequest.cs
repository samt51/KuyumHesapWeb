using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MenuFeature.Commands.Delete
{
    public class DeleteMenuCommandRequest : IRequest<ResponseDto<DeleteMenuCommandResponse>>
    {
        public DeleteMenuCommandRequest(int id)
        {
            Id = id;
        }

        public int Id { get; }
    }
}

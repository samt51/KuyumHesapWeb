using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PageActionFeature.Commands.Delete
{
    public class DeletePageActionCommandRequest : IRequest<ResponseDto<DeletePageActionCommandResponse>>
    {
        public DeletePageActionCommandRequest(int id)
        {
            Id = id;
        }

        public int Id { get; }
    }
}

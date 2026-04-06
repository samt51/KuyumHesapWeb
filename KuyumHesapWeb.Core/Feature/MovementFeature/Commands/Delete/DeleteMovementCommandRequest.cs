using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MovementFeature.Commands.Delete
{
    public class DeleteMovementCommandRequest : IRequest<ResponseDto<DeleteMovementCommandResponse>>
    {
        public int MovementId { get; set; }
        public DeleteMovementCommandRequest(int movementId)
        {
            MovementId = movementId;
        }
    }
}

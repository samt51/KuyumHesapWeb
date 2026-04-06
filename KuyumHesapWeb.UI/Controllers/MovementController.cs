using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.MovementFeature.Commands.Delete;
using KuyumHesapWeb.UI.Controllers.BaseCont;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{
    public class MovementController : BaseController
    {
        private readonly IMediator _mediator;
        public MovementController(IMediator mediator, IMapper mapper) : base(mediator, mapper)
        {
            _mediator = mediator;
        }

        [HttpDelete("{movementId}")]
        public async Task<ResponseDto<DeleteMovementCommandResponse>> DeleteAsync(int movementId, CancellationToken token)
        {
            var data = await _mediator.Send(new DeleteMovementCommandRequest(movementId), token);
            return data;
        }
    }
}

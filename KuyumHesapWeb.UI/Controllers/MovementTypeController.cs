using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Feature.MovementTypeFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.MovementTypeFeature.Dtos;
using KuyumHesapWeb.Core.Feature.MovementTypeFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.MovementTypeFeature.Queries.GetById;
using KuyumHesapWeb.UI.Controllers.BaseCont;
using MediatR;
using Microsoft.AspNetCore.Mvc;


namespace KuyumHesapWeb.UI.Controllers
{
    public class MovementTypeController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        public MovementTypeController(IMediator mediator, IMapper mapper)
            : base(mediator, mapper)
        {
            _mapper = mapper;
            _mediator = mediator;
        }
        public async Task<IActionResult> Index()
        {
            var data = await _mediator.Send(new GetAllMovementTypeQueryRequest());
            return View(data.data);
        }
        public async Task<IActionResult> Create()
        {
            var data = await _mediator.Send(new GetAllMovementTypeQueryRequest());
            return View(new CreateAndGetAllMovementTypeResponse
            {
                CreateMovementTypeCommandRequest = new(),
                getAllMovementTypeQueryResponses = data.data
            });
        }
        public async Task<IActionResult> Update(int id)
        {
            var data = await _mediator.Send(new GetAllMovementTypeQueryRequest());

            var datagetById = await _mediator.Send(new GetByIdMovementTypeQueryRequest(id));

            var map = _mapper.Map<UpdateMovementTypeCommandRequest, GetByIdMovementTypeQueryResponse>(datagetById.data);
            return View(new CreateAndGetAllMovementTypeResponse
            {
                UpdateMovementTypeCommandRequest = map,
                getAllMovementTypeQueryResponses = data.data
            });
        }
        [HttpPut]
        public async Task<IActionResult> Update(CreateAndGetAllMovementTypeResponse request)
        {
            var data = await _mediator.Send(request.UpdateMovementTypeCommandRequest);

            return RedirectToAction("Index");
        }
    }
}

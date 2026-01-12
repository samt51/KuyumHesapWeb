using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Feature.UserFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.UserFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.UserFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.UserFeature.Queries.GetById;
using KuyumHesapWeb.UI.Controllers.BaseCont;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{
    public class UserController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        public UserController(IMediator mediator, IMapper mapper) : base(mediator, mapper)
        {
            _mapper = mapper;
            _mediator = mediator;
        }

        public async Task<IActionResult> Index()
        {
            var data = await _mediator.Send(new GetAllUserQueryRequest());
            return View(data.data);
        }
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Create(CreateUserCommandRequest request)
        {
            var data = await _mediator.Send(request);
            return RedirectToAction("Index");
        }
        public async Task<IActionResult> Update(int id)
        {
            var data = await _mediator.Send(new GetByIdUserQueryRequest(id));

            var map = _mapper.Map<UpdateUserCommandRequest, GetByIdUserQueryResponse>(data.data);

            return View(map);
        }
        [HttpPost]
        public async Task<IActionResult> Update(UpdateUserCommandRequest request)
        {
            var data = await _mediator.Send(request);

            return RedirectToAction("Index");
        }
    }
}

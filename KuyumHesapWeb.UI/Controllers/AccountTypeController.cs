using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Feature.AccountTypeFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.AccountTypeFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.AccountTypeFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.AccountTypeFeature.Queries.GetById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{
    public class AccountTypeController : Controller
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public AccountTypeController(IMapper mapper, IMediator mediator)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        public async Task<IActionResult> Index()
        {
            var data = await _mediator.Send(new GetAllAccountTypeQueryRequest());
            return View(data.data);
        }
        public Task<IActionResult> Create()
        {
            return Task.FromResult<IActionResult>(View());
        }
        [HttpPost]
        public async Task<IActionResult> Create(CreateAccountTypeCommandRequest request)
        {
            var data = await _mediator.Send(request);
            return View(data);
        }
        public async Task<IActionResult> Update(int id)
        {
            var data = await _mediator.Send(new GetByIdAccountTypeQueryRequest(id));
            return View(data.data);
        }
        [HttpPost]
        public async Task<IActionResult> Update(GetByIdAccountTypeQueryResponse request)
        {
            var map = _mapper.Map<UpdateAccountTypeCommandRequest, GetByIdAccountTypeQueryResponse>(request);

            var result = await _mediator.Send(map);

            return RedirectToAction("Index");
        }
    }
}

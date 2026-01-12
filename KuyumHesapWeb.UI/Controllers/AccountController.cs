using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Feature.AccountFeature.Command.Create;
using KuyumHesapWeb.Core.Feature.AccountFeature.Command.Update;
using KuyumHesapWeb.Core.Feature.AccountFeature.Dtos;
using KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetById;
using KuyumHesapWeb.Core.Feature.AccountTypeFeature.Queries.GetAll;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{
    public class AccountController : Controller
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        public AccountController(IMediator mediator, IMapper mapper)
        {
            this._mediator = mediator;
            this._mapper = mapper;
        }
        [HttpPost]
        public async Task<IActionResult> Create(CreateAccountCommandRequestDto request)
        {
            var data = await _mediator.Send(request);
            return View(data.data);
        }
        [HttpGet]
        public async Task<IActionResult> Create()
        {
            var data = await _mediator.Send(new GetAllAccountTypeQueryRequest());
            var accountData = await _mediator.Send(new GetAllAccountQueryRequest());
            return View(new CreateAccountCommandRequestDto { AccountTypeResponses = data.data, getAllAccountQueries = accountData.data });
        }
        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var accountData = await _mediator.Send(new GetAllAccountQueryRequest());
            return View(accountData.data);
        }
        [HttpGet]
        public async Task<IActionResult> Update(int id)
        {
            var data = await _mediator.Send(new GetAllAccountTypeQueryRequest());
            var accountData = await _mediator.Send(new GetByIdAccountQueryRequest(id));
            return View(new GetByIdAccountAndAccountTypeResponseDto { GetByIdAccountQueryResponse = accountData.data, GetAllAccountTypeQueryResponses = data.data });
        }
        [HttpPost]
        public async Task<IActionResult> Update(GetByIdAccountAndAccountTypeResponseDto request)
        {
            var req = _mapper.Map<UpdateAccountCommandRequest, GetByIdAccountQueryResponse>(request.GetByIdAccountQueryResponse);
            var accountData = await _mediator.Send(req);
            return RedirectToAction("Index");
        }
    }
}

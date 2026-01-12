using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.ExchangeFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.ExchangeFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.ExchangeFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.ExchangeFeature.Queries.GetById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{
    public class ExchangeController : Controller
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public ExchangeController(IMapper mapper, IMediator mediator)
        {
            _mapper = mapper;
            _mediator = mediator;
        }

        public async Task<IActionResult> Index()
        {
            var data = await _mediator.Send(new GetAllExchangeQueryRequest());
            return View(data.data);
        }
        public async Task<IActionResult> Create()
        {
            var getCurrencyData = await _mediator.Send(new GetAllCurrencyQueryRequest());

            return View(new CreateExchangeCommandRequestDto
            {
                getAllCurrencyQueries = getCurrencyData.data
            });
        }
        [HttpPost]
        public async Task<IActionResult> Create(CreateExchangeCommandRequestDto request)
        {
            var data = await _mediator.Send(request.CreateExchangeCommandRequest);
            return RedirectToAction("Index");
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> Update(int id)
        {
            var getCurrencyData = await _mediator.Send(new GetAllCurrencyQueryRequest());
            var data = await _mediator.Send(new GetByIdExchangeQueryRequest(id));

            return View(new GetByIdExchangeResponseDto
            {
                GetAllCurrencyQueryResponses = getCurrencyData.data,
                GetByIdExchangeQueryResponse = data.data
            });
        }
        [HttpPost]
        public async Task<IActionResult> Update(GetByIdExchangeResponseDto request)
        {
            var map = _mapper.Map<UpdateExchangeCommandRequest, GetByIdExchangeQueryResponse>(request.GetByIdExchangeQueryResponse);
            map.CurrencyId = request.CurrencyId;

            var data = await _mediator.Send(map);

            return RedirectToAction("Index");
        }
    }
}

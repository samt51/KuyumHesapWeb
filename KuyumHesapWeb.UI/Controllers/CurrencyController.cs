using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetById;
using KuyumHesapWeb.Core.Feature.ExchangeFeature.Commands.Update;
using KuyumHesapWeb.UI.Controllers.BaseCont;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{
    public class CurrencyController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        public CurrencyController(IMediator mediator, IMapper mapper) : base(mediator, mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        public async Task<IActionResult> Index()
        {
            var data = await _mediator.Send(new GetAllCurrencyQueryRequest());
            return View(data.data);
        }
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Create(CreateCurrencyCommandRequest request)
        {
            var data = await _mediator.Send(request);

            return RedirectToAction("Index");
        }
        public async Task<IActionResult> Update(int id)
        {
            var data = await _mediator.Send(new GetByIdCurrencyQueryRequest(id));

            return View(data.data);
        }
        [HttpPut]
        public async Task<IActionResult> Update(UpdateExchangeCommandRequest request)
        {
            var data = await _mediator.Send(request);
            return RedirectToAction("Index");
        }
    }
}

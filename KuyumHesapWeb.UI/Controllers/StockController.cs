using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.StockFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.StockFeature.Commands.Dtos;
using KuyumHesapWeb.Core.Feature.StockFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.StockFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.StockFeature.Queries.GetById;
using KuyumHesapWeb.Core.Feature.StockTypeFeature.Queries.GetAll;
using KuyumHesapWeb.UI.Controllers.BaseCont;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{
    public class StockController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        public StockController(IMediator mediator, IMapper mapper)
            : base(mediator, mapper)
        {
            _mapper = mapper;
            _mediator = mediator;
        }

        public async Task<IActionResult> Index()
        {
            var data = await _mediator.Send(new GetAllStockQueryRequest());
            return View(data.data);
        }
        public async Task<IActionResult> Create()
        {
            var stockTypes = await _mediator.Send(new GetAllStockTypeQueryRequest());
            var currency = await _mediator.Send(new GetAllCurrencyQueryRequest());
            return View(new StockForGetStockTypeResponseDto
            {
                getAllStockTypeQueryResponses = stockTypes.data,
                CreateStockCommandRequest = new(),
                CurrencyQueryResponses = currency.data
            });
        }
        [HttpPost]
        public async Task<IActionResult> Create(StockForGetStockTypeResponseDto request)
        {
            await _mediator.Send(request.CreateStockCommandRequest);

            return RedirectToAction("Index");
        }
        public async Task<IActionResult> Update(int id)
        {
            var data = await _mediator.Send(new GetByIdStockQueryRequest(id));
            var stockTypes = await _mediator.Send(new GetAllStockTypeQueryRequest());
            var map = _mapper.Map<UpdateStockCommandRequest, GetByIdStockQueryResponse>(data.data);
            return View(new StockForGetStockTypeResponseDto
            {
                getAllStockTypeQueryResponses = stockTypes.data,
                UpdateStockCommandRequest = map
            });
        }
        [HttpPost]
        public async Task<IActionResult> Update(UpdateStockCommandRequest request)
        {
            await _mediator.Send(request);
            return RedirectToAction("Index");
        }

    }
}

using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.StockGroupFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.StockTypeFeature.Commands.Dtos;
using KuyumHesapWeb.Core.Feature.StockTypeFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.StockTypeFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.StockTypeFeature.Queries.GetById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{
    public class StockTypeController : Controller
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        public StockTypeController(IMediator mediator, IMapper mapper)
        {
            _mapper = mapper;
            _mediator = mediator;
        }
        public async Task<IActionResult> Index()
        {
            var data = await _mediator.Send(new GetAllStockTypeQueryRequest());
            return View(data.data);
        }
        public async Task<IActionResult> Create()
        {
            var stockGroups = await _mediator.Send(new GetAllStockGroupQueryRequest());

            var currencyList = await _mediator.Send(new GetAllCurrencyQueryRequest());
            return View(new CreateStockTypeForCurrencyAndStockGroupResponse
            {
                getAllStockGroupQueryResponses = stockGroups.data,
                getAllCurrencyQueryResponses = currencyList.data,
                createStockTypeCommandRequest = new()
            });
        }
        public async Task<IActionResult> Update(int id)
        {
            var stockGroups = await _mediator.Send(new GetAllStockGroupQueryRequest());

            var currencyList = await _mediator.Send(new GetAllCurrencyQueryRequest());

            var data = await _mediator.Send(new GetByIdStockTypeQueryRequest(id));

            return View(new CreateStockTypeForCurrencyAndStockGroupResponse
            {
                getAllStockGroupQueryResponses = stockGroups.data,
                getAllCurrencyQueryResponses = currencyList.data,
                GetByIdStockTypeQueryResponse = data.data
            });
        }
        [HttpPost]
        public async Task<IActionResult> Update(GetByIdStockTypeQueryResponse request)
        {
            var requestUpdate = _mapper.Map<UpdateStockTypeCommandRequest>(request);

            var data = await _mediator.Send(requestUpdate);

            return RedirectToAction("Index");
        }
        [HttpGet]
        public async Task<IActionResult> GetGroupAndCurrencyCode(int stockTypeId)
        {
            var data = await _mediator.Send(new GetByIdStockTypeQueryRequest(stockTypeId));

            var response = new StockGroupAndCode
            {
                StockUnitId = data.data.Currency.Id,
                GroupId = data.data.StockGroup.Id,
                CurrencyCode = data.data.Currency.CurrencyCode,
                GroupName = data.data.StockGroup.StockGroupName
            };
            return Json(response);
        }
        public class StockGroupAndCode
        {
            public int GroupId { get; set; }
            public string GroupName { get; set; }

            public int StockUnitId { get; set; }
            public string CurrencyCode { get; set; }
        }
    }
}

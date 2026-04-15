using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.StockGroupFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.StockTypeFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.StockTypeFeature.Commands.Dtos;
using KuyumHesapWeb.Core.Feature.StockTypeFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.StockTypeFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.StockTypeFeature.Queries.GetById;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using KuyumHesapWeb.UI.Controllers.BaseCont;

namespace KuyumHesapWeb.UI.Controllers
{
    public class StockTypeController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        public StockTypeController(IMediator mediator, IMapper mapper)
            : base(mediator, mapper)
        {
            _mapper = mapper;
            _mediator = mediator;
        }
        public async Task<IActionResult> Index()
        {
            return View();
        }
        [HttpGet]
        public async Task<ResponseDto<List<GetAllStockTypeQueryResponse>>> GetAll()
        {
            return await _mediator.Send(new GetAllStockTypeQueryRequest());
        }
        [HttpGet]
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

        [HttpPost("Create")]
        public async Task<ResponseDto<CreateStockTypeCommandResponse>> Create([FromBody] CreateStockTypeCommandRequest request)
        {
            var data = await _mediator.Send(request);
            return data;
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
        [HttpPut("Update")]
        public async Task<ResponseDto<UpdateStockTypeCommandResponse>> Update([FromBody] UpdateStockTypeCommandRequest request)
        {
            var data = await _mediator.Send(request);
            return data;
        }

        [HttpGet]
        public async Task<ResponseDto<GetByIdStockTypeQueryResponse>> GetById(int id)
        {
            return await _mediator.Send(new GetByIdStockTypeQueryRequest(id));
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

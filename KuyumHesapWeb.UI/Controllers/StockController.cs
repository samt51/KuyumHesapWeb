using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Commond.Models;
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

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            return View();
        }
        [HttpGet]
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
        [HttpGet]
        public async Task<ResponseDto<List<GetAllStockQueryResponse>>> GetAll()
        {
            return await _mediator.Send(new GetAllStockQueryRequest());
        }

        [HttpGet]
        public async Task<ResponseDto<GetByIdStockQueryResponse>> GetById(int id)
        {
            return await _mediator.Send(new GetByIdStockQueryRequest(id));
        }

        [HttpPost]
        public async Task<ResponseDto<CreateStockCommandResponse>> Create([FromBody] CreateStockCommandRequest request)
        {
            var data = await _mediator.Send(request);
            return data;
        }
        [HttpGet]
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
        [HttpPut]
        public async Task<ResponseDto<UpdateStockCommandResponse>> Update([FromBody] UpdateStockCommandRequest request)
        {
            var data = await _mediator.Send(request);
            return data;
        }

    }
}

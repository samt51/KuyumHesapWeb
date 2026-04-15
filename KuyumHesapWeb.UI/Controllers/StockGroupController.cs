using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.StockGroupFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.StockGroupFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.StockGroupFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.StockGroupFeature.Queries.GetById;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using KuyumHesapWeb.UI.Controllers.BaseCont;

namespace KuyumHesapWeb.UI.Controllers
{
    public class StockGroupController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        public StockGroupController(IMediator mediator, IMapper mapper)
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
        public IActionResult Create()
        {
            return View();
        }
        [HttpGet]
        public async Task<ResponseDto<List<GetAllStockGroupQueryResponse>>> GetAll()
        {
            return await _mediator.Send(new GetAllStockGroupQueryRequest());
        }
        [HttpPost]
        public async Task<ResponseDto<CreateStockGroupCommandResponse>> Create([FromBody] CreateStockGroupCommandRequest request)
        {
            var data = await _mediator.Send(request);
            return data;
        }
        [HttpPut("Update")]
        public async Task<ResponseDto<UpdateStockGroupCommandResponse>> Update([FromBody] UpdateStockGroupCommandRequest request)
        {
            var data = await _mediator.Send(request);
            return data;
        }

        [HttpGet]
        public async Task<ResponseDto<GetByIdStockGroupQueryResponse>> GetById(int id)
        {
            return await _mediator.Send(new GetByIdStockGroupQueryRequest(id));
        }
    }
}

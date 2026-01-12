using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Feature.StockGroupFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.StockGroupFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.StockGroupFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.StockGroupFeature.Queries.GetById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{
    public class StockGroupController : Controller
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        public StockGroupController(IMediator mediator, IMapper mapper)
        {
            _mapper = mapper;
            _mediator = mediator;
        }
        public async Task<IActionResult> Index()
        {
            var data = await _mediator.Send(new GetAllStockGroupQueryRequest());
            return View(data.data);
        }
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Create(CreateStockGroupCommandRequest request)
        {
            var data = await _mediator.Send(request);
            return RedirectToAction("Index");
        }
        public async Task<IActionResult> Update(int id)
        {
            var data = await _mediator.Send(new GetByIdStockGroupQueryRequest(id));

            var map = _mapper.Map<UpdateStockGroupCommandRequest, GetByIdStockGroupQueryResponse>(data.data);
            return View(map);
        }
        [HttpPost]
        public async Task<IActionResult> Update(UpdateStockGroupCommandRequest request)
        {
            var data = await _mediator.Send(request);

            return RedirectToAction("Index");
        }
    }
}

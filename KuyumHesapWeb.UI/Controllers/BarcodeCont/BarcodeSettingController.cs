using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Feature.BarcodeSettingFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.BarcodeSettingFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.BarcodeSettingFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.BarcodeSettingFeature.Queries.GetById;
using KuyumHesapWeb.UI.Controllers.BaseCont;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers.BarcodeCont
{
    public class BarcodeSettingController : BaseController
    {
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;
        public BarcodeSettingController(IMediator mediator, IMapper mapper) : base(mediator, mapper)
        {
            this._mapper = mapper;
            this._mediator = mediator;
        }
        public async Task<IActionResult> Index()
        {
            var data = await _mediator.Send(new GetAllBarcodeHeaderQueryRequest());
            return View(data.data);
        }
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Create(CreateBarcodeSettingCommandRequest request)
        {
            var data = await _mediator.Send(request);

            return RedirectToAction("Index");
        }
        [HttpGet]
        public async Task<IActionResult> Update(int id)
        {
            var data = await _mediator.Send(new GetByIdBarcodeSettingQueryRequest(id));
            return View(data);
        }
        [HttpPost]
        public async Task<IActionResult> Update(UpdateBarcodeSettingCommandRequest request)
        {
            var data = await _mediator.Send(request);

            return RedirectToAction("Index");
        }
    }
}

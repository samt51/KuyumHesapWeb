using KuyumHesapWeb.Core.Feature.BarcodeFeature.GetAllMain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers.BarcodeCont
{
    public class BarcodeController : Controller
    {
        private readonly IMediator _mediator;

        public BarcodeController(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<IActionResult> Index()
        {
            var rsp = await _mediator.Send(new GetAllMainQueryRequest());
            return View(rsp.data);
        }
    }
}

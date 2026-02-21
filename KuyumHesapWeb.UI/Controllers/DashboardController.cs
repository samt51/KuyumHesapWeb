using KuyumHesapWeb.Core.Feature.DashboardFeature.Queries.GetAllDashboard;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{

    public class DashboardController : Controller
    {
        private readonly IMediator _mediator;

        public DashboardController(IMediator mediator)
        {
            _mediator = mediator;
        }

        public async Task<IActionResult> IndexDashboard()
        {
            var data = await _mediator.Send(new GetAllDashboardQueryRequest());
            return View(data.data);
        }
        public Task<IActionResult> Index()
        {
            return Task.FromResult<IActionResult>(View());
        }
    }
}

using KuyumHesapWeb.Core.Commond.Models.Dtos;
using KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetAll;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{
    public class SellAndCariController : Controller
    {
        private readonly IMediator _mediator;
        public SellAndCariController(IMediator mediator)
        {
            this._mediator = mediator;
        }
        public async Task<IActionResult> Index(CancellationToken token)
        {
            var data = await _mediator.Send(new GetAllAccountQueryRequest { AccountTypeName = string.Empty }, token);

            var currencyData = await _mediator.Send(new GetAllCurrencyQueryRequest(), token);

            return View(new GetAllAccountResponseDto
            {
                getAllAccountQueryResponses = data.data,
                getAllCurrencyQueryResponses = currencyData.data
            });
        }
    }
}

using KuyumHesapWeb.Core.Commond.Models.Dtos;
using KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Commands.Create;
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

            var accounts = data?.data ?? new List<GetAllAccountQueryResponse>();
            var currencies = currencyData?.data ?? new List<GetAllCurrencyQueryResponse>();

            // Default account seçimi:
            // 1) Aktif ve Tezgahtar olmayan hesap
            // 2) Aktif hesap
            // 3) İlk hesap (varsa)
            var preferredAccount = accounts
                .FirstOrDefault(a => a.AccountId == 2);


            // Varsayılan currencyCode: önce base currency, sonra national, sonra ilk gelen
            var preferredCurrency = currencies
                .FirstOrDefault(c => c.CurrencyCode == "TRY");

            var defaultRequest = new CreateReceiptCommandRequest
            {
                CurrentAccountId = preferredAccount?.AccountId ?? 0,
                ReceiptDate = DateTime.Now,
                CurrencyCode = preferredCurrency?.CurrencyCode ?? "TRY"
            };

            return View(new GetAllAccountResponseDto
            {
                getAllAccountQueryResponses = accounts,
                getAllCurrencyQueryResponses = currencies,
                createReceiptCommandRequest = defaultRequest
            });
        }
    }
}

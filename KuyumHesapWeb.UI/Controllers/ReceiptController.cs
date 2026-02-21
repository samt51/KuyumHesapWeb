using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Commond.Models.Dtos;
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Dtos;
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetEkstreByCustomer;
using KuyumHesapWeb.UI.Controllers.BaseCont;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{
    public class ReceiptController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        public ReceiptController(IMediator mediator, IMapper mapper) : base(mediator, mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Create(CreateReceiptViewModel vm)
        {
            if (string.IsNullOrWhiteSpace(vm.MovementsJson))
            {
                ModelState.AddModelError("", "Fiş hareketleri boş.");
                return Redirect("SellAndCari/Index");
            }

            List<CreateMovementReceiptRequestDto>? movements;
            try
            {
                movements = System.Text.Json.JsonSerializer.Deserialize<List<CreateMovementReceiptRequestDto>>(
                    vm.MovementsJson,
                    new System.Text.Json.JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });
            }
            catch
            {
                ModelState.AddModelError("", "Fiş hareketleri okunamadı (JSON parse hatası).");
                return View(vm);
            }

            if (movements == null || movements.Count == 0)
            {
                ModelState.AddModelError("", "Fiş hareketleri boş.");
                return View(vm);
            }

            var request = new CreateReceiptCommandRequest
            {
                ReceiptNumber = vm.ReceiptNumber,
                ReceiptDate = vm.ReceiptDate,
                CurrentAccountId = vm.CurrentAccountId,
                EmployeeId = vm.EmployeeId,
                Description = vm.Description,
                IsCustomerReceipt = vm.IsCustomerReceipt,
                CurrencyCode = vm.CurrencyCode,
                OpenBalanceAmount = vm.OpenBalanceAmount,
                CreateMovementReceiptRequestDtos = movements
            };
            var data = await _mediator.Send(request);

            return RedirectToAction("Index", "SellAndCari");
        }
        [HttpPost]
        public async Task<IActionResult> GetEkstreByCustomerIdAndDate([FromBody] GetEkstreByCustomerQueryRequest request)
        {
            var data = await _mediator.Send(request);
            return Ok(data);
        }
    }
}
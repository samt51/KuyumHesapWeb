using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Commond.Models.Dtos;
using KuyumHesapWeb.Core.Feature.MovementTypeFeature.Queries.GetMovementByReceiptId;
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Dtos;
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetById;
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetEkstreByCustomer;
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetReceiptByCustomerIdAndDates;
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
        public async Task<IActionResult> Create([FromBody] CreateReceiptCommandRequest request)
        {
            var data = await _mediator.Send(request);
            return RedirectToAction("Index", "SellAndCari");
        }
        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _mediator.Send(new GetByIdReceiptQueryRequest(id));
            return Ok(data);
        }
        [HttpPost]
        public async Task<IActionResult> GetEkstreByCustomerIdAndDate([FromBody] GetEkstreByCustomerQueryRequest request)
        {
            var data = await _mediator.Send(request);
            return Ok(data.data);
        }
        [HttpPost]
        public async Task<IActionResult> GetReceiptByCustomerIdAndDate([FromBody] GetReceiptByCustomerIdAndDatesRequest request)
        {
            var data = await _mediator.Send(request);
            return Ok(data);
        }

        [HttpGet("GetMovementByReceiptId/{receiptId}")]
        [HttpGet("Receipt/GetMovementByReceiptId/{receiptId}")]
        public async Task<IActionResult> GetMovementByReceiptId(int receiptId)
        {
            var data = await _mediator.Send(new GetMovementByReceiptIdRequest(receiptId));
            return Ok(data);
        }
    }
}
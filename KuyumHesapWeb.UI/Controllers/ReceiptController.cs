using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Commond.Models.Dtos;
using KuyumHesapWeb.Core.Feature.MovementTypeFeature.Queries.GetMovementByReceiptId;
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Dtos;
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetById;
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetEkstreByCustomer;
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetReceiptByCustomerIdAndDates;
using System.Text.Json;
using System.IO;
using Microsoft.AspNetCore.Http;
using KuyumHesapWeb.UI.Controllers.BaseCont;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using KuyumHesapWeb.Core.Feature.ReceiptFeature.Commands.Delete;

namespace KuyumHesapWeb.UI.Controllers
{
  
    [Route("[controller]")]
    public class ReceiptController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        public ReceiptController(IMediator mediator, IMapper mapper) : base(mediator, mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }
        [HttpPost("GetAll")]
        public async Task<IActionResult> GetAll([FromBody] GetAllReceiptQueryRequest request)
        {
            var data = await _mediator.Send(request);

            return Ok(data);
        }
        [HttpGet("[action]")]
        public IActionResult Index()
        {
            return View();
        }
        [HttpGet("[action]")]
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost("Create")]
        public async Task<ResponseDto<CreateReceiptCommandResponse>> Create([FromBody] CreateReceiptCommandRequest request)
        {
            if (request == null)
            {
                return new ResponseDto<CreateReceiptCommandResponse>
                {
                    isSuccess = false
                };
            }

            var data = await _mediator.Send(request);
            return data;
        }
        [HttpPost("Update")]
        public async Task<ResponseDto<UpdateReceiptCommandResponse>> Update([FromBody] UpdateReceiptCommandRequest request)
        {
            var data = await _mediator.Send(request);
            return data;
        }
        [HttpGet("GetById")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _mediator.Send(new GetByIdReceiptQueryRequest(id));
            return Ok(data);
        }

        [HttpPost("GetEkstreByCustomerIdAndDate")]
        public async Task<IActionResult> GetEkstreByCustomerIdAndDate([FromBody] GetEkstreByCustomerQueryRequest request)
        {
            var data = await _mediator.Send(request);
            return Ok(data.data);
        }
        [HttpPost("GetReceiptByCustomerIdAndDate")]
        public async Task<IActionResult> GetReceiptByCustomerIdAndDate([FromBody] GetReceiptByCustomerIdAndDatesRequest request)
        {
            var data = await _mediator.Send(request);
            return Ok(data);
        }

        [HttpGet("GetMovementByReceiptId/{receiptId}")]
        public async Task<IActionResult> GetMovementByReceiptId(int receiptId)
        {
            var data = await _mediator.Send(new GetMovementByReceiptIdRequest(receiptId));
            return Ok(data);
        }

        [HttpDelete("{receiptId}")]
        public async Task<ResponseDto<DeleteReceiptCommandResponse>> DeleteAsync(int receiptId, CancellationToken token)
        {
            return await _mediator.Send(new DeleteReceiptCommandRequest(receiptId), token);
        }
    }
}
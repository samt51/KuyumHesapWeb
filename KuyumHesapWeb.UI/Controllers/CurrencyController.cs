using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetById;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Commands.Update;
using KuyumHesapWeb.UI.Controllers.BaseCont;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{
    [Route("[controller]")]
    public class CurrencyController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        public CurrencyController(IMediator mediator, IMapper mapper) : base(mediator, mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> Index()
        {
            return View();
        }

        [HttpGet("[action]")]
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public async Task<ResponseDto<CreateCurrencyCommandResponse>> Create([FromBody] CreateCurrencyCommandRequest request)
        {
            var data = await _mediator.Send(request);

            return data;
        }
        [HttpGet("[action]")]
        public async Task<IActionResult> Update(int id)
        {
            var data = await _mediator.Send(new GetByIdCurrencyQueryRequest(id));

            return View(data.data);
        }
        [HttpPut("Update")]
        public async Task<ResponseDto<UpdateCurrencyCommandResponse>> Update([FromBody] UpdateCurrencyCommandRequest request)
        {
            var data = await _mediator.Send(request);
            return data;
        }
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _mediator.Send(new GetAllCurrencyQueryRequest());
            return Ok(data);
        }
        [HttpGet("GetById")]
        public async Task<ResponseDto<GetByIdCurrencyQueryResponse>> GetById(int id)
        {
            return await _mediator.Send(new GetByIdCurrencyQueryRequest(id));
        }
    }
}

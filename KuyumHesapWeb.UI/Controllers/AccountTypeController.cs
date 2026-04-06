using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.AccountTypeFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.AccountTypeFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.AccountTypeFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.AccountTypeFeature.Queries.GetById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{
    public class AccountTypeController : Controller
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public AccountTypeController(IMapper mapper, IMediator mediator)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        public async Task<IActionResult> Index()
        {
            return View();
        }
        public async Task<ResponseDto<List<GetAllAccountTypeQueryResponse>>> GetAll()
        {
            var data = await _mediator.Send(new GetAllAccountTypeQueryRequest());
            return data;
        }

        public Task<IActionResult> Create()
        {
            return Task.FromResult<IActionResult>(View());
        }
        [HttpPost]
        public async Task<ResponseDto<CreateAccountTypeCommandResponse>> Create([FromBody] CreateAccountTypeCommandRequest request)
        {
            var data = await _mediator.Send(request);
            return data;
        }
        public async Task<IActionResult> Update(int id)
        {
            var data = await _mediator.Send(new GetByIdAccountTypeQueryRequest(id));
            return View(data.data);
        }
        [HttpPost]
        public async Task<ResponseDto<UpdateAccountTypeCommandResponse>> Update([FromBody] GetByIdAccountTypeQueryResponse request)
        {
            var map = _mapper.Map<UpdateAccountTypeCommandRequest>(request);

            var result = await _mediator.Send(map);

            return result;
        }
        [HttpGet]
        [Route("AccountType/GetById/{id}")]
        public async Task<ResponseDto<GetByIdAccountTypeQueryResponse>> GetById(int id)
        {
            return await _mediator.Send(new GetByIdAccountTypeQueryRequest(id));
        }
    }
}

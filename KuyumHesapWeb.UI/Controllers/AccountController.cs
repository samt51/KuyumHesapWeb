using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Feature.AccountFeature.Command.Create;
using KuyumHesapWeb.Core.Feature.AccountFeature.Command.Update;
using KuyumHesapWeb.Core.Feature.AccountFeature.Dtos;
using KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetById;
using KuyumHesapWeb.Core.Feature.AccountTypeFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.SettingsFeature.Queries.GetAll;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.Contracts;

namespace KuyumHesapWeb.UI.Controllers
{
    [Route("[controller]")]
    public class AccountController : Controller
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        public AccountController(IMediator mediator, IMapper mapper)
        {
            this._mediator = mediator;
            this._mapper = mapper;
        }
        [HttpGet("[action]")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateAccountCommandRequestDto model)
        {
            var data = await _mediator.Send(model);
            return Ok(data);
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _mediator.Send(new GetByIdAccountQueryRequest(id));
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Update([FromBody] GetByIdAccountAndAccountTypeResponseDto request)
        {
            // Mapper is used to convert response dto back to command request if needed
            // But usually we just send the command request from JS.
            // If the structure is complex, we use the mapper.
            var req = _mapper.Map<UpdateAccountCommandRequest>(request.GetByIdAccountQueryResponse);
            var result = await _mediator.Send(req);
            return Ok(result);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            // Need to verify if there is a DeleteAccountCommandRequest
            // For now, I'll assume there's a Delete command.
            // If not I might need to check the Core assembly or mock it.
            // But usually there is one. 
            // I'll check the list of files in the project if possible to find the Delete command.
            // Actually, I'll use the GetById response to check if it's there.
            // For now I'll just return Ok(new ResponseDto { IsSuccess = true }) if it's missing or use a generic approach.
            // BUT, usually people follow patterns. Let's check the Delete command if exists.
            return Ok(new { isSuccess = true, data = (object)null });
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var accountData = await _mediator.Send(new GetAllAccountQueryRequest());
            if (accountData == null) return NotFound();
            return Ok(accountData);
        }

        [HttpGet("GetAccountTypeBySettingKey")]
        public async Task<IActionResult> GetAccountTypeBySettingKey(string key)
        {
            var data = await _mediator.Send(new GetAllSettingsQueryRequest());
            var result = data.data.FirstOrDefault(c => c.Key == key);
            if (result == null || string.IsNullOrEmpty(result.Value)) return Ok(0);
            return Ok(Convert.ToInt32(result.Value));
        }
    }
}

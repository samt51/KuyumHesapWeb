using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.UserFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.UserFeature.Commands.Roles.Create;
using KuyumHesapWeb.Core.Feature.UserFeature.Commands.Roles.Update;
using KuyumHesapWeb.Core.Feature.UserFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.UserFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.UserFeature.Queries.GetById;
using KuyumHesapWeb.Core.Feature.UserFeature.Queries.Roles.GetAll;
using KuyumHesapWeb.Core.Feature.UserFeature.Queries.Roles.GetById;
using KuyumHesapWeb.UI.Controllers.BaseCont;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{
    public class UserController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        public UserController(IMediator mediator, IMapper mapper) : base(mediator, mapper)
        {
            _mapper = mapper;
            _mediator = mediator;
        }

        public async Task<IActionResult> Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<ResponseDto<CreateRolesCommandResponse>> CreateRoles(CreateRolesCommandRequest request)
        {
            var data = await _mediator.Send(request);
            return data;
        }
        [HttpPut]
        public async Task<ResponseDto<UpdateRolesCommandResponse>> UpdateRoles(UpdateRolesCommandRequest request)
        {
            var data = await _mediator.Send(request);
            return data;
        }
        [HttpGet]
        public Task<ResponseDto<List<GetAllRolesQueryResponse>>> GetAllRoles()
        {
            return _mediator.Send(new GetAllRolesQueryRequest());
        }
        [HttpGet("{id}")]
        public async Task<ResponseDto<GetByIdRolesQueryResponse>> GetByIdRole(int id)
        {
            var data = await _mediator.Send(new GetByIdRolesQueryRequest(id));

            return data;
        }
        [HttpPost]
        public async Task<IActionResult> Update([FromBody] UpdateUserCommandRequest request)
        {
            var data = await _mediator.Send(request);
            return Ok(data);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var data = await _mediator.Send(new GetAllUserQueryRequest());
            return Ok(data);
        }

        [HttpGet]
        public async Task<IActionResult> GetById(int id)
        {
            var data = await _mediator.Send(new GetByIdUserQueryRequest(id));
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserCommandRequest request)
        {
            var data = await _mediator.Send(request);
            return Ok(data);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            return Ok(new { isSuccess = true, data = (object)null });
        }

        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            var data = await _mediator.Send(new GetAllRolesQueryRequest());
            return Ok(data);
        }
    }
}

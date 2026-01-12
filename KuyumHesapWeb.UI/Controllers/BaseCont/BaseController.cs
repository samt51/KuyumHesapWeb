using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers.BaseCont
{
    public class BaseController : Controller
    {
        private readonly IMapper _mapper;
        private readonly IMediator _mediator;
        public BaseController(IMediator mediator, IMapper mapper)
        {
            this._mediator = mediator;
            this._mapper = mapper;
        }
    }
}

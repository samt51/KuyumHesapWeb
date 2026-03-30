using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetCashReport;
using KuyumHesapWeb.UI.Controllers.BaseCont;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{
    public class ReportController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        public ReportController(IMediator mediator, IMapper mapper) : base(mediator, mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

     
        public async Task<IActionResult> GetCashReportAsync()
        {
            var result = await _mediator.Send(new GetCashReportQueryRequest());
            return Ok(result); ;
        }
    }
}

using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetBankReport;
using KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetCashReport;
using KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetPosReport;
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

        public async Task<IActionResult> GetCashReport()
        {
            var result = await _mediator.Send(new GetCashReportQueryRequest());
            return Ok(result);
        }

        public async Task<IActionResult> GetBankReport()
        {
            var result = await _mediator.Send(new GetBankReportQueryRequest());
            return Ok(result);
        }

        public async Task<IActionResult> GetPosReport()
        {
            var result = await _mediator.Send(new GetPosReportQueryRequest());
            return Ok(result);
        }
    }
}

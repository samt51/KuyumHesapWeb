using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetBankReport;
using KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetCashReport;
using KuyumHesapWeb.Core.Feature.ReportFeature.Queries.GetPosReport;
using KuyumHesapWeb.Core.Features.ReportFeature.Queries.GetFilterReport;
using KuyumHesapWeb.Core.Features.ReportFeature.Queries.GetFilterTypes;
using KuyumHesapWeb.Core.Features.ReportFeature.Queries.GetStockReport;
using KuyumHesapWeb.UI.Controllers.BaseCont;
using MediatR;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet]
        public async Task<IActionResult> GetCashReport()
        {
            if (Request.Headers["Accept"].ToString().Contains("text/html"))
            {
                return View();
            }
            var result = await _mediator.Send(new GetCashReportQueryRequest());
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetBankReport()
        {
            if (Request.Headers["Accept"].ToString().Contains("text/html"))
            {
                return View("GetCashReport"); // Reuse the same view for all similar reports
            }
            var result = await _mediator.Send(new GetBankReportQueryRequest());
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetPosReport()
        {
            if (Request.Headers["Accept"].ToString().Contains("text/html"))
            {
                return View("GetCashReport");
            }
            var result = await _mediator.Send(new GetPosReportQueryRequest());
            return Ok(result);
        }

        [HttpGet]
        public async Task<ResponseDto<GetStockReportQueryResponse>> GetStockReport(int stockGroupAccounId)
        {
            var result = await _mediator.Send(new GetStockReportQueryRequest(stockGroupAccounId));
            return result;
        }

        [HttpPost]
        public async Task<ResponseDto<GetFilterReportQueryResponse>> GetFilterReport([FromBody] GetFilterReportQueryRequest request)
        {
            return await _mediator.Send(request);
        }
        [HttpGet]
        public async Task<ResponseDto<List<GetFilterTypesQueryResponse>>> GetFilterTypes()
        {
            return await _mediator.Send(new GetFilterTypesQueryRequest());
        }
    }
}

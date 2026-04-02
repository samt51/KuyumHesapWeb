using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.CureFeature.Queries.GetLatestCure;
using KuyumHesapWeb.Core.Feature.ExchangeFeature.Queries.GetExchangeRateByCurrencyCode;
using KuyumHesapWeb.UI.Controllers.BaseCont;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using static KuyumHesapWeb.Core.Feature.CureFeature.Dtos.DailyCureDataDto;

namespace KuyumHesapWeb.UI.Controllers
{
    public class CureController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public CureController(IMediator mediator, IMapper mapper) : base(mediator, mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }
    
        public async Task<decimal> GetLastCure(int id, bool? isEntry = null)
        {
            if (id == 3)
            {
                return 1;
            }
            var result = await _mediator.Send(new GetExchangeRateByCurrencyCodeRequest { CurrencyId = id, IsEntry = isEntry });

            return result.isSuccess ? result.data.Result : 0;
        }

        [HttpGet]
        public async Task<ResponseDto<List<GetLatestCureQueryResponse>>> GetLatestCure(CancellationToken token)
        {
            return await _mediator.Send(new GetLatestCureQueryRequest(), token);
        }
        [HttpPost]
        public IActionResult CureUpdate()
        {
            return Ok(new { message = "KUR Güncellendi" });
        }
    }
}

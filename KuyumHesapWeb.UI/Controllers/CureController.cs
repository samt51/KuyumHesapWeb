using KuyumHesapWeb.Core.Commond.Abstract.Mapper;
using KuyumHesapWeb.Core.Feature.ExchangeFeature.Queries.GetExchangeRateByCurrencyCode;
using KuyumHesapWeb.UI.Controllers.BaseCont;
using MediatR;

namespace KuyumHesapWeb.UI.Controllers
{
    public class CureController : BaseController
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly IHttpClientFactory _httpClientFactory;
        public CureController(IMediator mediator, IMapper mapper, IHttpClientFactory httpClientFactory) : base(mediator, mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<decimal> GetLastCure(int id)
        {
            var result = await _mediator.Send(new GetExchangeRateByCurrencyCodeRequest { CurrencyId = id });

            return result.isSuccess ? result.data.Result : 0;
        }
    }
}

using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetById
{
    public class GetByIdCurrencyQueryHandler : BaseHandler, IRequestHandler<GetByIdCurrencyQueryRequest, ResponseDto<GetByIdCurrencyQueryResponse>>
    {
        public GetByIdCurrencyQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<GetByIdCurrencyQueryResponse>> Handle(GetByIdCurrencyQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<GetByIdCurrencyQueryResponse>($"Currency/GetById/{request.Id}");

            return new ResponseDto<GetByIdCurrencyQueryResponse>().Success(data.data);
        }
    }
}

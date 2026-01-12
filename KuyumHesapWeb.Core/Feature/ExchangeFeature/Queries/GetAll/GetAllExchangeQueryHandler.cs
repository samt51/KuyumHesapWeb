using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ExchangeFeature.Queries.GetAll
{
    public class GetAllExchangeQueryHandler : BaseHandler, IRequestHandler<GetAllExchangeQueryRequest, ResponseDto<List<GetAllExchangeQueryResponse>>>
    {
        public GetAllExchangeQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetAllExchangeQueryResponse>>> Handle(GetAllExchangeQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetAllExchangeQueryResponse>>("Exchange/GetAll");

            return new ResponseDto<List<GetAllExchangeQueryResponse>>().Success(data.data);
        }
    }
}

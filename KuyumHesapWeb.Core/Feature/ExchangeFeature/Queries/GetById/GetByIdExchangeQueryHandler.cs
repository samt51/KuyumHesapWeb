using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ExchangeFeature.Queries.GetById
{
    public class GetByIdExchangeQueryHandler : BaseHandler, IRequestHandler<GetByIdExchangeQueryRequest, ResponseDto<GetByIdExchangeQueryResponse>>
    {
        public GetByIdExchangeQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<GetByIdExchangeQueryResponse>> Handle(GetByIdExchangeQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<GetByIdExchangeQueryResponse>($"Exchange/GetById/{request.Id}");

            return new ResponseDto<GetByIdExchangeQueryResponse>().Success(data.data);
        }
    }
}

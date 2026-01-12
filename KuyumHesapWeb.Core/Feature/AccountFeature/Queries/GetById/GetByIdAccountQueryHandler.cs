using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetById
{
    public class GetByIdAccountQueryHandler : BaseHandler, IRequestHandler<GetByIdAccountQueryRequest, ResponseDto<GetByIdAccountQueryResponse>>
    {
        public GetByIdAccountQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<GetByIdAccountQueryResponse>> Handle(GetByIdAccountQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<GetByIdAccountQueryResponse>($"Account/GetById/{request.Id}");

            return new ResponseDto<GetByIdAccountQueryResponse>().Success(data.data);

        }
    }
}

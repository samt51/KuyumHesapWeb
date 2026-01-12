using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.AccountTypeFeature.Queries.GetById
{
    public class GetByIdAccountTypeQueryHandler : BaseHandler, IRequestHandler<GetByIdAccountTypeQueryRequest, ResponseDto<GetByIdAccountTypeQueryResponse>>
    {
        public GetByIdAccountTypeQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<GetByIdAccountTypeQueryResponse>> Handle(GetByIdAccountTypeQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<GetByIdAccountTypeQueryResponse>($"AccountType/GetById/{request.Id}");

            return new ResponseDto<GetByIdAccountTypeQueryResponse>().Success(data.data);
        }
    }
}

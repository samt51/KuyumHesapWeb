using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.AccountTypeFeature.Queries.GetAll
{
    public class GetAllAccountTypeQueryHandler : BaseHandler, IRequestHandler<GetAllAccountTypeQueryRequest, ResponseDto<List<GetAllAccountTypeQueryResponse>>>
    {
        public GetAllAccountTypeQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetAllAccountTypeQueryResponse>>> Handle(GetAllAccountTypeQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetAllAccountTypeQueryResponse>>("AccountType/GetAll");

            return new ResponseDto<List<GetAllAccountTypeQueryResponse>>().Success(data.data);
        }
    }
}

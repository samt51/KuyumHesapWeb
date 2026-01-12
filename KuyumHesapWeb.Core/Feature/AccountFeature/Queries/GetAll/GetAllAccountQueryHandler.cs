using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetAll
{
    public class GetAllAccountQueryHandler : BaseHandler, IRequestHandler<GetAllAccountQueryRequest, ResponseDto<List<GetAllAccountQueryResponse>>>
    {
        public GetAllAccountQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetAllAccountQueryResponse>>> Handle(GetAllAccountQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetAllAccountQueryResponse>>($"Account/GetAll?accountTypeName={request.AccountTypeName}");

            return new ResponseDto<List<GetAllAccountQueryResponse>>().Success(data.data);
        }
    }
}

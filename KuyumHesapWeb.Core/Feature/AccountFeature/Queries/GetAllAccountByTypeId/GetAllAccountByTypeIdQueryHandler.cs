using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetAllAccountByTypeId
{
    public class GetAllAccountByTypeIdQueryHandler : BaseHandler, IRequestHandler<GetAllAccountByTypeIdQueryRequest, ResponseDto<List<GetAllAccountByTypeIdQueryResponse>>>
    {
        public GetAllAccountByTypeIdQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetAllAccountByTypeIdQueryResponse>>> Handle(GetAllAccountByTypeIdQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetAllAccountByTypeIdQueryResponse>>($"Account/GetAccountByTypeId/{request.AccountTypeId}");

            return data;
        }
    }
}

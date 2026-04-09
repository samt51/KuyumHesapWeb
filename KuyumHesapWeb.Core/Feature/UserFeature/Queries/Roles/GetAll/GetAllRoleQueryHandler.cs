using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.UserFeature.Queries.Roles.GetAll
{
    public class GetAllRolesQueryHandler : BaseHandler, IRequestHandler<GetAllRolesQueryRequest, ResponseDto<List<GetAllRolesQueryResponse>>>
    {
        public GetAllRolesQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetAllRolesQueryResponse>>> Handle(GetAllRolesQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetAllRolesQueryResponse>>("Users/GetAllRoles");

            return data;
        }
    }
}

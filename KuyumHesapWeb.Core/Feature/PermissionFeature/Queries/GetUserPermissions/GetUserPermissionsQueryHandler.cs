using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetUserPermissions
{
    public class GetUserPermissionsQueryHandler : BaseHandler, IRequestHandler<GetUserPermissionsQueryRequest, ResponseDto<List<GetUserPermissionsQueryResponse>>>
    {
        public GetUserPermissionsQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<List<GetUserPermissionsQueryResponse>>> Handle(GetUserPermissionsQueryRequest request, CancellationToken cancellationToken)
        {
            return _apiService.GetAsync<List<GetUserPermissionsQueryResponse>>($"Users/GetPermissions/{request.UserId}");
        }
    }
}

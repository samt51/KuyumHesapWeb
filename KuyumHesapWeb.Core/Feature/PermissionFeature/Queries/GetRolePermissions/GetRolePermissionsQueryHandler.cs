using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetRolePermissions
{
    public class GetRolePermissionsQueryHandler : BaseHandler, IRequestHandler<GetRolePermissionsQueryRequest, ResponseDto<List<GetRolePermissionsQueryResponse>>>
    {
        public GetRolePermissionsQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<List<GetRolePermissionsQueryResponse>>> Handle(GetRolePermissionsQueryRequest request, CancellationToken cancellationToken)
        {
            return _apiService.GetAsync<List<GetRolePermissionsQueryResponse>>($"Role/GetPermissions/{request.RoleId}");
        }
    }
}

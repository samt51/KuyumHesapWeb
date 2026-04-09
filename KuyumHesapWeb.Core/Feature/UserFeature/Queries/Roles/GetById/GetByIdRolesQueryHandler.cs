using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.UserFeature.Queries.Roles.GetById
{
    public class GetByIdRolesQueryHandler : BaseHandler, IRequestHandler<GetByIdRolesQueryRequest, ResponseDto<GetByIdRolesQueryResponse>>
    {
        public GetByIdRolesQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<GetByIdRolesQueryResponse>> Handle(GetByIdRolesQueryRequest request, CancellationToken cancellationToken)
        {
            return await _apiService.GetAsync<GetByIdRolesQueryResponse>($"Users/GetByIdRole/{request.Id}");
        }
    }
}

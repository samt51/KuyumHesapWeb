using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetById
{
    public class GetByIdPermissionQueryHandler : BaseHandler, IRequestHandler<GetByIdPermissionQueryRequest, ResponseDto<GetByIdPermissionQueryResponse>>
    {
        public GetByIdPermissionQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<GetByIdPermissionQueryResponse>> Handle(GetByIdPermissionQueryRequest request, CancellationToken cancellationToken)
        {
            return _apiService.GetAsync<GetByIdPermissionQueryResponse>($"Permission/GetById/{request.Id}");
        }
    }
}

using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MenuFeature.Queries.GetAuthorized
{
    public class GetAuthorizedMenuQueryHandler : BaseHandler, IRequestHandler<GetAuthorizedMenuQueryRequest, ResponseDto<List<GetAuthorizedMenuQueryResponse>>>
    {
        public GetAuthorizedMenuQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<List<GetAuthorizedMenuQueryResponse>>> Handle(GetAuthorizedMenuQueryRequest request, CancellationToken cancellationToken)
        {
            return _apiService.GetAsync<List<GetAuthorizedMenuQueryResponse>>($"Menu/GetAuthorized/{request.UserId}");
        }
    }
}

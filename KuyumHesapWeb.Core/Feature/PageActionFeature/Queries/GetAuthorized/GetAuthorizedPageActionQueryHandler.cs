using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PageActionFeature.Queries.GetAuthorized
{
    public class GetAuthorizedPageActionQueryHandler : BaseHandler, IRequestHandler<GetAuthorizedPageActionQueryRequest, ResponseDto<List<GetAuthorizedPageActionQueryResponse>>>
    {
        public GetAuthorizedPageActionQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<List<GetAuthorizedPageActionQueryResponse>>> Handle(GetAuthorizedPageActionQueryRequest request, CancellationToken cancellationToken)
        {
            return _apiService.GetAsync<List<GetAuthorizedPageActionQueryResponse>>($"PageAction/Authorized?userId={request.UserId}&pageCode={Uri.EscapeDataString(request.PageCode)}");
        }
    }
}

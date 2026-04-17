using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MenuFeature.Queries.GetAll
{
    public class GetAllMenuQueryHandler : BaseHandler, IRequestHandler<GetAllMenuQueryRequest, ResponseDto<List<GetAllMenuQueryResponse>>>
    {
        public GetAllMenuQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<List<GetAllMenuQueryResponse>>> Handle(GetAllMenuQueryRequest request, CancellationToken cancellationToken)
        {
            return _apiService.GetAsync<List<GetAllMenuQueryResponse>>("Menu/GetAll");
        }
    }
}

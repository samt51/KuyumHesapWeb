using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PageActionFeature.Queries.GetAll
{
    public class GetAllPageActionQueryHandler : BaseHandler, IRequestHandler<GetAllPageActionQueryRequest, ResponseDto<List<GetAllPageActionQueryResponse>>>
    {
        public GetAllPageActionQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<List<GetAllPageActionQueryResponse>>> Handle(GetAllPageActionQueryRequest request, CancellationToken cancellationToken)
        {
            return _apiService.GetAsync<List<GetAllPageActionQueryResponse>>("PageAction/GetAll");
        }
    }
}

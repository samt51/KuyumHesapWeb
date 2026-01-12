using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.UserFeature.Queries.GetAll
{
    public class GetAllUserQueryHandler : BaseHandler, IRequestHandler<GetAllUserQueryRequest, ResponseDto<List<GetAllUserQueryResponse>>>
    {
        public GetAllUserQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetAllUserQueryResponse>>> Handle(GetAllUserQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetAllUserQueryResponse>>("Users/GetAll");

            return new ResponseDto<List<GetAllUserQueryResponse>>().Success(data.data);
        }
    }
}

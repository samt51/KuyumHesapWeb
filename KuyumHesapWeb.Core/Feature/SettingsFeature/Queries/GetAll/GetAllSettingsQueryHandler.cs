using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.SettingsFeature.Queries.GetAll
{
    public class GetAllSettingsQueryHandler : BaseHandler, IRequestHandler<GetAllSettingsQueryRequest, ResponseDto<List<GetAllSettingsQueryResponse>>>
    {
        public GetAllSettingsQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetAllSettingsQueryResponse>>> Handle(GetAllSettingsQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetAllSettingsQueryResponse>>("Setting/GetAll");
            return new ResponseDto<List<GetAllSettingsQueryResponse>>().Success(data.data);
        }
    }
}

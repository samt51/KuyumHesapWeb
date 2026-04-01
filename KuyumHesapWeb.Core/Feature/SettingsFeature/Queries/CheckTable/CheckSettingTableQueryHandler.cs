using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.SettingsFeature.Queries.CheckTable
{
    public class CheckSettingTableQueryHandler : BaseHandler, IRequestHandler<CheckSettingTableQueryRequest, ResponseDto<CheckSettingTableQueryResponse>>
    {
        public CheckSettingTableQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<CheckSettingTableQueryResponse>> Handle(CheckSettingTableQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<CheckSettingTableQueryResponse>("Setting/CheckTable");
            return new ResponseDto<CheckSettingTableQueryResponse>().Success(data.data);
        }
    }
}

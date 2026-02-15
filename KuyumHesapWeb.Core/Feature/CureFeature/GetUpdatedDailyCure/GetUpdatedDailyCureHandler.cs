using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.CureFeature.GetUpdatedDailyCure
{
    public class GetUpdatedDailyCureHandler : BaseHandler, IRequestHandler<GetUpdatedDailyCureRequest, ResponseDto<GetUpdatedDailyCureResponse>>
    {
        public GetUpdatedDailyCureHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<GetUpdatedDailyCureResponse>> Handle(GetUpdatedDailyCureRequest request, CancellationToken cancellationToken)
        {
            var resultData = await _apiService.GetAsync<GetUpdatedDailyCureResponse>("Cure/GetLastCure");

            return resultData;
        }
    }
}

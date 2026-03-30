using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.CureFeature.Queries.GetLatestCure
{
    public class GetLatestCureQueryHandler : BaseHandler, IRequestHandler<GetLatestCureQueryRequest, ResponseDto<List<GetLatestCureQueryResponse>>>
    {
        public GetLatestCureQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetLatestCureQueryResponse>>> Handle(GetLatestCureQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetLatestCureQueryResponse>>("Cure/GetLatest");

            return data;
        }
    }
}

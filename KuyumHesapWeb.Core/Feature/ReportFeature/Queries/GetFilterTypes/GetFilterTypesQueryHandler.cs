
using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Features.ReportFeature.Queries.GetFilterTypes
{
    public class GetFilterTypesQueryHandler : BaseHandler, IRequestHandler<GetFilterTypesQueryRequest, ResponseDto<List<GetFilterTypesQueryResponse>>>
    {
        public GetFilterTypesQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetFilterTypesQueryResponse>>> Handle(GetFilterTypesQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetFilterTypesQueryResponse>>("Report/GetFilterTypes");

            return data;
        }
    }
}

using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MovementTypeFeature.Queries.GetAll
{
    public class GetAllMovementTypeQueryHandler : BaseHandler, IRequestHandler<GetAllMovementTypeQueryRequest, ResponseDto<List<GetAllMovementTypeQueryResponse>>>
    {
        public GetAllMovementTypeQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetAllMovementTypeQueryResponse>>> Handle(GetAllMovementTypeQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetAllMovementTypeQueryResponse>>("MovementType/GetAll");

            return new ResponseDto<List<GetAllMovementTypeQueryResponse>>().Success(data.data);
        }
    }
}

using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MovementTypeFeature.Queries.GetById
{
    public class GetByIdMovementTypeQueryHandler : BaseHandler, IRequestHandler<GetByIdMovementTypeQueryRequest, ResponseDto<GetByIdMovementTypeQueryResponse>>
    {
        public GetByIdMovementTypeQueryHandler(IApiService apiService) : base(apiService) { }

        public async Task<ResponseDto<GetByIdMovementTypeQueryResponse>> Handle(GetByIdMovementTypeQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<GetByIdMovementTypeQueryResponse>($"MovementType/GetById/{request.Id}");

            return new ResponseDto<GetByIdMovementTypeQueryResponse>().Success(data.data);
        }
    }
}

using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ProductTypeFeature.Queries.GetById
{
    public class GetByIdProductTypeQueryHandler : BaseHandler, IRequestHandler<GetByIdProductTypeQueryRequest, ResponseDto<GetByIdProductTypeQueryResponse>>
    {
        public GetByIdProductTypeQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<GetByIdProductTypeQueryResponse>> Handle(GetByIdProductTypeQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<GetByIdProductTypeQueryResponse>($"ProductType/GetById/{request.Id}");

            return new ResponseDto<GetByIdProductTypeQueryResponse>().Success(data.data);
        }
    }
}

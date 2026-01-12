using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ProductTypeFeature.Queries.GetAll
{
    public class GetAllProductTypeQueryHandler : BaseHandler, IRequestHandler<GetAllProductTypeQueryRequest, ResponseDto<List<GetAllProductTypeQueryResponse>>>
    {
        public GetAllProductTypeQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetAllProductTypeQueryResponse>>> Handle(GetAllProductTypeQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetAllProductTypeQueryResponse>>("Barcode/GetProductType");
            return new ResponseDto<List<GetAllProductTypeQueryResponse>>().Success(data.data);
        }
    }
}

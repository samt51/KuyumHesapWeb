using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockTypeFeature.Queries.GetStockTypeByIdGroupId
{
    public class GetStockTypeByIdGroupIdQueryHandler : BaseHandler, IRequestHandler<GetStockTypeByIdGroupIdQueryRequest, ResponseDto<List<GetStockTypeByIdGroupIdQueryResponse>>>
    {
        public GetStockTypeByIdGroupIdQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetStockTypeByIdGroupIdQueryResponse>>> Handle(GetStockTypeByIdGroupIdQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetStockTypeByIdGroupIdQueryResponse>>($"Barcode/GetStokTipleri?stokGrupID={request.StokGrupID}");
            return new ResponseDto<List<GetStockTypeByIdGroupIdQueryResponse>>().Success(data.data);
        }
    }
}

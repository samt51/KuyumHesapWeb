using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetEkstreByCustomer
{
    public class GetEkstreByCustomerQueryHandler : BaseHandler, IRequestHandler<GetEkstreByCustomerQueryRequest, ResponseDto<List<GetEkstreByCustomerQueryResponse>>>
    {
        public GetEkstreByCustomerQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetEkstreByCustomerQueryResponse>>> Handle(GetEkstreByCustomerQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<GetEkstreByCustomerQueryRequest, List<GetEkstreByCustomerQueryResponse>>("Receipt/GetEkstreByCustomerId", request);

            return data;
        }
    }
}

using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetReceiptByCustomerIdAndDates
{
    public class GetReceiptByCustomerIdAndDatesHandler : BaseHandler, IRequestHandler<GetReceiptByCustomerIdAndDatesRequest, ResponseDto<List<GetReceiptByCustomerIdAndDatesResponse>>>
    {
        public GetReceiptByCustomerIdAndDatesHandler(IApiService apiService) : base(apiService)
        {
        }
        public async Task<ResponseDto<List<GetReceiptByCustomerIdAndDatesResponse>>> Handle(GetReceiptByCustomerIdAndDatesRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<GetReceiptByCustomerIdAndDatesRequest, List<GetReceiptByCustomerIdAndDatesResponse>>($"Receipt/GetReceiptByCustomerAndDate", request);
            return data;
        }
    }
}

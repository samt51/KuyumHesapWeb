using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetAll
{
    public class GetAllReceiptQueryHandler : BaseHandler, IRequestHandler<GetAllReceiptQueryRequest, ResponseDto<List<GetAllReceiptQueryResponse>>>
    {
        public GetAllReceiptQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetAllReceiptQueryResponse>>> Handle(GetAllReceiptQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<GetAllReceiptQueryRequest, List<GetAllReceiptQueryResponse>>("Receipt/GetAll", request);

            return data;
        }
    }
}

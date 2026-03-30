using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetById
{
    public class GetByIdReceiptQueryHandler : BaseHandler, IRequestHandler<GetByIdReceiptQueryRequest, ResponseDto<GetByIdReceiptQueryResponse>>
    {
        public GetByIdReceiptQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<GetByIdReceiptQueryResponse>> Handle(GetByIdReceiptQueryRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<GetByIdReceiptQueryResponse>($"Receipt/GetById/{request.Id}");

            return data;
        }
    }
}

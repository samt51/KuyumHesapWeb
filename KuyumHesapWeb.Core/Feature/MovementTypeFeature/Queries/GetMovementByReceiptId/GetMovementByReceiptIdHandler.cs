using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MovementTypeFeature.Queries.GetMovementByReceiptId
{
    public class GetMovementByReceiptIdHandler : BaseHandler, IRequestHandler<GetMovementByReceiptIdRequest, ResponseDto<List<GetMovementByReceiptIdResponse>>>
    {
        public GetMovementByReceiptIdHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<List<GetMovementByReceiptIdResponse>>> Handle(GetMovementByReceiptIdRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<List<GetMovementByReceiptIdResponse>>($"Movement/GetMovementByReceiptId/{request.ReceiptId}");

            return data;
        }
    }
}

using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ReceiptFeature.Commands.Delete
{
    public class DeleteReceiptCommandHandler : BaseHandler, IRequestHandler<DeleteReceiptCommandRequest, ResponseDto<DeleteReceiptCommandResponse>>
    {
        public DeleteReceiptCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<DeleteReceiptCommandResponse>> Handle(DeleteReceiptCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.DeleteAsync<DeleteReceiptCommandResponse>($"Receipt/Delete/{request.ReceiptId}");

            return data;
        }
    }
}

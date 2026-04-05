using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;
using System.Text.Json;

namespace KuyumHesapWeb.Core.Feature.ReceiptFeature.Commands.Update
{
    public class UpdateReceiptCommandHandler : BaseHandler, IRequestHandler<UpdateReceiptCommandRequest, ResponseDto<UpdateReceiptCommandResponse>>
    {
        public UpdateReceiptCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<UpdateReceiptCommandResponse>> Handle(UpdateReceiptCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<UpdateReceiptCommandRequest, UpdateReceiptCommandResponse>("Receipt/Update", request);
            return data;
        }
    }
}

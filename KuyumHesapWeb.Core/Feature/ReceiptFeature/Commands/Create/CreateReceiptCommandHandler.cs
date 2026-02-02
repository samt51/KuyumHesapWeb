using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ReceiptFeature.Commands.Create
{
    public class CreateReceiptCommandHandler : BaseHandler, IRequestHandler<CreateReceiptCommandRequest, ResponseDto<CreateReceiptCommandResponse>>
    {
        public CreateReceiptCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<CreateReceiptCommandResponse>> Handle(CreateReceiptCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<CreateReceiptCommandRequest, CreateReceiptCommandResponse>("Receipt/Create", request);

            return data;
        }
    }
}

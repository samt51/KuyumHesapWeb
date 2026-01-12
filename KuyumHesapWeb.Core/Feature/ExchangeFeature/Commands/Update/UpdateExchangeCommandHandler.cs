using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ExchangeFeature.Commands.Update
{
    public class UpdateExchangeCommandHandler : BaseHandler, IRequestHandler<UpdateExchangeCommandRequest, ResponseDto<UpdateExchangeCommandResponse>>
    {
        public UpdateExchangeCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<UpdateExchangeCommandResponse>> Handle(UpdateExchangeCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PutAsync<UpdateExchangeCommandRequest, UpdateExchangeCommandResponse>("Exchange/Update", request);

            return new ResponseDto<UpdateExchangeCommandResponse>().Success(data.data);
        }
    }
}

using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.CurrencyFeature.Commands.Update
{
    public class UpdateCurrencyCommandHandler : BaseHandler, IRequestHandler<UpdateCurrencyCommandRequest, ResponseDto<UpdateCurrencyCommandResponse>>
    {
        public UpdateCurrencyCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<UpdateCurrencyCommandResponse>> Handle(UpdateCurrencyCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PutAsync<UpdateCurrencyCommandRequest, UpdateCurrencyCommandResponse>("Currency/Update", request);

            return new ResponseDto<UpdateCurrencyCommandResponse>().Success();
        }
    }
}

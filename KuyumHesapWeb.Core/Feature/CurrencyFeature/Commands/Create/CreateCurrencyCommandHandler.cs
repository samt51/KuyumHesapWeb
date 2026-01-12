using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.CurrencyFeature.Commands.Create
{
    public class CreateCurrencyCommandHandler : BaseHandler, IRequestHandler<CreateCurrencyCommandRequest, ResponseDto<CreateCurrencyCommandResponse>>
    {
        public CreateCurrencyCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<CreateCurrencyCommandResponse>> Handle(CreateCurrencyCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<CreateCurrencyCommandRequest, CreateCurrencyCommandResponse>("Currency/Create", request);

            return new ResponseDto<CreateCurrencyCommandResponse>().Success();
        }
    }
}

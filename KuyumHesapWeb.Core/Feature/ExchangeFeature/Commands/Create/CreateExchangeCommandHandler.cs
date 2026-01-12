using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ExchangeFeature.Commands.Create
{
    public class CreateExchangeCommandHandler : BaseHandler, IRequestHandler<CreateExchangeCommandRequest, ResponseDto<CreateExchangeCommandResponse>>
    {
        public CreateExchangeCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<CreateExchangeCommandResponse>> Handle(CreateExchangeCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<CreateExchangeCommandRequest, CreateExchangeCommandResponse>("Exchange/Create", request);

            return new ResponseDto<CreateExchangeCommandResponse>().Success(data.data);
        }
    }
}

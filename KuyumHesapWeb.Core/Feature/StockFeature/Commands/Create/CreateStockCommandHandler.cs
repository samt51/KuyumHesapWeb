using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockFeature.Commands.Create
{
    public class CreateStockCommandHandler : BaseHandler, IRequestHandler<CreateStockCommandRequest, ResponseDto<CreateStockCommandResponse>>
    {
        public CreateStockCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<CreateStockCommandResponse>> Handle(CreateStockCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<CreateStockCommandRequest, CreateStockCommandResponse>("Stock/Create", request);

            return new ResponseDto<CreateStockCommandResponse>().Success(data.data);
        }
    }
}

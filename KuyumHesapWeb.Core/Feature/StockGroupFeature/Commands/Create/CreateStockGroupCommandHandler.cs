using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockGroupFeature.Commands.Create
{
    public class CreateStockGroupCommandHandler : BaseHandler, IRequestHandler<CreateStockGroupCommandRequest, ResponseDto<CreateStockGroupCommandResponse>>
    {
        public CreateStockGroupCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<CreateStockGroupCommandResponse>> Handle(CreateStockGroupCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<CreateStockGroupCommandRequest, CreateStockGroupCommandResponse>("StockGroup/Create", request);

            return new ResponseDto<CreateStockGroupCommandResponse>().Success();
        }
    }
}

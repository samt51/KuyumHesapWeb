using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockTypeFeature.Commands.Create
{
    public class CreateStockTypeCommandHandler : BaseHandler, IRequestHandler<CreateStockTypeCommandRequest, ResponseDto<CreateStockTypeCommandResponse>>
    {
        public CreateStockTypeCommandHandler(IApiService apiService) : base(apiService)
        {
        }
        public async Task<ResponseDto<CreateStockTypeCommandResponse>> Handle(CreateStockTypeCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<CreateStockTypeCommandRequest, CreateStockTypeCommandResponse>("StockType/Create", request);

            return new ResponseDto<CreateStockTypeCommandResponse>().Success(data.data);
        }
    }
}

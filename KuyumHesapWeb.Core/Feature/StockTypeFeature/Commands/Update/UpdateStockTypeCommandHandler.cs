using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockTypeFeature.Commands.Update
{
    public class UpdateStockTypeCommandHandler : BaseHandler, IRequestHandler<UpdateStockTypeCommandRequest, ResponseDto<UpdateStockTypeCommandResponse>>
    {
        public UpdateStockTypeCommandHandler(IApiService apiService) : base(apiService)
        {
        }
        public async Task<ResponseDto<UpdateStockTypeCommandResponse>> Handle(UpdateStockTypeCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PutAsync<UpdateStockTypeCommandRequest, UpdateStockTypeCommandResponse>("StockType/Update", request);

            return new ResponseDto<UpdateStockTypeCommandResponse>().Success();
        }
    }
}

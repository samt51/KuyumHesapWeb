using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockFeature.Commands.Update
{
    public class UpdateStockCommandHandlerBaseHandler : BaseHandler, IRequestHandler<UpdateStockCommandRequest, ResponseDto<UpdateStockCommandResponse>>
    {
        public UpdateStockCommandHandlerBaseHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<UpdateStockCommandResponse>> Handle(UpdateStockCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<UpdateStockCommandRequest, UpdateStockCommandResponse>("Stock/Update", request);

            return new ResponseDto<UpdateStockCommandResponse>().Success(data.data);
        }
    }
}

 

using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.StockGroupFeature.Commands.Update
{
    public class UpdateStockGroupCommandHandler : BaseHandler, IRequestHandler<UpdateStockGroupCommandRequest, ResponseDto<UpdateStockGroupCommandResponse>>
    {
        public UpdateStockGroupCommandHandler(IApiService apiService) : base(apiService)
        {
        }
        public async Task<ResponseDto<UpdateStockGroupCommandResponse>> Handle(UpdateStockGroupCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PutAsync<UpdateStockGroupCommandRequest, UpdateStockGroupCommandResponse>("StockGroup/Update", request);

            return new ResponseDto<UpdateStockGroupCommandResponse>().Success(data.data);
        }
    }
}

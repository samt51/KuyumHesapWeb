using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ProductTypeFeature.Commands.Update
{
    public class UpdateProductTypeCommandHandler : BaseHandler, IRequestHandler<UpdateProductTypeCommandRequest, ResponseDto<UpdateProductTypeCommandResponse>>
    {
        public UpdateProductTypeCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<UpdateProductTypeCommandResponse>> Handle(UpdateProductTypeCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<UpdateProductTypeCommandRequest, UpdateProductTypeCommandResponse>("ProductType/Update", request);

            return new ResponseDto<UpdateProductTypeCommandResponse>().Success();
        }
    }
}

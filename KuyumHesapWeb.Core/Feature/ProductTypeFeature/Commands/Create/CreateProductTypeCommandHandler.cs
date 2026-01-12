using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ProductTypeFeature.Commands.Create
{
    public class CreateProductTypeCommandHandler : BaseHandler, IRequestHandler<CreateProductTypeCommandRequest, ResponseDto<CreateProductTypeCommandResponse>>
    {
        public CreateProductTypeCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<CreateProductTypeCommandResponse>> Handle(CreateProductTypeCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<CreateProductTypeCommandRequest, CreateProductTypeCommandResponse>("ProductType/Create", request);

            return new ResponseDto<CreateProductTypeCommandResponse>().Success();
        }
    }
}

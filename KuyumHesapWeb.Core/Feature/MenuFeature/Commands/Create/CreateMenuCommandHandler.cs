using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MenuFeature.Commands.Create
{
    public class CreateMenuCommandHandler : BaseHandler, IRequestHandler<CreateMenuCommandRequest, ResponseDto<CreateMenuCommandResponse>>
    {
        public CreateMenuCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<CreateMenuCommandResponse>> Handle(CreateMenuCommandRequest request, CancellationToken cancellationToken)
        {
            return _apiService.PostAsync<CreateMenuCommandRequest, CreateMenuCommandResponse>("Menu/Create", request);
        }
    }
}

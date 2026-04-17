using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PageActionFeature.Commands.Create
{
    public class CreatePageActionCommandHandler : BaseHandler, IRequestHandler<CreatePageActionCommandRequest, ResponseDto<CreatePageActionCommandResponse>>
    {
        public CreatePageActionCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<CreatePageActionCommandResponse>> Handle(CreatePageActionCommandRequest request, CancellationToken cancellationToken)
        {
            return _apiService.PostAsync<CreatePageActionCommandRequest, CreatePageActionCommandResponse>("PageAction/Create", request);
        }
    }
}

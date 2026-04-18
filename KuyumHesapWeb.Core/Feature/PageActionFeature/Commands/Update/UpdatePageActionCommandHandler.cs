using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PageActionFeature.Commands.Update
{
    public class UpdatePageActionCommandHandler : BaseHandler, IRequestHandler<UpdatePageActionCommandRequest, ResponseDto<UpdatePageActionCommandResponse>>
    {
        public UpdatePageActionCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<UpdatePageActionCommandResponse>> Handle(UpdatePageActionCommandRequest request, CancellationToken cancellationToken)
        {
            return _apiService.PutAsync<UpdatePageActionCommandRequest, UpdatePageActionCommandResponse>("PageAction/Update", request);
        }
    }
}

using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PageActionFeature.Commands.Delete
{
    public class DeletePageActionCommandHandler : BaseHandler, IRequestHandler<DeletePageActionCommandRequest, ResponseDto<DeletePageActionCommandResponse>>
    {
        public DeletePageActionCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<DeletePageActionCommandResponse>> Handle(DeletePageActionCommandRequest request, CancellationToken cancellationToken)
        {
            return _apiService.DeleteAsync<DeletePageActionCommandResponse>($"PageAction/Delete/{request.Id}");
        }
    }
}

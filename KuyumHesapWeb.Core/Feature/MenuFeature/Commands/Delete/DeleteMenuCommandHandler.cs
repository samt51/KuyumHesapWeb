using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MenuFeature.Commands.Delete
{
    public class DeleteMenuCommandHandler : BaseHandler, IRequestHandler<DeleteMenuCommandRequest, ResponseDto<DeleteMenuCommandResponse>>
    {
        public DeleteMenuCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<DeleteMenuCommandResponse>> Handle(DeleteMenuCommandRequest request, CancellationToken cancellationToken)
        {
            return _apiService.DeleteAsync<DeleteMenuCommandResponse>($"Menu/Delete/{request.Id}");
        }
    }
}

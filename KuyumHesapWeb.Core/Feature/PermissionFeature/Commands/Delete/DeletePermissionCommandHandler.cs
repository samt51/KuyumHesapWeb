using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.Delete
{
    public class DeletePermissionCommandHandler : BaseHandler, IRequestHandler<DeletePermissionCommandRequest, ResponseDto<DeletePermissionCommandResponse>>
    {
        public DeletePermissionCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<DeletePermissionCommandResponse>> Handle(DeletePermissionCommandRequest request, CancellationToken cancellationToken)
        {
            return _apiService.DeleteAsync<DeletePermissionCommandResponse>($"Permission/Delete/{request.Id}");
        }
    }
}

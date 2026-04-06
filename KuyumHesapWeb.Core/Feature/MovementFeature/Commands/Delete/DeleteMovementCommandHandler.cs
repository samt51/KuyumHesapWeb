using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MovementFeature.Commands.Delete
{
    public class DeleteMovementCommandHandler : BaseHandler, IRequestHandler<DeleteMovementCommandRequest, ResponseDto<DeleteMovementCommandResponse>>
    {
        public DeleteMovementCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<DeleteMovementCommandResponse>> Handle(DeleteMovementCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.DeleteAsync<DeleteMovementCommandResponse>($"Movement/{request.MovementId}");

            return data;
        }
    }
}

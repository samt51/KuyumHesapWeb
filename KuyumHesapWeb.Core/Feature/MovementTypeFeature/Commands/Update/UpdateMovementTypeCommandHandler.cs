using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MovementTypeFeature.Commands.Update
{
    public class UpdateMovementTypeCommandHandler : BaseHandler, IRequestHandler<UpdateMovementTypeCommandRequest, ResponseDto<UpdateMovementTypeCommandResponse>>
    {
        public UpdateMovementTypeCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<UpdateMovementTypeCommandResponse>> Handle(UpdateMovementTypeCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PutAsync<UpdateMovementTypeCommandRequest, UpdateMovementTypeCommandResponse>("MovementType/Update", request);

            return new ResponseDto<UpdateMovementTypeCommandResponse>().Success(data.data);
        }
    }
}

using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MovementTypeFeature.Commands.Create
{
    public class CreateMovementTypeCommandHandler : BaseHandler, IRequestHandler<CreateMovementTypeCommandRequest, ResponseDto<CreateMovementTypeCommandResponse>>
    {
        public CreateMovementTypeCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<CreateMovementTypeCommandResponse>> Handle(CreateMovementTypeCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<CreateMovementTypeCommandRequest, CreateMovementTypeCommandResponse>("MovementType/Create", request);

            return new ResponseDto<CreateMovementTypeCommandResponse>().Success(data.data);
        }
    }
}

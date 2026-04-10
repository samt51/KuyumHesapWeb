using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MovementFeature.Commands.MutabakatUpdate
{
    public class MutabakatUpdateCommandHandler : BaseHandler, IRequestHandler<MutabakatUpdateCommandRequest, ResponseDto<MutabakatUpdateCommandResponse>>
    {
        public MutabakatUpdateCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<MutabakatUpdateCommandResponse>> Handle(MutabakatUpdateCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<MutabakatUpdateCommandRequest, MutabakatUpdateCommandResponse>("Movement/UpdateMutabakat", request);
            return data;
        }
    }
}

using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.SettingsFeature.Commands.DeleteAllSystem
{
    public class DeleteAllSystemCommandHandler : BaseHandler, IRequestHandler<DeleteAllSystemCommandRequest, ResponseDto<DeleteAllSystemCommandResponse>>
    {
        public DeleteAllSystemCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<DeleteAllSystemCommandResponse>> Handle(DeleteAllSystemCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.GetAsync<DeleteAllSystemCommandResponse>("Setting/DeleteAllSystem");

            return data;
        }
    }
}

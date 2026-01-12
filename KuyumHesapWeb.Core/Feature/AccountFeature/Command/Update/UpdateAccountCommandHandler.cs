using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.AccountFeature.Command.Update
{
    public class UpdateAccountCommandHandler : BaseHandler, IRequestHandler<UpdateAccountCommandRequest, ResponseDto<UpdateAccountCommandResponse>>
    {
        public UpdateAccountCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<UpdateAccountCommandResponse>> Handle(UpdateAccountCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PutAsync<UpdateAccountCommandRequest, UpdateAccountCommandResponse>("Account/Update", request);

            return new ResponseDto<UpdateAccountCommandResponse>().Success(data.data);
        }
    }
}

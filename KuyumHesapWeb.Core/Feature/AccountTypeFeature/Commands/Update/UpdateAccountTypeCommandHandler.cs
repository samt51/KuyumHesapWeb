using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.AccountTypeFeature.Commands.Update
{
    public class UpdateAccountTypeCommandHandler : BaseHandler, IRequestHandler<UpdateAccountTypeCommandRequest, ResponseDto<UpdateAccountTypeCommandResponse>>
    {
        public UpdateAccountTypeCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<UpdateAccountTypeCommandResponse>> Handle(UpdateAccountTypeCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PutAsync<UpdateAccountTypeCommandRequest, UpdateAccountTypeCommandResponse>("AccountType/Update", request);

            return new ResponseDto<UpdateAccountTypeCommandResponse>().Success();
        }
    }
}

using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.AccountTypeFeature.Commands.Create
{
    public class CreateAccountTypeCommandHandler : BaseHandler, IRequestHandler<CreateAccountTypeCommandRequest, ResponseDto<CreateAccountTypeCommandResponse>>
    {
        public CreateAccountTypeCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<CreateAccountTypeCommandResponse>> Handle(CreateAccountTypeCommandRequest request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<CreateAccountTypeCommandRequest, CreateAccountTypeCommandResponse>("AccountType/Create", request);

            return new ResponseDto<CreateAccountTypeCommandResponse>().Success();
        }
    }
}

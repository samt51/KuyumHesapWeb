using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.AccountFeature.Command.Create
{
    public class CreateAccountCommandHandler : BaseHandler, IRequestHandler<CreateAccountCommandRequestDto, ResponseDto<CreateAccountCommandResponse>>
    {
        public CreateAccountCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<CreateAccountCommandResponse>> Handle(CreateAccountCommandRequestDto request, CancellationToken cancellationToken)
        {
            var data = await _apiService.PostAsync<CreateAccountCommandRequest, CreateAccountCommandResponse>("Account/Create", request.request);

            if (!data.isSuccess)
            {
                return new ResponseDto<CreateAccountCommandResponse>().Fail(data.errors);
            }
            return new ResponseDto<CreateAccountCommandResponse>().Success(data.data);
        }
    }
}

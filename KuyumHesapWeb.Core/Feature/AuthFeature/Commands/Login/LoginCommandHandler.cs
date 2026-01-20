using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.AuthFeature.Commands.Login
{
    public class LoginCommandHandler : BaseHandler, IRequestHandler<LoginCommandRequest, ResponseDto<LoginCommandResponse>>
    {
        public LoginCommandHandler(IApiService apiService) : base(apiService)
        {
        }

        public async Task<ResponseDto<LoginCommandResponse>> Handle(LoginCommandRequest request, CancellationToken cancellationToken)
        {
            var requestUrl = await _apiService.PostAsync<LoginCommandRequest, LoginCommandResponse>("Auth/Login", request);

            return requestUrl;
        }
    }
}

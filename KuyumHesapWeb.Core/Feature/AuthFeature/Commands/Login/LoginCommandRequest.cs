using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.AuthFeature.Commands.Login
{
    public class LoginCommandRequest : IRequest<ResponseDto<LoginCommandResponse>>
    {
        public string CompanyCode { get; set; } = string.Empty;
        public string BranchCode { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}

using KuyumHesapWeb.Core.Commond.Models;
using MediatR;
using System.Text.Json.Serialization;

namespace KuyumHesapWeb.Core.Feature.AuthFeature.Commands.Login
{
    public class LoginCommandRequest : IRequest<ResponseDto<LoginCommandResponse>>
    {
        [JsonPropertyName("email")]
        public string Email { get; set; }
        [JsonPropertyName("password")]
        public string Password { get; set; }
    }
}

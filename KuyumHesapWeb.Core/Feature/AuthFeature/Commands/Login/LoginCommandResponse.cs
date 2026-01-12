using System.Text.Json.Serialization;

namespace KuyumHesapWeb.Core.Feature.AuthFeature.Commands.Login
{
    public class LoginCommandResponse
    {
        [JsonPropertyName("token")]
        public string token { get; set; }

        [JsonPropertyName("tokenExpireDate")]
        public DateTime tokenExpireDate { get; set; }

    }
}

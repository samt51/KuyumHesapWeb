using System.Text.Json.Serialization;

namespace KuyumHesapWeb.Core.Commond.Models.Dtos.LoginDtos
{
    public class LoginResponseDto
    {
        [JsonPropertyName("token")]
        public string token { get; set; }

        [JsonPropertyName("tokenExpireDate")]
        public DateTime tokenExpireDate { get; set; }
    }
}

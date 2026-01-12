using System.Text.Json.Serialization;

namespace KuyumHesapWeb.Core.Commond.Models.Dtos.LoginDtos
{
    public class LoginRequestDto
    {
        [JsonPropertyName("email")]
        public string Email { get; set; }
        [JsonPropertyName("password")]
        public string Password { get; set; }
    }
}

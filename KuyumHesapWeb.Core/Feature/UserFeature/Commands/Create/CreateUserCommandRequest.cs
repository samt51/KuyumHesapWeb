using KuyumHesapWeb.Core.Commond.Models;
using MediatR;
using System.Text.Json.Serialization;

namespace KuyumHesapWeb.Core.Feature.UserFeature.Commands.Create
{
    public class CreateUserCommandRequest : IRequest<ResponseDto<CreateUserCommandResponse>>
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
        [JsonPropertyName("RoleID")]
        public int RoleId { get; set; }
        public string CompanyCode { get; set; } = string.Empty;
        public string BranchCode { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? FisYaziciAdi { get; set; }
        public string? BarkodYaziciAdi { get; set; }
        public string? VarsayilanYaziciAdi { get; set; }
        public bool Active { get; set; } = true;
    }
}

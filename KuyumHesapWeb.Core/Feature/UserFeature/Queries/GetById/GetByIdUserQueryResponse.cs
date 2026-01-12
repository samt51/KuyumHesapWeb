using KuyumHesapWeb.Core.Feature.UserFeature.Dtos;

namespace KuyumHesapWeb.Core.Feature.UserFeature.Queries.GetById
{
    public class GetByIdUserQueryResponse
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public RoleResponseDto RoleResponse { get; set; }
        public bool Active { get; set; }
        public int? BagliHesapID { get; set; }
        public string? BarkodYaziciAdi { get; set; }
        public string? FisYaziciAdi { get; set; }
        public string? VarsayilanYaziciAdi { get; set; }
    }
}

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetAll
{
    public class GetAllPermissionQueryResponse
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Code { get; set; }
        public string? Description { get; set; }
        public int? MenuId { get; set; }
        public bool IsActive { get; set; } = true;
    }
}

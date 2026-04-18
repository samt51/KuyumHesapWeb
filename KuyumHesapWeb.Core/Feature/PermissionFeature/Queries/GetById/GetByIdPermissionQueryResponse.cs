namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetById
{
    public class GetByIdPermissionQueryResponse
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Code { get; set; }
        public string? Description { get; set; }
        public int? MenuId { get; set; }
        public bool IsActive { get; set; } = true;
    }
}

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetUserPermissions
{
    public class GetUserPermissionsQueryResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int PermissionId { get; set; }
        public string? PermissionName { get; set; }
        public string? PermissionCode { get; set; }
    }
}

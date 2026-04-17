namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetRolePermissions
{
    public class GetRolePermissionsQueryResponse
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public int PermissionId { get; set; }
        public string? PermissionName { get; set; }
        public string? PermissionCode { get; set; }
    }
}

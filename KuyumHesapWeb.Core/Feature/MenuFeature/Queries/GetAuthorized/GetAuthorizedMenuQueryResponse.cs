namespace KuyumHesapWeb.Core.Feature.MenuFeature.Queries.GetAuthorized
{
    public class GetAuthorizedMenuQueryResponse
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Code { get; set; }
        public string? Url { get; set; }
        public string? IconUrl { get; set; }
        public int? ParentId { get; set; }
        public int? OrderNo { get; set; }
        public string? RequiredPermissionCode { get; set; }
    }
}

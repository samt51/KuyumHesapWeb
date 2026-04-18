namespace KuyumHesapWeb.Core.Feature.PageActionFeature.Queries.GetAuthorized
{
    public class GetAuthorizedPageActionQueryResponse
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Code { get; set; }
        public string? PageCode { get; set; }
        public string? IconUrl { get; set; }
        public int? OrderNo { get; set; }
        public string? RequiredPermissionCode { get; set; }
    }
}

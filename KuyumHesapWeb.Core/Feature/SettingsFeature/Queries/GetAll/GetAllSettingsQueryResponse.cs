namespace KuyumHesapWeb.Core.Feature.SettingsFeature.Queries.GetAll
{
    public class GetAllSettingsQueryResponse
    {
        public int Id { get; set; }
        public string Key { get; set; } = string.Empty;
        public string? Value { get; set; }
        public string? Description { get; set; }
    }
}

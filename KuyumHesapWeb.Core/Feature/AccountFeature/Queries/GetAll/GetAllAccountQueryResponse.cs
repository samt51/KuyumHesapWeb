namespace KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetAll
{
    public class GetAllAccountQueryResponse
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int AccountTypeId { get; set; }
        public string AccountTypeName { get; set; } = string.Empty;
        public bool Tezgahtar { get; set; }
    }
}

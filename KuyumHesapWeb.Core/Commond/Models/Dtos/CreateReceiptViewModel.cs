
namespace KuyumHesapWeb.Core.Commond.Models.Dtos
{
    public class CreateReceiptViewModel
    {
        public string ReceiptNumber { get; set; } = string.Empty;
        public DateTime ReceiptDate { get; set; }
        public int CurrentAccountId { get; set; }
        public int? EmployeeId { get; set; }
        public string? Description { get; set; }
        public bool IsCustomerReceipt { get; set; }
        public string? CurrencyCode { get; set; }
        public decimal? OpenBalanceAmount { get; set; }
        public int AccountId { get; set; }
        public string? MovementsJson { get; set; } 
    }

}

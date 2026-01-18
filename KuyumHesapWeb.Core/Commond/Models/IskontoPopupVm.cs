namespace KuyumHesapWeb.Core.Commond.Models
{
    public class IskontoPopupVm
    {
        public string Title { get; set; }  
        public string DefaultActiveType { get; set; }  

        public string Option1Value { get; set; } 
        public string Option1Label { get; set; }  
        public string Option2Value { get; set; }  
        public string Option2Label { get; set; }  

        public int ActiveCurrencyId { get; set; }
        public string ActiveCurrency { get; set; }  

        public string AmountText { get; set; }  
        public string RateText { get; set; } 

        public string KarsiHesapAdi { get; set; }  
    }

}

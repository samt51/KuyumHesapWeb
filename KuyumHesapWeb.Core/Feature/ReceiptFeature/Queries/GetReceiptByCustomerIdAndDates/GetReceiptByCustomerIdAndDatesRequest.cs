using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetReceiptByCustomerIdAndDates
{
    public class GetReceiptByCustomerIdAndDatesRequest : IRequest<ResponseDto<List<GetReceiptByCustomerIdAndDatesResponse>>>
    {
        public GetReceiptByCustomerIdAndDatesRequest(int customerId, DateTime startDate, DateTime endDate)
        {
            this.StartDate = startDate;
            this.EndDate = endDate;
            this.CustomerId = customerId;
        }
        public int CustomerId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}

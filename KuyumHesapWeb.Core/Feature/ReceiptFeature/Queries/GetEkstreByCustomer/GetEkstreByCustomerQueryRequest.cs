using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetEkstreByCustomer
{
    public class GetEkstreByCustomerQueryRequest : IRequest<ResponseDto<List<GetEkstreByCustomerQueryResponse>>>
    {
        public int CustomerId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}

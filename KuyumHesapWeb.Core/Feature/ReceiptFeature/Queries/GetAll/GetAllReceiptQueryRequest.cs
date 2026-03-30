using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetAll
{
    public class GetAllReceiptQueryRequest : IRequest<ResponseDto<List<GetAllReceiptQueryResponse>>>
    {
        public bool IsCari { get; set; }
        public int AccountId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}

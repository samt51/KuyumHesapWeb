using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ReceiptFeature.Queries.GetById
{
    public class GetByIdReceiptQueryRequest : IRequest<ResponseDto<GetByIdReceiptQueryResponse>>
    {
        public int Id { get; set; }
        public GetByIdReceiptQueryRequest(int id)
        {
            this.Id = id;
        }
    }
}

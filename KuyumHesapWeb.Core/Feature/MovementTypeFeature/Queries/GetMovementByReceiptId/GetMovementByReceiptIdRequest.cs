using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MovementTypeFeature.Queries.GetMovementByReceiptId
{
    public class GetMovementByReceiptIdRequest : IRequest<ResponseDto<List<GetMovementByReceiptIdResponse>>>
    {
        public int ReceiptId { get; set; }
        public GetMovementByReceiptIdRequest(int receiptId)
        {
            this.ReceiptId = receiptId;
        }
    }
}

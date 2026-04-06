using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ReceiptFeature.Commands.Delete
{
    public class DeleteReceiptCommandRequest : IRequest<ResponseDto<DeleteReceiptCommandResponse>>
    {
        public int ReceiptId { get; set; }
        public DeleteReceiptCommandRequest(int receiptId)
        {
            this.ReceiptId = receiptId;
        }
    }
}

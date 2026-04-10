using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MovementFeature.Commands.MutabakatUpdate
{
    public class MutabakatUpdateCommandRequest : IRequest<ResponseDto<MutabakatUpdateCommandResponse>>
    {
        public int MovementId { get; set; }
        public bool? IsReconciled { get; set; }
    }
}

using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MovementTypeFeature.Queries.GetById
{
    public class GetByIdMovementTypeQueryRequest : IRequest<ResponseDto<GetByIdMovementTypeQueryResponse>>
    {
        public int Id { get; set; }
        public GetByIdMovementTypeQueryRequest(int id)
        {
            this.Id = id;
        }
    }
}

using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MovementTypeFeature.Queries.GetAll
{
    public class GetAllMovementTypeQueryRequest : IRequest<ResponseDto<List<GetAllMovementTypeQueryResponse>>>
    {
    }
}

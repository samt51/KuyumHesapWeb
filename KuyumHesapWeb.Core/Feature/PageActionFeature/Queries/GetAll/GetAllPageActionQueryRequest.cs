using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PageActionFeature.Queries.GetAll
{
    public class GetAllPageActionQueryRequest : IRequest<ResponseDto<List<GetAllPageActionQueryResponse>>>
    {
    }
}

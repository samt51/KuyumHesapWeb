using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MenuFeature.Queries.GetAll
{
    public class GetAllMenuQueryRequest : IRequest<ResponseDto<List<GetAllMenuQueryResponse>>>
    {
    }
}

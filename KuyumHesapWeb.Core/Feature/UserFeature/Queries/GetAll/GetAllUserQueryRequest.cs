using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.UserFeature.Queries.GetAll
{
    public class GetAllUserQueryRequest : IRequest<ResponseDto<List<GetAllUserQueryResponse>>>
    {
    }
}

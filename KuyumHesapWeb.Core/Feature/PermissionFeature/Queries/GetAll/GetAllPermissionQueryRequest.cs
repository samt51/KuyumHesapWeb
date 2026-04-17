using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetAll
{
    public class GetAllPermissionQueryRequest : IRequest<ResponseDto<List<GetAllPermissionQueryResponse>>>
    {
    }
}

using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.UserFeature.Queries.Roles.GetById
{
    public class GetByIdRolesQueryRequest : IRequest<ResponseDto<GetByIdRolesQueryResponse>>
    {
        public int Id { get; set; }
        public GetByIdRolesQueryRequest(int id)
        {
            Id = id;
        }
    }
}

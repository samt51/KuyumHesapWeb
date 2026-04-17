using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetById
{
    public class GetByIdPermissionQueryRequest : IRequest<ResponseDto<GetByIdPermissionQueryResponse>>
    {
        public GetByIdPermissionQueryRequest(int id)
        {
            Id = id;
        }

        public int Id { get; }
    }
}

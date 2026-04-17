using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MenuFeature.Queries.GetAuthorized
{
    public class GetAuthorizedMenuQueryRequest : IRequest<ResponseDto<List<GetAuthorizedMenuQueryResponse>>>
    {
        public GetAuthorizedMenuQueryRequest(int userId)
        {
            UserId = userId;
        }

        public int UserId { get; }
    }
}

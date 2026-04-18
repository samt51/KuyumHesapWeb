using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PageActionFeature.Queries.GetAuthorized
{
    public class GetAuthorizedPageActionQueryRequest : IRequest<ResponseDto<List<GetAuthorizedPageActionQueryResponse>>>
    {
        public GetAuthorizedPageActionQueryRequest(int userId, string pageCode)
        {
            UserId = userId;
            PageCode = pageCode;
        }

        public int UserId { get; }
        public string PageCode { get; }
    }
}

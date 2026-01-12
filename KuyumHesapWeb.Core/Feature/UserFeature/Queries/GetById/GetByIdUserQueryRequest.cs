using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.UserFeature.Queries.GetById
{
    public class GetByIdUserQueryRequest : IRequest<ResponseDto<GetByIdUserQueryResponse>>
    {
        public int Id { get; set; }
        public GetByIdUserQueryRequest(int id)
        {
            this.Id = id;
        }
    }
}

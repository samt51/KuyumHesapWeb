using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetById
{
    public class GetByIdAccountQueryRequest : IRequest<ResponseDto<GetByIdAccountQueryResponse>>
    {
        public int Id { get; set; }
        public GetByIdAccountQueryRequest(int id)
        {
            this.Id = id;
        }
    }
}

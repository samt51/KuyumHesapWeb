using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.AccountTypeFeature.Queries.GetById
{
    public class GetByIdAccountTypeQueryRequest : IRequest<ResponseDto<GetByIdAccountTypeQueryResponse>>
    {
        public int Id { get; set; }
        public GetByIdAccountTypeQueryRequest(int id)
        {
            this.Id = id;   
        }
    }
}

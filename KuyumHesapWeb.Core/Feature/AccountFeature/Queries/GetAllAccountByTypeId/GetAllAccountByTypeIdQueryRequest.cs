using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetAllAccountByTypeId
{
    public class GetAllAccountByTypeIdQueryRequest : IRequest<ResponseDto<List<GetAllAccountByTypeIdQueryResponse>>>
    {
        public int AccountTypeId { get; set; }
    }
}

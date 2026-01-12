using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.AccountTypeFeature.Queries.GetAll
{
    public class GetAllAccountTypeQueryRequest : IRequest<ResponseDto<List<GetAllAccountTypeQueryResponse>>>
    {
    }
}

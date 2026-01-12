using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetAll
{
    public class GetAllAccountQueryRequest : IRequest<ResponseDto<List<GetAllAccountQueryResponse>>>
    {
        public string AccountTypeName { get; set; } = string.Empty;
    }
}

using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ExchangeFeature.Queries.GetAll
{
    public class GetAllExchangeQueryRequest : IRequest<ResponseDto<List<GetAllExchangeQueryResponse>>>
    {
    }
}

using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetAll
{
    public class GetAllCurrencyQueryRequest : IRequest<ResponseDto<List<GetAllCurrencyQueryResponse>>>
    {
    }
}

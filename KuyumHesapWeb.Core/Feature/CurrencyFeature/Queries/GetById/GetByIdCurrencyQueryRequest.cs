using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetById
{
    public class GetByIdCurrencyQueryRequest : IRequest<ResponseDto<GetByIdCurrencyQueryResponse>>
    {
        public int Id { get; set; }
        public GetByIdCurrencyQueryRequest(int id)
        {
            this.Id = id;
        }
    }
}

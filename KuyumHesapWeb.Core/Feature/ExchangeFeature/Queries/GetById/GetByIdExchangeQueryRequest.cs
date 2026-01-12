using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.CurrencyFeature.Queries.GetAll;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ExchangeFeature.Queries.GetById
{
    public class GetByIdExchangeQueryRequest : IRequest<ResponseDto<GetByIdExchangeQueryResponse>>
    {
        public int Id { get; set; }
        public GetByIdExchangeQueryRequest(int id)
        {
            this.Id = id;
        }
    }
    public class GetByIdExchangeResponseDto
    {
        public GetByIdExchangeQueryResponse GetByIdExchangeQueryResponse { get; set; }
        public List<GetAllCurrencyQueryResponse> GetAllCurrencyQueryResponses { get; set; }
        public int CurrencyId { get; set; }

    }

}

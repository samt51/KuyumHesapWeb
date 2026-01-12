using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ProductTypeFeature.Queries.GetById
{
    public class GetByIdProductTypeQueryRequest : IRequest<ResponseDto<GetByIdProductTypeQueryResponse>>
    {
        public int Id { get; set; }
        public GetByIdProductTypeQueryRequest(int id)
        {
            this.Id = id;
        }
    }
}

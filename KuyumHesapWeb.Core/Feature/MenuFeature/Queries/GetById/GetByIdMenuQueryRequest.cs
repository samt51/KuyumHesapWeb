using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MenuFeature.Queries.GetById
{
    public class GetByIdMenuQueryRequest : IRequest<ResponseDto<GetByIdMenuQueryResponse>>
    {
        public GetByIdMenuQueryRequest(int id)
        {
            Id = id;
        }

        public int Id { get; }
    }
}

using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PageActionFeature.Queries.GetById
{
    public class GetByIdPageActionQueryRequest : IRequest<ResponseDto<GetByIdPageActionQueryResponse>>
    {
        public GetByIdPageActionQueryRequest(int id)
        {
            Id = id;
        }

        public int Id { get; }
    }
}

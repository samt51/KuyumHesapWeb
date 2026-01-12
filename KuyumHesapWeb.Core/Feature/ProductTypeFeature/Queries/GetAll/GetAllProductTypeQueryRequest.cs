using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ProductTypeFeature.Queries.GetAll
{
    public class GetAllProductTypeQueryRequest : IRequest<ResponseDto<List<GetAllProductTypeQueryResponse>>>
    {
    }
}

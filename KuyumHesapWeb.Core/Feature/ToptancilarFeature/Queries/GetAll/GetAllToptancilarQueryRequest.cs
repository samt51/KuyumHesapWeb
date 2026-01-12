using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.ToptancilarFeature.Queries.GetAll
{
    public class GetAllToptancilarQueryRequest : IRequest<ResponseDto<List<GetAllToptancilarQueryResponse>>>
    {
    }
}

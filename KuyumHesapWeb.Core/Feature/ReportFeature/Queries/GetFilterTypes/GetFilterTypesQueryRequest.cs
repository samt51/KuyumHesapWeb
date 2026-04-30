
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Features.ReportFeature.Queries.GetFilterTypes
{
    public class GetFilterTypesQueryRequest : IRequest<ResponseDto<List<GetFilterTypesQueryResponse>>>
    {
    }
}

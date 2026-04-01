using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.SettingsFeature.Queries.GetAll
{
    public class GetAllSettingsQueryRequest : IRequest<ResponseDto<List<GetAllSettingsQueryResponse>>>
    {
    }
}

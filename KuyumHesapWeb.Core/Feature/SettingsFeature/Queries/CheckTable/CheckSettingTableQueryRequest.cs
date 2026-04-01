using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.SettingsFeature.Queries.CheckTable
{
    public class CheckSettingTableQueryRequest : IRequest<ResponseDto<CheckSettingTableQueryResponse>>
    {
    }
}

using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.SettingsFeature.Commands.Create
{
    public class CreateSettingCommandRequest : IRequest<ResponseDto<CreateSettingCommandResponse>>
    {
        public string Key { get; set; } = string.Empty;
        public string? Value { get; set; }
        public string? Description { get; set; }
    }
}

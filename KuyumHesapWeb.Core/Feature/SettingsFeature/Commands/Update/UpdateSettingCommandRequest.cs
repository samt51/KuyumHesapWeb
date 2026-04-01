using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.SettingsFeature.Commands.Update
{
    public class UpdateSettingCommandRequest : IRequest<ResponseDto<UpdateSettingCommandResponse>>
    {
        public List<SettingUpdateItemDto> Settings { get; set; } = new();
    }

    public class SettingUpdateItemDto
    {
        public int Id { get; set; }
        public string? Value { get; set; }
    }
}

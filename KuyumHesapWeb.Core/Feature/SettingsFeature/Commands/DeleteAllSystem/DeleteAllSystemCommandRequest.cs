using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.SettingsFeature.Commands.DeleteAllSystem
{
    public class DeleteAllSystemCommandRequest:IRequest<ResponseDto<DeleteAllSystemCommandResponse>>
    {
    }
}

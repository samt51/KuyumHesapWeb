using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.CureFeature.GetUpdatedDailyCure
{
    public class GetUpdatedDailyCureRequest : IRequest<ResponseDto<GetUpdatedDailyCureResponse>>
    {
    }
}

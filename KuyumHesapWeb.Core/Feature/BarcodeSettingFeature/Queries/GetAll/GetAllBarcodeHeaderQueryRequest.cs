using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.BarcodeSettingFeature.Queries.GetAll
{
    public class GetAllBarcodeHeaderQueryRequest : IRequest<ResponseDto<List<GetAllBarcodeHeaderQueryResponse>>>
    {
    }
}

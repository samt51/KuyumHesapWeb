using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.BarcodeSettingFeature.Queries.GetById
{
    public class GetByIdBarcodeSettingQueryRequest : IRequest<ResponseDto<GetByIdBarcodeSettingQueryResponse>>
    {
        public int Id { get; set; }
        public GetByIdBarcodeSettingQueryRequest(int id)
        {
            this.Id = id;
        }
    }
}

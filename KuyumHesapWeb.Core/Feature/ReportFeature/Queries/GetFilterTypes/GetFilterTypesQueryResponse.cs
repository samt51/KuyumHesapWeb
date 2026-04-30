
using KuyumHesapWeb.Core.Feature.ReportFeature.Dtos.Enums;

namespace KuyumHesapWeb.Core.Features.ReportFeature.Queries.GetFilterTypes
{
    public class GetFilterTypesQueryResponse
    {
        public FilterEnum FilterEnum { get; set; }
        public int TypeId { get; set; }
        public string TypeName { get; set; }
    }
}

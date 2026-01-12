using KuyumHesapWeb.Core.Feature.AccountFeature.Queries.GetById;
using KuyumHesapWeb.Core.Feature.AccountTypeFeature.Queries.GetAll;

namespace KuyumHesapWeb.Core.Feature.AccountFeature.Dtos
{
    public class GetByIdAccountAndAccountTypeResponseDto
    {
        public GetByIdAccountQueryResponse GetByIdAccountQueryResponse { get; set; }
        public List<GetAllAccountTypeQueryResponse> GetAllAccountTypeQueryResponses { get; set; }
    }
}

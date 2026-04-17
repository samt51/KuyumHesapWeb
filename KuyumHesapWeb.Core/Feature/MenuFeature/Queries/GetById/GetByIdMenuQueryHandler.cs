using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.MenuFeature.Queries.GetById
{
    public class GetByIdMenuQueryHandler : BaseHandler, IRequestHandler<GetByIdMenuQueryRequest, ResponseDto<GetByIdMenuQueryResponse>>
    {
        public GetByIdMenuQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<GetByIdMenuQueryResponse>> Handle(GetByIdMenuQueryRequest request, CancellationToken cancellationToken)
        {
            return _apiService.GetAsync<GetByIdMenuQueryResponse>($"Menu/GetById/{request.Id}");
        }
    }
}

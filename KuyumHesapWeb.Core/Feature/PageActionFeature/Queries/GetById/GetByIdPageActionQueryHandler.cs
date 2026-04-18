using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;

namespace KuyumHesapWeb.Core.Feature.PageActionFeature.Queries.GetById
{
    public class GetByIdPageActionQueryHandler : BaseHandler, IRequestHandler<GetByIdPageActionQueryRequest, ResponseDto<GetByIdPageActionQueryResponse>>
    {
        public GetByIdPageActionQueryHandler(IApiService apiService) : base(apiService)
        {
        }

        public Task<ResponseDto<GetByIdPageActionQueryResponse>> Handle(GetByIdPageActionQueryRequest request, CancellationToken cancellationToken)
        {
            return _apiService.GetAsync<GetByIdPageActionQueryResponse>($"PageAction/GetById/{request.Id}");
        }
    }
}

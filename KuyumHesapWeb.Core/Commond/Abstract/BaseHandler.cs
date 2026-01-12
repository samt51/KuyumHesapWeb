using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;

namespace KuyumHesapWeb.Core.Commond.Abstract
{
    public class BaseHandler
    {
        public readonly IApiService _apiService;

        public BaseHandler(IApiService apiService)
        {
            _apiService = apiService;
        }
    }
}

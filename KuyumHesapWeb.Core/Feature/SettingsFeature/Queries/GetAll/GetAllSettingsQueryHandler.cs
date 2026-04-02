using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using KuyumHesapWeb.Core.Commond.Abstract;
using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using MediatR;
using Microsoft.Extensions.Caching.Memory;

namespace KuyumHesapWeb.Core.Feature.SettingsFeature.Queries.GetAll
{
    public class GetAllSettingsQueryHandler : BaseHandler, IRequestHandler<GetAllSettingsQueryRequest, ResponseDto<List<GetAllSettingsQueryResponse>>>
    {
        private readonly IMemoryCache _memoryCache;
        private const string SettingCacheKey = "settingCachKey";

        public GetAllSettingsQueryHandler(IApiService apiService, IMemoryCache memoryCache) : base(apiService)
        {
            _memoryCache = memoryCache;
        }

        public async Task<ResponseDto<List<GetAllSettingsQueryResponse>>> Handle(GetAllSettingsQueryRequest request, CancellationToken cancellationToken)
        {
           

            if (_memoryCache.TryGetValue(SettingCacheKey, out List<GetAllSettingsQueryResponse> cached))
            {
                return new ResponseDto<List<GetAllSettingsQueryResponse>>().Success(cached);
            }

            var data = await _apiService.GetAsync<List<GetAllSettingsQueryResponse>>("Setting/GetAll");

            var result = new ResponseDto<List<GetAllSettingsQueryResponse>>();

            if (data == null || !data.isSuccess)
            {
                // API baþarýsýzsa hatalarý döndür
                return data != null
                    ? result.Fail(data.errors ?? new List<string> { "Ayarlar alýnamadý." })
                    : result.Fail("Ayarlar alýnamadý.");
            }

            if (data.data != null)
            {
                var cacheOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1)
                };
                _memoryCache.Set(SettingCacheKey, data, cacheOptions);
            }

            return data;
        }
    }
}
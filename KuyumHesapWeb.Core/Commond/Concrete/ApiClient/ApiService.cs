using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using System.Text;
using System.Text.Json;

namespace KuyumHesapWeb.Core.Commond.Concrete.ApiClient
{
    public class ApiService : IApiService
    {
        private readonly HttpClient _httpClient;

        private static readonly JsonSerializerOptions JsonOpt = new()
        {
            PropertyNameCaseInsensitive = true
        };

        public ApiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // 🔹 GET
        public Task<ResponseDto<TResponse>> GetAsync<TResponse>(string url)
            => SendAsync<TResponse>(() => _httpClient.GetAsync(url));

        // 🔹 POST
        public Task<ResponseDto<TResponse>> PostAsync<TRequest, TResponse>(string url, TRequest data)
            => SendAsync<TResponse>(() => _httpClient.PostAsync(url, CreateJsonContent(data)));

        // 🔹 PUT
        public Task<ResponseDto<TResponse>> PutAsync<TRequest, TResponse>(string url, TRequest data)
            => SendAsync<TResponse>(() => _httpClient.PutAsync(url, CreateJsonContent(data)));

        // 🔹 DELETE
        public Task<ResponseDto<TResponse>> DeleteAsync<TResponse>(string url)
            => SendAsync<TResponse>(() => _httpClient.DeleteAsync(url));

        // ================= CORE =================

        private async Task<ResponseDto<TResponse>> SendAsync<TResponse>(Func<Task<HttpResponseMessage>> send)
        {
            try
            {
                using var resp = await send();
                return await ReadResponse<TResponse>(resp);
            }
            catch (TaskCanceledException)
            {
                return new ResponseDto<TResponse>
                {
                    isSuccess = false,
                    statusCode = 408,
                    errors = new List<string> { "İstek zaman aşımına uğradı. Lütfen tekrar deneyiniz." }
                };
            }
            catch (HttpRequestException)
            {
                return new ResponseDto<TResponse>
                {
                    isSuccess = false,
                    statusCode = 503,
                    errors = new List<string> { "Servise şu an ulaşılamıyor. Lütfen daha sonra tekrar deneyiniz." }
                };
            }
            catch (Exception)
            {
                // İstersen bunu kaldırabilirsin, ama prod'da güvenli olur:
                return new ResponseDto<TResponse>
                {
                    isSuccess = false,
                    statusCode = 500,
                    errors = new List<string> { "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyiniz." }
                };
            }
        }

        // ================= HELPERS =================

        private static StringContent CreateJsonContent<T>(T data)
        {
            var json = JsonSerializer.Serialize(data, JsonOpt);
            return new StringContent(json, Encoding.UTF8, "application/json");
        }

        private static async Task<ResponseDto<T>> ReadResponse<T>(HttpResponseMessage response)
        {
            string json = "";
            try
            {
                json = await response.Content.ReadAsStringAsync();
            }
            catch
            {
                // body okunamazsa da fallback döneceğiz
            }

            // Body boşsa
            if (string.IsNullOrWhiteSpace(json))
            {
                return new ResponseDto<T>
                {
                    isSuccess = response.IsSuccessStatusCode,
                    statusCode = (int)response.StatusCode,
                    errors = response.IsSuccessStatusCode ? new List<string>() : new List<string> { "Sunucudan geçersiz yanıt alındı." }
                };
            }

            var result = JsonSerializer.Deserialize<ResponseDto<T>>(json, JsonOpt);

            // Deserialize başarısızsa
            if (result == null)
            {
                return new ResponseDto<T>
                {
                    isSuccess = false,
                    statusCode = (int)response.StatusCode,
                    errors = new List<string> { "Sunucudan geçersiz yanıt alındı." }
                };
            }

            // API isSuccess set etmiyorsa güvene al
            result.statusCode = result.statusCode == 0 ? (int)response.StatusCode : result.statusCode;

            // Eğer API 500/404 vs döndüyse ama body içinde isSuccess gelmediyse yine güvene al
            if (!response.IsSuccessStatusCode && (result.errors == null || result.errors.Count == 0))
            {
                result.isSuccess = false;
                result.errors = new List<string> { "İşlem sırasında sunucu hatası oluştu." };
            }

            return result;
        }
    }
}
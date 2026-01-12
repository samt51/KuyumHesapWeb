using KuyumHesapWeb.Core.Commond.Abstract.ApiClient;
using KuyumHesapWeb.Core.Commond.Models;
using System.Text;
using System.Text.Json;

namespace KuyumHesapWeb.Core.Commond.Concrete.ApiClient
{
    public class ApiService : IApiService
    {
        private readonly HttpClient _httpClient;
        private static readonly JsonSerializerOptions JsonOpt = new(JsonSerializerDefaults.Web);

        public ApiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }


        public async Task<ResponseDto<TResponse>> GetAsync<TResponse>(string url)
        {
            var response = await _httpClient.GetAsync(url);
            return await ReadResponse<TResponse>(response);
        }

        // 🔹 POST
        public async Task<ResponseDto<TResponse>> PostAsync<TRequest, TResponse>(string url, TRequest data)
        {
            var content = CreateJsonContent(data);
            var response = await _httpClient.PostAsync(url, content);
            return await ReadResponse<TResponse>(response);
        }

        // 🔹 PUT
        public async Task<ResponseDto<TResponse>> PutAsync<TRequest, TResponse>(string url, TRequest data)
        {
            var content = CreateJsonContent(data);
            var response = await _httpClient.PutAsync(url, content);
            return await ReadResponse<TResponse>(response);
        }

        // 🔹 DELETE
        public async Task<ResponseDto<TResponse>> DeleteAsync<TResponse>(string url)
        {
            var response = await _httpClient.DeleteAsync(url);
            return await ReadResponse<TResponse>(response);
        }

        // ================= HELPERS =================

        private static StringContent CreateJsonContent<T>(T data)
        {
            var json = JsonSerializer.Serialize(data, JsonOpt);
            return new StringContent(json, Encoding.UTF8, "application/json");
        }

        private static async Task<ResponseDto<T>> ReadResponse<T>(HttpResponseMessage response)
        {
            var json = await response.Content.ReadAsStringAsync();

            if (string.IsNullOrWhiteSpace(json))
                return new ResponseDto<T> { isSuccess = false, statusCode = (int)response.StatusCode };

            return JsonSerializer.Deserialize<ResponseDto<T>>(json, JsonOpt)
                   ?? new ResponseDto<T> { isSuccess = false, statusCode = (int)response.StatusCode };
        }
    }
}
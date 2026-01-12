using KuyumHesapWeb.Core.Commond.Models;

namespace KuyumHesapWeb.Core.Commond.Abstract.ApiClient
{
    public interface IApiService
    {
        Task<ResponseDto<TResponse>> GetAsync<TResponse>(string url);
        Task<ResponseDto<TResponse>> PostAsync<TRequest, TResponse>(string url, TRequest data);
        Task<ResponseDto<TResponse>> PutAsync<TRequest, TResponse>(string url, TRequest data);
        Task<ResponseDto<TResponse>> DeleteAsync<TResponse>(string url);
    }
}

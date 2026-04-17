using Microsoft.AspNetCore.Http;
using System.Net.Http.Headers;

namespace KuyumHesapWeb.Core.Commond.Concrete
{
    public class JwtHandler : DelegatingHandler
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public JwtHandler(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            var token = httpContext?.Request.Cookies["AuthToken"];
            var incomingAuthorization = httpContext?.Request.Headers["Authorization"].ToString();

            if (string.IsNullOrWhiteSpace(token)
                && !string.IsNullOrWhiteSpace(incomingAuthorization)
                && incomingAuthorization.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            {
                token = incomingAuthorization["Bearer ".Length..].Trim();
            }

            if (string.IsNullOrWhiteSpace(token))
            {
                token = httpContext?.User.FindFirst("access_token")?.Value;
            }

            if (!string.IsNullOrWhiteSpace(token))
            {
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            }

            return base.SendAsync(request, cancellationToken);
        }
    }
}

using KuyumHesapWeb.Core.Feature.AuthFeature.Commands.Login;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace KuyumHesapWeb.UI.Controllers
{
    public class AuthController : Controller
    {
        private readonly IMediator _mediator;
        private readonly IWebHostEnvironment _env;


        public AuthController(IMediator mediator, IWebHostEnvironment env)
        {
            _mediator = mediator;
            _env = env;
        }

        private CookieOptions BuildAuthCookieOptions(DateTimeOffset expires)
        {
            var host = Request.Host.Host;
            var isLocalhost = host.Equals("localhost", StringComparison.OrdinalIgnoreCase);

            return new CookieOptions
            {
                HttpOnly = true,
                Secure = !isLocalhost,                    // prod true
                SameSite = isLocalhost ? SameSiteMode.Lax : SameSiteMode.None,
                Domain = isLocalhost ? null : ".kuyumhesap.com",
                Path = "/",
                Expires = expires,
                IsEssential = true
            };
        }

        private CookieOptions BuildClientAuthCookieOptions(DateTimeOffset expires)
        {
            var options = BuildAuthCookieOptions(expires);
            options.HttpOnly = false;
            return options;
        }

        private CookieOptions BuildAuthCookieDeleteOptions()
        {
            var host = Request.Host.Host;
            var isLocalhost = host.Equals("localhost", StringComparison.OrdinalIgnoreCase);

            return new CookieOptions
            {
                Secure = !isLocalhost,
                SameSite = isLocalhost ? SameSiteMode.Lax : SameSiteMode.None,
                Domain = isLocalhost ? null : ".kuyumhesap.com",
                Path = "/"
            };
        }


        [HttpGet]
        public IActionResult Login(string? returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> LoginAsync(LoginCommandRequest request, string? returnUrl = null)
        {
            var data = await _mediator.Send(request);

            if (!data.isSuccess)
            {
                ModelState.AddModelError(string.Empty, data.errors?.FirstOrDefault() ?? "Giriş başarısız.");
                ViewData["ReturnUrl"] = returnUrl;
                return View("Login", request);
            }

            // JWT cookie
            Response.Cookies.Append("AuthToken", data.data.token, BuildAuthCookieOptions(data.data.tokenExpireDate));

            // MVC cookie (Authorize bunu okur)
            var claims = BuildClaimsFromToken(data.data.token, request.UserName);
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(identity),
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = data.data.tokenExpireDate
                });

            if (!string.IsNullOrWhiteSpace(returnUrl) && Url.IsLocalUrl(returnUrl))
                return LocalRedirect(returnUrl);

            return Redirect("/Dashboard/IndexDashboard");
        }
        [HttpPost]
        public async Task<IActionResult> LogoutAsync()
        {

            await HttpContext.SignOutAsync(
                CookieAuthenticationDefaults.AuthenticationScheme
            );

            if (Request.Cookies.ContainsKey("AuthToken"))
            {
                Response.Cookies.Delete("AuthToken", BuildAuthCookieDeleteOptions());
            }

            if (Request.Cookies.ContainsKey("AuthTokenClient"))
            {
                Response.Cookies.Delete("AuthTokenClient", BuildAuthCookieDeleteOptions());
            }
            return RedirectToAction("Login", "Auth");
        }

        private static List<Claim> BuildClaimsFromToken(string token, string userName)
        {
            var claims = new List<Claim>
            {
                new Claim("userName", userName)
            };

            if (string.IsNullOrWhiteSpace(token))
            {
                return claims;
            }

            claims.Add(new Claim("access_token", token));

            var parts = token.Split('.');
            if (parts.Length < 2)
            {
                return claims;
            }

            try
            {
                var payload = parts[1].Replace('-', '+').Replace('_', '/');
                payload = payload.PadRight(payload.Length + (4 - payload.Length % 4) % 4, '=');
                using var doc = JsonDocument.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(payload)));

                foreach (var property in doc.RootElement.EnumerateObject())
                {
                    AddClaim(claims, property.Name, property.Value);
                }

                AddAliasClaim(claims, "Id", ClaimTypes.NameIdentifier);
                AddAliasClaim(claims, "id", ClaimTypes.NameIdentifier);
                AddAliasClaim(claims, "roleId", "roleId");
                AddAliasClaim(claims, "roleName", ClaimTypes.Role);
            }
            catch
            {
                return claims;
            }

            return claims
                .GroupBy(x => new { x.Type, x.Value })
                .Select(x => x.First())
                .ToList();
        }

        private static void AddClaim(List<Claim> claims, string type, JsonElement value)
        {
            if (value.ValueKind == JsonValueKind.String)
            {
                var stringValue = value.GetString();
                if (!string.IsNullOrWhiteSpace(stringValue))
                {
                    claims.Add(new Claim(type, stringValue));
                }
                return;
            }

            if (value.ValueKind == JsonValueKind.Number || value.ValueKind == JsonValueKind.True || value.ValueKind == JsonValueKind.False)
            {
                claims.Add(new Claim(type, value.ToString()));
                return;
            }

            if (value.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in value.EnumerateArray())
                {
                    AddClaim(claims, type, item);
                }
            }
        }

        private static void AddAliasClaim(List<Claim> claims, string sourceType, string targetType)
        {
            var value = claims.FirstOrDefault(x => string.Equals(x.Type, sourceType, StringComparison.OrdinalIgnoreCase))?.Value;
            if (!string.IsNullOrWhiteSpace(value) && !claims.Any(x => x.Type == targetType && x.Value == value))
            {
                claims.Add(new Claim(targetType, value));
            }
        }
    }
}

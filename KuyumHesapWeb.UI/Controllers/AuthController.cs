using KuyumHesapWeb.Core.Feature.AuthFeature.Commands.Login;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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
            var claims = new List<Claim> { new Claim(ClaimTypes.Name, request.Email) };
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
                Response.Cookies.Delete("AuthToken", new CookieOptions
                {
                    Path = "/"
                });
            }
            return RedirectToAction("Login", "Auth");
        }
    }
}

using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.AuthFeature.Commands.Login;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using NuGet.Common;
using System.Security.Claims;

namespace KuyumHesapWeb.UI.Controllers
{
    public class AuthController : Controller
    {
        private readonly IMediator _mediator;

        public AuthController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> LoginAsync(LoginCommandRequest request)
        {
            var data = await _mediator.Send(request);
            Response.Cookies.Append("AuthToken", data.data.token, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,                 // localhost http
                SameSite = SameSiteMode.Lax,
                Path = "/",                     // ✅ çok önemli
                MaxAge = TimeSpan.FromHours(1)
            });
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name,  "user"),
    };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                principal,
                new AuthenticationProperties
                {
                    IsPersistent = true,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddHours(1)
                });

            return RedirectToAction("Dashboard", "Dashboard");
        }
        [HttpPost]
        public async Task<IActionResult> LogoutAsync()
        {
            // 1️⃣ Authentication cookie temizle
            await HttpContext.SignOutAsync(
                CookieAuthenticationDefaults.AuthenticationScheme
            );

            // 2️⃣ AuthToken cookie sil
            if (Request.Cookies.ContainsKey("AuthToken"))
            {
                Response.Cookies.Delete("AuthToken", new CookieOptions
                {
                    Path = "/" // ⚠️ Login'de verdiğin Path ile aynı olmalı
                });
            }

            // 3️⃣ Login sayfasına yönlendir
            return RedirectToAction("Login", "Auth");
        }
    }
}

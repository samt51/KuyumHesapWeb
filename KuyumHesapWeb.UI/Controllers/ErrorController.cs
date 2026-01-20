using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{
    public class ErrorController : Controller
    {
        // UseExceptionHandler buraya düşer (500)
        [Route("Error")]
        public IActionResult Error()
        {
            // burada log da atabilirsin
            var feature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();
            ViewBag.Path = feature?.Path;
            ViewBag.Message = feature?.Error?.Message; // prod'da göstermek istemezsen kaldır

            Response.StatusCode = 500;
            return View("Error500");
        }

        // UseStatusCodePagesWithReExecute buraya düşer (404/403/503...)
        [Route("Error/{statusCode:int}")]
        public IActionResult ErrorWithStatusCode(int statusCode)
        {
            Response.StatusCode = statusCode;

            return statusCode switch
            {
                404 => View("Error404"),
                403 => View("Error403"),
                401 => View("Error401"),
                503 => View("Error503"),
                _ => View("ErrorGeneric")
            };
        }
    }
}

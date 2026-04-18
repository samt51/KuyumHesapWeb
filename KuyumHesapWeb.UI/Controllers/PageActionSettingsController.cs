using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.PageActionFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.PageActionFeature.Commands.Delete;
using KuyumHesapWeb.Core.Feature.PageActionFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.PageActionFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.PageActionFeature.Queries.GetAuthorized;
using KuyumHesapWeb.Core.Feature.PageActionFeature.Queries.GetById;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetUserPermissions;
using KuyumHesapWeb.Core.Feature.UserFeature.Queries.GetAll;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace KuyumHesapWeb.UI.Controllers
{
    public class PageActionSettingsController : Controller
    {
        private readonly IMediator _mediator;

        public PageActionSettingsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public async Task<IActionResult> Index()
        {
            var roleIds = TryGetCurrentRoleIds();
            if (!roleIds.Any())
            {
                roleIds = await TryGetCurrentUserRoleIdsAsync();
            }

            if (!roleIds.Contains(3))
            {
                return Forbid();
            }

            return View();
        }

        [HttpGet]
        public Task<ResponseDto<List<GetAllPageActionQueryResponse>>> GetAll()
        {
            return _mediator.Send(new GetAllPageActionQueryRequest());
        }

        [HttpGet("PageActionSettings/GetById/{id:int}")]
        public async Task<ResponseDto<GetByIdPageActionQueryResponse>> GetById(int id)
        {
            var allActions = await _mediator.Send(new GetAllPageActionQueryRequest());
            var item = allActions.data?.FirstOrDefault(x => x.Id == id);

            return new ResponseDto<GetByIdPageActionQueryResponse>
            {
                data = item is null ? null : new GetByIdPageActionQueryResponse
                {
                    Id = item.Id,
                    Name = item.Name,
                    Code = item.Code,
                    PageCode = item.PageCode,
                    IconUrl = item.IconUrl,
                    OrderNo = item.OrderNo,
                    RequiredPermissionCode = item.RequiredPermissionCode
                },
                isSuccess = item is not null && allActions.isSuccess,
                statusCode = item is null ? 404 : allActions.statusCode,
                errors = item is null ? new List<string> { "Aksiyon bulunamadı." } : allActions.errors
            };
        }

        [HttpPost]
        public Task<ResponseDto<CreatePageActionCommandResponse>> Create([FromBody] CreatePageActionCommandRequest request)
        {
            return _mediator.Send(request);
        }

        [HttpPut]
        public Task<ResponseDto<UpdatePageActionCommandResponse>> Update([FromBody] UpdatePageActionCommandRequest request)
        {
            return _mediator.Send(request);
        }

        [HttpDelete("PageActionSettings/Delete/{id:int}")]
        public Task<ResponseDto<DeletePageActionCommandResponse>> Delete(int id)
        {
            return _mediator.Send(new DeletePageActionCommandRequest(id));
        }

        [HttpGet]
        public async Task<ResponseDto<List<GetAuthorizedPageActionQueryResponse>>> GetAuthorizedForCurrentPage([FromQuery] string pageCode)
        {
            var roleIds = TryGetCurrentRoleIds();
            if (!roleIds.Any())
            {
                roleIds = await TryGetCurrentUserRoleIdsAsync();
            }

            if (!string.IsNullOrWhiteSpace(pageCode) && roleIds.Any(roleId => roleId == 1 || roleId == 3))
            {
                var allActions = await _mediator.Send(new GetAllPageActionQueryRequest());
                return new ResponseDto<List<GetAuthorizedPageActionQueryResponse>>
                {
                    data = allActions.data?
                        .Where(x => string.Equals(x.PageCode, pageCode, StringComparison.OrdinalIgnoreCase))
                        .OrderBy(x => x.OrderNo ?? 0)
                        .Select(x => new GetAuthorizedPageActionQueryResponse
                        {
                            Id = x.Id,
                            Name = x.Name,
                            Code = x.Code,
                            PageCode = x.PageCode,
                            IconUrl = x.IconUrl,
                            OrderNo = x.OrderNo,
                            RequiredPermissionCode = x.RequiredPermissionCode
                        })
                        .ToList() ?? new List<GetAuthorizedPageActionQueryResponse>(),
                    isSuccess = allActions.isSuccess,
                    statusCode = allActions.statusCode,
                    errors = allActions.errors
                };
            }

            var userId = TryGetCurrentUserId();
            if (userId.HasValue && !string.IsNullOrWhiteSpace(pageCode))
            {
                return await _mediator.Send(new GetAuthorizedPageActionQueryRequest(userId.Value, pageCode));
            }

            return new ResponseDto<List<GetAuthorizedPageActionQueryResponse>>
            {
                data = new List<GetAuthorizedPageActionQueryResponse>(),
                isSuccess = true,
                statusCode = 200
            };
        }

        [HttpGet]
        public async Task<ResponseDto<List<string>>> GetCurrentUserPermissionCodes()
        {
            var userId = TryGetCurrentUserId();
            if (!userId.HasValue)
            {
                return new ResponseDto<List<string>>
                {
                    data = new List<string>(),
                    isSuccess = true,
                    statusCode = 200
                };
            }

            var permissions = await _mediator.Send(new GetUserPermissionsQueryRequest(userId.Value));
            return new ResponseDto<List<string>>
            {
                data = permissions.data?
                    .Select(x => x.PermissionCode)
                    .Where(x => !string.IsNullOrWhiteSpace(x))
                    .Distinct(StringComparer.OrdinalIgnoreCase)
                    .Cast<string>()
                    .ToList() ?? new List<string>(),
                isSuccess = permissions.isSuccess,
                statusCode = permissions.statusCode,
                errors = permissions.errors
            };
        }

        private int? TryGetCurrentUserId()
        {
            var claimValue =
                User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                User.FindFirstValue("nameid") ??
                User.FindFirstValue("sub") ??
                User.FindFirstValue("userId") ??
                User.FindFirstValue("UserId");

            if (int.TryParse(claimValue, out var id))
            {
                return id;
            }

            var token = Request.Cookies["AuthToken"];
            if (string.IsNullOrWhiteSpace(token))
            {
                return null;
            }

            var parts = token.Split('.');
            if (parts.Length < 2)
            {
                return null;
            }

            try
            {
                var payload = parts[1].Replace('-', '+').Replace('_', '/');
                payload = payload.PadRight(payload.Length + (4 - payload.Length % 4) % 4, '=');
                using var doc = JsonDocument.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(payload)));

                foreach (var key in new[] { "nameid", "sub", "userId", "UserId", "id", "Id" })
                {
                    if (!doc.RootElement.TryGetProperty(key, out var value))
                    {
                        continue;
                    }

                    if (value.ValueKind == JsonValueKind.Number && value.TryGetInt32(out id))
                    {
                        return id;
                    }

                    if (value.ValueKind == JsonValueKind.String && int.TryParse(value.GetString(), out id))
                    {
                        return id;
                    }
                }
            }
            catch
            {
                return null;
            }

            return null;
        }

        private List<int> TryGetCurrentRoleIds()
        {
            var roleIds = new List<int>();
            foreach (var claim in User.Claims)
            {
                // Güvenlik Düzeltmesi: Sadece anahtar kelimesinde "role" geçen verileri Rol olarak kabul et
                if (IsRoleIdKey(claim.Type))
                {
                    AddRoleIds(roleIds, claim.Value);
                }
            }

            var token = Request.Cookies["AuthToken"];
            if (string.IsNullOrWhiteSpace(token))
            {
                return roleIds.Distinct().ToList();
            }

            var parts = token.Split('.');
            if (parts.Length < 2)
            {
                return roleIds.Distinct().ToList();
            }

            try
            {
                var payload = parts[1].Replace('-', '+').Replace('_', '/');
                payload = payload.PadRight(payload.Length + (4 - payload.Length % 4) % 4, '=');
                using var doc = JsonDocument.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(payload)));
                CollectRoleIds(roleIds, doc.RootElement);
            }
            catch
            {
                return roleIds.Distinct().ToList();
            }

            return roleIds.Distinct().ToList();
        }

        private async Task<List<int>> TryGetCurrentUserRoleIdsAsync()
        {
            var userName = TryGetCurrentUserName();
            if (string.IsNullOrWhiteSpace(userName))
            {
                return new List<int>();
            }

            var users = await _mediator.Send(new GetAllUserQueryRequest());
            var user = users.data?.FirstOrDefault(x => string.Equals(x.UserName, userName, StringComparison.OrdinalIgnoreCase));
            var roleId = user?.RoleResponse?.Id;
            return roleId.HasValue && roleId.Value > 0
                ? new List<int> { roleId.Value }
                : new List<int>();
        }

        private string? TryGetCurrentUserName()
        {
            var claimValue =
                User.FindFirstValue("userName") ??
                User.FindFirstValue(ClaimTypes.Name) ??
                User.FindFirstValue("unique_name") ??
                User.FindFirstValue("sub");

            if (!string.IsNullOrWhiteSpace(claimValue))
            {
                return claimValue;
            }

            var token = Request.Cookies["AuthToken"];
            if (string.IsNullOrWhiteSpace(token))
            {
                return null;
            }

            var parts = token.Split('.');
            if (parts.Length < 2)
            {
                return null;
            }

            try
            {
                var payload = parts[1].Replace('-', '+').Replace('_', '/');
                payload = payload.PadRight(payload.Length + (4 - payload.Length % 4) % 4, '=');
                using var doc = JsonDocument.Parse(Encoding.UTF8.GetString(Convert.FromBase64String(payload)));

                foreach (var key in new[] { "userName", "UserName", "unique_name", "name", "sub" })
                {
                    if (doc.RootElement.TryGetProperty(key, out var value) && value.ValueKind == JsonValueKind.String)
                    {
                        return value.GetString();
                    }
                }
            }
            catch
            {
                return null;
            }

            return null;
        }

        private static void CollectRoleIds(List<int> roleIds, JsonElement element)
        {
            if (element.ValueKind == JsonValueKind.Object)
            {
                foreach (var property in element.EnumerateObject())
                {
                    if (IsRoleIdKey(property.Name))
                    {
                        AddRoleIds(roleIds, property.Value);
                    }

                    if (property.Value.ValueKind is JsonValueKind.Object or JsonValueKind.Array)
                    {
                        CollectRoleIds(roleIds, property.Value);
                    }
                }
                return;
            }

            if (element.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in element.EnumerateArray())
                {
                    CollectRoleIds(roleIds, item);
                }
            }
        }

        private static void AddRoleIds(List<int> roleIds, JsonElement value)
        {
            if (value.ValueKind == JsonValueKind.Number && value.TryGetInt32(out var id))
            {
                roleIds.Add(id);
            }
            else if (value.ValueKind == JsonValueKind.String)
            {
                AddRoleIds(roleIds, value.GetString());
            }
            else if (value.ValueKind == JsonValueKind.Array)
            {
                foreach (var item in value.EnumerateArray())
                {
                    AddRoleIds(roleIds, item);
                }
            }
        }

        private static void AddRoleIds(List<int> roleIds, string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return;
            }

            foreach (var part in value.Split(',', ';', '|', ' '))
            {
                if (int.TryParse(part.Trim(), out var id))
                {
                    roleIds.Add(id);
                }
            }
        }

        private static bool IsRoleIdKey(string key)
        {
            return key.Contains("role", StringComparison.OrdinalIgnoreCase);
        }
    }
}

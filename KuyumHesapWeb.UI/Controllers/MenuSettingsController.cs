using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.MenuFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.MenuFeature.Commands.Delete;
using KuyumHesapWeb.Core.Feature.MenuFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.MenuFeature.Commands.UpdateMenuIsActive;
using KuyumHesapWeb.Core.Feature.MenuFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.MenuFeature.Queries.GetAuthorized;
using KuyumHesapWeb.Core.Feature.MenuFeature.Queries.GetById;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.AssignRolePermission;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.AssignUserPermission;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.Delete;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.DeleteRolePermission;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.DeleteUserPermission;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.Update;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetById;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetRolePermissions;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetUserPermissions;
using KuyumHesapWeb.Core.Feature.UserFeature.Queries.GetAll;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

namespace KuyumHesapWeb.UI.Controllers
{
    public class MenuSettingsController : Controller
    {
        private readonly IMediator _mediator;

        public MenuSettingsController(IMediator mediator)
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
        public async Task<ResponseDto<List<GetAllMenuQueryResponse>>> GetAll()
        {
            return await _mediator.Send(new GetAllMenuQueryRequest());
        }

        [HttpGet("MenuSettings/GetAuthorized/{userId:int}")]
        public Task<ResponseDto<List<GetAuthorizedMenuQueryResponse>>> GetAuthorized(int userId)
        {
            return _mediator.Send(new GetAuthorizedMenuQueryRequest(userId));
        }

        [HttpGet]
        public async Task<ResponseDto<List<GetAuthorizedMenuQueryResponse>>> GetAuthorizedForCurrentUser()
        {
            var userId = TryGetCurrentUserId();
            if (!userId.HasValue)
            {
                userId = await TryGetCurrentUserIdAsync();
            }

            if (userId.HasValue)
            {
                return await _mediator.Send(new GetAuthorizedMenuQueryRequest(userId.Value));
            }

            return new ResponseDto<List<GetAuthorizedMenuQueryResponse>>
            {
                data = new List<GetAuthorizedMenuQueryResponse>(),
                isSuccess = true,
                statusCode = 200
            };
        }

        [HttpGet("MenuSettings/GetById/{id:int}")]
        public Task<ResponseDto<GetByIdMenuQueryResponse>> GetById(int id)
        {
            return _mediator.Send(new GetByIdMenuQueryRequest(id));
        }

        [HttpPost]
        public async Task<ResponseDto<CreateMenuCommandResponse>> Create([FromBody] CreateMenuCommandRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpPut]
        public async Task<ResponseDto<UpdateMenuCommandResponse>> Update([FromBody] UpdateMenuCommandRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpPut]
        public async Task<ResponseDto<UpdateMenuIsActiveCommandResponse>> UpdatesIsActive([FromBody] UpdateMenuIsActiveCommandRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpDelete("MenuSettings/Delete/{id:int}")]
        public Task<ResponseDto<DeleteMenuCommandResponse>> Delete(int id)
        {
            return _mediator.Send(new DeleteMenuCommandRequest(id));
        }

        [HttpGet]
        public Task<ResponseDto<List<GetAllPermissionQueryResponse>>> GetPermissions()
        {
            return _mediator.Send(new GetAllPermissionQueryRequest());
        }

        [HttpGet("MenuSettings/GetPermissionById/{id:int}")]
        public Task<ResponseDto<GetByIdPermissionQueryResponse>> GetPermissionById(int id)
        {
            return _mediator.Send(new GetByIdPermissionQueryRequest(id));
        }

        [HttpPost]
        public Task<ResponseDto<CreatePermissionCommandResponse>> CreatePermission([FromBody] CreatePermissionCommandRequest request)
        {
            return _mediator.Send(request);
        }

        [HttpPut]
        public Task<ResponseDto<UpdatePermissionCommandResponse>> UpdatePermission([FromBody] UpdatePermissionCommandRequest request)
        {
            return _mediator.Send(request);
        }

        [HttpDelete("MenuSettings/DeletePermission/{id:int}")]
        public Task<ResponseDto<DeletePermissionCommandResponse>> DeletePermission(int id)
        {
            return _mediator.Send(new DeletePermissionCommandRequest(id));
        }

        [HttpGet("MenuSettings/GetRolePermissions/{roleId:int}")]
        public Task<ResponseDto<List<GetRolePermissionsQueryResponse>>> GetRolePermissions(int roleId)
        {
            return _mediator.Send(new GetRolePermissionsQueryRequest(roleId));
        }

        [HttpPost]
        public Task<ResponseDto<AssignRolePermissionCommandResponse>> AssignRolePermission([FromBody] AssignRolePermissionCommandRequest request)
        {
            return _mediator.Send(request);
        }

        [HttpDelete]
        public Task<ResponseDto<DeleteRolePermissionCommandResponse>> DeleteRolePermission([FromQuery] int roleId, [FromQuery] int permissionId)
        {
            return _mediator.Send(new DeleteRolePermissionCommandRequest { RoleId = roleId, PermissionId = permissionId });
        }

        [HttpGet("MenuSettings/GetUserPermissions/{userId:int}")]
        public Task<ResponseDto<List<GetUserPermissionsQueryResponse>>> GetUserPermissions(int userId)
        {
            return _mediator.Send(new GetUserPermissionsQueryRequest(userId));
        }

        [HttpPost]
        public Task<ResponseDto<AssignUserPermissionCommandResponse>> AssignUserPermission([FromBody] AssignUserPermissionCommandRequest request)
        {
            return _mediator.Send(request);
        }

        [HttpDelete]
        public Task<ResponseDto<DeleteUserPermissionCommandResponse>> DeleteUserPermission([FromQuery] int userId, [FromQuery] int permissionId)
        {
            return _mediator.Send(new DeleteUserPermissionCommandRequest { UserId = userId, PermissionId = permissionId });
        }

        [HttpGet("MenuSettings/GetCurrentRoleIds")]
        public async Task<ResponseDto<List<int>>> GetCurrentRoleIds()
        {
            var roleIds = TryGetCurrentRoleIds();
            if (!roleIds.Any())
            {
                roleIds = await TryGetCurrentUserRoleIdsAsync();
            }

            return new ResponseDto<List<int>>
            {
                data = roleIds,
                isSuccess = true,
                statusCode = 200
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

        private async Task<int?> TryGetCurrentUserIdAsync()
        {
            var userName = TryGetCurrentUserName();
            if (string.IsNullOrWhiteSpace(userName))
            {
                return null;
            }

            var users = await _mediator.Send(new GetAllUserQueryRequest());
            return users.data?
                .FirstOrDefault(x => string.Equals(x.UserName, userName, StringComparison.OrdinalIgnoreCase))
                ?.Id;
        }

        private List<int> TryGetCurrentRoleIds()
        {
            var roleIds = new List<int>();
            foreach (var claim in User.Claims)
            {
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

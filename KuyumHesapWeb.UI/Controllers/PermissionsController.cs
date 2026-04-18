using KuyumHesapWeb.Core.Commond.Models;
using KuyumHesapWeb.Core.Feature.MenuFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.PageActionFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.AssignRolePermission;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.AssignUserPermission;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.Create;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.DeleteRolePermission;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Commands.DeleteUserPermission;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetRolePermissions;
using KuyumHesapWeb.Core.Feature.PermissionFeature.Queries.GetUserPermissions;
using KuyumHesapWeb.Core.Feature.UserFeature.Queries.GetAll;
using KuyumHesapWeb.Core.Feature.UserFeature.Queries.Roles.GetAll;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace KuyumHesapWeb.UI.Controllers
{
    public class PermissionsController : Controller
    {
        private readonly IMediator _mediator;

        public PermissionsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public Task<ResponseDto<List<GetAllPermissionQueryResponse>>> GetAll()
        {
            return _mediator.Send(new GetAllPermissionQueryRequest());
        }

        [HttpPost]
        public async Task<ResponseDto<object>> SyncFromDefinitions()
        {
            var permissions = await _mediator.Send(new GetAllPermissionQueryRequest());
            var existingCodes = (permissions.data ?? new List<GetAllPermissionQueryResponse>())
                .Select(x => x.Code)
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .ToHashSet(StringComparer.OrdinalIgnoreCase);

            var createdCount = 0;
            var errors = new List<string>();

            var menus = await _mediator.Send(new GetAllMenuQueryRequest());
            foreach (var menu in menus.data ?? new List<GetAllMenuQueryResponse>())
            {
                var code = FirstNotEmpty(menu.RequiredPermissionCode, menu.Code);
                if (string.IsNullOrWhiteSpace(code) || existingCodes.Contains(code))
                {
                    continue;
                }

                var result = await _mediator.Send(new CreatePermissionCommandRequest
                {
                    Name = menu.Name,
                    Code = code,
                    Description = $"{menu.Name} menü yetkisi",
                    MenuId = menu.Id,
                    IsActive = true
                });

                if (result.isSuccess)
                {
                    existingCodes.Add(code);
                    createdCount++;
                }
                else
                {
                    errors.AddRange(result.errors);
                }
            }

            var pageActions = await _mediator.Send(new GetAllPageActionQueryRequest());
            foreach (var action in pageActions.data ?? new List<GetAllPageActionQueryResponse>())
            {
                var code = FirstNotEmpty(action.RequiredPermissionCode, action.Code);
                if (string.IsNullOrWhiteSpace(code) || existingCodes.Contains(code))
                {
                    continue;
                }

                var result = await _mediator.Send(new CreatePermissionCommandRequest
                {
                    Name = action.Name,
                    Code = code,
                    Description = $"{action.PageCode} / {action.Name} sayfa aksiyon yetkisi",
                    MenuId = null,
                    IsActive = true
                });

                if (result.isSuccess)
                {
                    existingCodes.Add(code);
                    createdCount++;
                }
                else
                {
                    errors.AddRange(result.errors);
                }
            }

            return new ResponseDto<object>
            {
                data = new { createdCount },
                isSuccess = errors.Count == 0,
                statusCode = errors.Count == 0 ? 200 : 400,
                errors = errors.Distinct().ToList()
            };
        }

        [HttpGet]
        public Task<ResponseDto<List<GetAllRolesQueryResponse>>> GetRoles()
        {
            return _mediator.Send(new GetAllRolesQueryRequest());
        }

        [HttpGet]
        public Task<ResponseDto<List<GetAllUserQueryResponse>>> GetUsers()
        {
            return _mediator.Send(new GetAllUserQueryRequest());
        }

        private static string? FirstNotEmpty(params string?[] values)
        {
            return values.FirstOrDefault(value => !string.IsNullOrWhiteSpace(value))?.Trim();
        }

        [HttpGet("Permissions/GetRolePermissions/{roleId:int}")]
        public Task<ResponseDto<List<GetRolePermissionsQueryResponse>>> GetRolePermissions(int roleId)
        {
            return _mediator.Send(new GetRolePermissionsQueryRequest(roleId));
        }

        [HttpPost]
        public async Task<ResponseDto<AssignRolePermissionCommandResponse>> AssignRolePermission([FromBody] AssignRolePermissionCommandRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpDelete]
        public Task<ResponseDto<DeleteRolePermissionCommandResponse>> DeleteRolePermission([FromQuery] int roleId, [FromQuery] int permissionId)
        {
            return _mediator.Send(new DeleteRolePermissionCommandRequest { RoleId = roleId, PermissionId = permissionId });
        }

        [HttpGet("Permissions/GetUserPermissions/{userId:int}")]
        public Task<ResponseDto<List<GetUserPermissionsQueryResponse>>> GetUserPermissions(int userId)
        {
            return _mediator.Send(new GetUserPermissionsQueryRequest(userId));
        }

        [HttpPost]
        public async Task<ResponseDto<AssignUserPermissionCommandResponse>> AssignUserPermission([FromBody] AssignUserPermissionCommandRequest request)
        {
            return await _mediator.Send(request);
        }

        [HttpDelete]
        public Task<ResponseDto<DeleteUserPermissionCommandResponse>> DeleteUserPermission([FromQuery] int userId, [FromQuery] int permissionId)
        {
            return _mediator.Send(new DeleteUserPermissionCommandRequest { UserId = userId, PermissionId = permissionId });
        }
    }
}

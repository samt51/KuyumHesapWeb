document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE = '/Permissions';
    const roleModeBtn = document.getElementById('role-mode-btn');
    const userModeBtn = document.getElementById('user-mode-btn');
    const roleWrap = document.getElementById('role-picker-wrap');
    const userWrap = document.getElementById('user-picker-wrap');
    const roleSelect = document.getElementById('role-select');
    const userSelect = document.getElementById('user-select');
    const permissionList = document.getElementById('permission-list');
    const searchInput = document.getElementById('permission-search');
    const statusText = document.getElementById('permission-status');
    const selectedTitle = document.getElementById('selected-title');
    const selectedDetail = document.getElementById('selected-detail');
    const totalPermissionCount = document.getElementById('total-permission-count');
    const assignedPermissionCount = document.getElementById('assigned-permission-count');
    const toastContainer = document.getElementById('toast-container');
    const refreshBtn = document.getElementById('refresh-btn');

    let mode = 'role';
    let permissions = [];
    let roles = [];
    let users = [];
    let assignedPermissionIds = new Set();
    let busyPermissionId = null;

    const getValue = (obj, ...keys) => keys.map(key => obj && obj[key]).find(value => value !== undefined && value !== null);
    const dataOf = response => getValue(response, 'data', 'Data') ?? response;
    const isSuccess = response => getValue(response, 'isSuccess', 'IsSuccess') !== false;
    const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    const idOf = item => getValue(item, 'id', 'Id');
    const permissionNameOf = item => getValue(item, 'name', 'Name', 'permissionName', 'PermissionName') || '-';
    const permissionCodeOf = item => getValue(item, 'code', 'Code', 'permissionCode', 'PermissionCode') || '';
    const roleNameOf = role => getValue(role, 'name', 'Name') || `Rol #${idOf(role)}`;
    const roleIdOfUser = user => getValue(getValue(user, 'roleResponse', 'RoleResponse') || {}, 'id', 'Id') || '';
    const roleNameOfUser = user => getValue(getValue(user, 'roleResponse', 'RoleResponse') || {}, 'name', 'Name') || '-';
    const userNameOf = user => getValue(user, 'userName', 'UserName') || '-';
    const fullNameOf = user => `${getValue(user, 'firstName', 'FirstName') || ''} ${getValue(user, 'lastName', 'LastName') || ''}`.trim();

    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `${type === 'success' ? 'bg-rolex-green' : 'bg-red-600'} text-white px-5 py-3 rounded-md shadow-lg text-sm font-semibold`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3200);
    };

    const fetchJson = async (url, options = {}) => {
        const response = await fetch(url, {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', ...(options.headers || {}) },
            ...options
        });
        const json = await response.json();
        if (!response.ok || !isSuccess(json)) {
            const errors = getValue(json, 'errors', 'Errors');
            throw new Error(Array.isArray(errors) && errors.length ? errors[0] : 'Sunucudan geçersiz yanıt alındı.');
        }
        return dataOf(json) || [];
    };

    const selectedTargetId = () => mode === 'role' ? Number(roleSelect.value || 0) : Number(userSelect.value || 0);

    const selectedTarget = () => {
        const id = selectedTargetId();
        return mode === 'role'
            ? roles.find(role => Number(idOf(role)) === id)
            : users.find(user => Number(idOf(user)) === id);
    };

    const setMode = async nextMode => {
        if (mode === nextMode) return;
        mode = nextMode;
        roleModeBtn.classList.toggle('active', mode === 'role');
        userModeBtn.classList.toggle('active', mode === 'user');
        roleWrap.classList.toggle('hidden', mode !== 'role');
        userWrap.classList.toggle('hidden', mode !== 'user');
        assignedPermissionIds = new Set();
        renderSelectedInfo();
        renderPermissions();
        await loadAssignedPermissions();
    };

    const renderSelects = () => {
        roleSelect.innerHTML = '<option value="">Rol seçiniz</option>' + roles
            .map(role => `<option value="${esc(idOf(role))}">${esc(roleNameOf(role))}</option>`)
            .join('');

        userSelect.innerHTML = '<option value="">Kullanıcı seçiniz</option>' + users
            .map(user => {
                const title = fullNameOf(user) || userNameOf(user);
                const detail = `${userNameOf(user)}${roleIdOfUser(user) ? ` - ${roleNameOfUser(user)}` : ''}`;
                return `<option value="${esc(idOf(user))}">${esc(title)} (${esc(detail)})</option>`;
            })
            .join('');
    };

    const renderSelectedInfo = () => {
        const target = selectedTarget();
        const assignedCount = assignedPermissionIds.size;
        totalPermissionCount.textContent = permissions.length;
        assignedPermissionCount.textContent = assignedCount;

        if (!target) {
            selectedTitle.textContent = 'Henüz seçim yapılmadı';
            selectedDetail.textContent = 'İzinleri görüntülemek için rol veya kullanıcı seçin.';
            statusText.textContent = permissions.length ? 'Seçim bekleniyor.' : 'Veriler yükleniyor...';
            return;
        }

        if (mode === 'role') {
            selectedTitle.textContent = roleNameOf(target);
            selectedDetail.textContent = `Rol ID: ${idOf(target)} - ${assignedCount} izin atanmış.`;
        } else {
            const fullName = fullNameOf(target);
            selectedTitle.textContent = fullName ? `${fullName} (${userNameOf(target)})` : userNameOf(target);
            selectedDetail.textContent = `Kullanıcı ID: ${idOf(target)} - Rol: ${roleNameOfUser(target)} - ${assignedCount} izin atanmış.`;
        }
    };

    const renderPermissions = () => {
        const targetId = selectedTargetId();
        const query = searchInput.value.trim().toLocaleLowerCase('tr-TR');
        const filtered = permissions.filter(permission => {
            const text = `${permissionNameOf(permission)} ${permissionCodeOf(permission)} ${getValue(permission, 'description', 'Description') || ''}`.toLocaleLowerCase('tr-TR');
            return !query || text.includes(query);
        });

        if (!targetId) {
            permissionList.innerHTML = '<div class="permission-empty"><div><i class="fas fa-hand-pointer text-4xl text-gray-300 mb-3"></i><p class="font-semibold">Önce rol veya kullanıcı seçin.</p></div></div>';
            renderSelectedInfo();
            return;
        }

        if (!filtered.length) {
            permissionList.innerHTML = '<div class="permission-empty"><div><i class="fas fa-search text-4xl text-gray-300 mb-3"></i><p class="font-semibold">Aramaya uygun izin bulunamadı.</p></div></div>';
            renderSelectedInfo();
            return;
        }

        permissionList.innerHTML = filtered
            .sort((a, b) => permissionCodeOf(a).localeCompare(permissionCodeOf(b), 'tr'))
            .map(permission => {
                const permissionId = Number(idOf(permission));
                const assigned = assignedPermissionIds.has(permissionId);
                const code = permissionCodeOf(permission);
                const description = getValue(permission, 'description', 'Description') || '';
                const disabled = busyPermissionId === permissionId ? 'disabled' : '';

                return `
                    <div class="permission-row ${assigned ? 'assigned' : ''}" data-permission-id="${esc(permissionId)}">
                        <div class="min-w-0">
                            <div class="font-semibold text-gray-800">${esc(permissionNameOf(permission))}</div>
                            <div class="permission-code mt-1">${esc(code || 'KOD YOK')}</div>
                            ${description ? `<div class="text-xs text-gray-500 mt-1">${esc(description)}</div>` : ''}
                        </div>
                        <label class="permission-switch" title="${assigned ? 'İzni geri al' : 'İzin ver'}">
                            <input type="checkbox" ${assigned ? 'checked' : ''} ${disabled}>
                            <span class="permission-slider"></span>
                        </label>
                    </div>`;
            })
            .join('');
        renderSelectedInfo();
        statusText.textContent = `${filtered.length} izin listeleniyor.`;
    };

    const loadAssignedPermissions = async () => {
        const targetId = selectedTargetId();
        assignedPermissionIds = new Set();
        if (!targetId) {
            renderPermissions();
            return;
        }

        try {
            statusText.textContent = 'Atanmış izinler yükleniyor...';
            const url = mode === 'role'
                ? `${API_BASE}/GetRolePermissions/${targetId}`
                : `${API_BASE}/GetUserPermissions/${targetId}`;
            const assigned = await fetchJson(url);
            assignedPermissionIds = new Set((assigned || []).map(item => Number(getValue(item, 'permissionId', 'PermissionId'))).filter(Boolean));
            renderPermissions();
        } catch (error) {
            showToast(error.message, 'error');
            renderPermissions();
        }
    };

    const togglePermission = async (permissionId, checked) => {
        const targetId = selectedTargetId();
        if (!targetId) return;

        busyPermissionId = permissionId;
        renderPermissions();

        const isRoleMode = mode === 'role';
        const url = isRoleMode
            ? checked ? `${API_BASE}/AssignRolePermission` : `${API_BASE}/DeleteRolePermission?roleId=${targetId}&permissionId=${permissionId}`
            : checked ? `${API_BASE}/AssignUserPermission` : `${API_BASE}/DeleteUserPermission?userId=${targetId}&permissionId=${permissionId}`;

        const payload = isRoleMode
            ? { RoleId: targetId, PermissionId: permissionId }
            : { UserId: targetId, PermissionId: permissionId };

        try {
            await fetchJson(url, {
                method: checked ? 'POST' : 'DELETE',
                body: checked ? JSON.stringify(payload) : undefined
            });

            if (checked) {
                assignedPermissionIds.add(permissionId);
                showToast('İzin verildi.');
            } else {
                assignedPermissionIds.delete(permissionId);
                showToast('İzin geri alındı.');
            }
        } catch (error) {
            showToast(error.message, 'error');
        } finally {
            busyPermissionId = null;
            renderPermissions();
        }
    };

    permissionList.addEventListener('change', async event => {
        const checkbox = event.target.closest('input[type="checkbox"]');
        if (!checkbox) return;
        const row = checkbox.closest('[data-permission-id]');
        const permissionId = Number(row && row.dataset.permissionId);
        if (!permissionId) return;
        await togglePermission(permissionId, checkbox.checked);
    });

    roleModeBtn.addEventListener('click', () => setMode('role'));
    userModeBtn.addEventListener('click', () => setMode('user'));
    roleSelect.addEventListener('change', loadAssignedPermissions);
    userSelect.addEventListener('change', loadAssignedPermissions);
    searchInput.addEventListener('input', renderPermissions);
    refreshBtn.addEventListener('click', async () => {
        await loadBaseData();
        await loadAssignedPermissions();
    });

    async function loadBaseData() {
        statusText.textContent = 'Veriler yükleniyor...';
        try {
            statusText.textContent = 'Menü ve aksiyon izinleri hazırlanıyor...';
            await fetchJson(`${API_BASE}/SyncFromDefinitions`, { method: 'POST' });
        } catch (error) {
            console.warn('[permissions] İzin senkronizasyonu tamamlanamadı.', error);
        }

        statusText.textContent = 'İzin listesi yükleniyor...';
        const [permissionData, roleData, userData] = await Promise.all([
            fetchJson(`${API_BASE}/GetAll`),
            fetchJson(`${API_BASE}/GetRoles`),
            fetchJson(`${API_BASE}/GetUsers`)
        ]);

        permissions = (permissionData || []).filter(permission => getValue(permission, 'isActive', 'IsActive') !== false);
        roles = roleData || [];
        users = userData || [];
        renderSelects();
        renderPermissions();
    }

    try {
        await loadBaseData();
    } catch (error) {
        permissionList.innerHTML = '<div class="permission-empty"><div><i class="fas fa-triangle-exclamation text-4xl text-red-300 mb-3"></i><p class="font-semibold">İzin ekranı yüklenemedi.</p></div></div>';
        showToast(error.message, 'error');
        statusText.textContent = 'Yükleme başarısız.';
    }
});

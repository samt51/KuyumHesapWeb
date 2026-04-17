tailwind.config = {
    theme: {
        extend: {
            colors: {
                'rolex-green': '#4C9779',
                'list-item-bg': '#F0FAFA',
                'success': '#22c55e',
                'danger': '#ef4444',
                'secondary': '#6b7280'
            },
            keyframes: {
                'fade-in-out': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '10%': { opacity: '1', transform: 'translateY(0)' },
                    '90%': { opacity: '1', transform: 'translateY(0)' },
                    '100%': { opacity: '0', transform: 'translateY(20px)' }
                }
            },
            animation: {
                'fade-in-out': 'fade-in-out 3s ease-in-out forwards'
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = '/MenuSettings';
    const form = document.getElementById('menu-form');
    const listEl = document.getElementById('menu-list');
    const parentSelect = document.getElementById('parentMenuId');
    const addButtons = document.getElementById('add-mode-buttons');
    const editButtons = document.getElementById('edit-mode-buttons');
    const toastContainer = document.getElementById('toast-container');
    const deleteModal = document.getElementById('delete-modal');
    const modalMenuName = document.getElementById('modal-menu-name');
    let currentMode = 'add';
    let itemToDeleteId = null;
    let menus = [];

    const fields = {
        id: document.getElementById('menuId'),
        name: document.getElementById('menuName'),
        code: document.getElementById('menuCode'),
        url: document.getElementById('menuUrl'),
        iconUrl: document.getElementById('menuIconUrl'),
        parentId: parentSelect,
        orderNo: document.getElementById('menuOrderNo'),
        requiredPermissionCode: document.getElementById('requiredPermissionCode')
    };

    const getAuthHeaders = () => ({ 'Content-Type': 'application/json' });
    const dataOf = response => response && response.data !== undefined ? response.data : response;
    const val = (obj, ...keys) => keys.map(k => obj && obj[k]).find(v => v !== undefined && v !== null);
    const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    const normalizeIconValue = value => {
        const icon = String(value || '').trim();
        const classMatch = icon.match(/class\s*=\s*["']([^"']+)["']/i);
        return classMatch && classMatch[1] ? classMatch[1] : icon;
    };

    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `p-4 rounded-lg text-white shadow-lg animate-fade-in-out ${type === 'success' ? 'bg-rolex-green' : 'bg-danger'}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    };

    const setMode = mode => {
        currentMode = mode;
        addButtons.classList.toggle('hidden', mode === 'edit');
        editButtons.classList.toggle('hidden', mode === 'add');
    };

    const resetForm = () => {
        form.reset();
        fields.id.value = '';
        fields.parentId.value = '';
        fields.orderNo.value = '';
        setMode('add');
    };

    const getTitle = item => val(item, 'name', 'Name', 'menuName', 'MenuName') || 'Isimsiz';
    const getId = item => val(item, 'id', 'Id', 'menuId', 'MenuId');
    const getParentId = item => val(item, 'parentId', 'ParentId', 'parentMenuId', 'ParentMenuId');
    const getOrderNo = item => val(item, 'orderNo', 'OrderNo', 'order', 'Order', 'sortOrder', 'SortOrder') ?? 0;

    const flattenMenuItems = (items, parentId = null) => {
        const result = [];
        (items || []).forEach(item => {
            const children = val(item, 'menus', 'Menus', 'children', 'Children') || [];
            if (parentId !== null && (getParentId(item) === undefined || getParentId(item) === null)) {
                item.ParentId = parentId;
            }
            result.push(item);
            if (Array.isArray(children) && children.length) {
                result.push(...flattenMenuItems(children, getId(item)));
            }
        });
        return result;
    };

    const renderParentOptions = () => {
        const currentId = Number(fields.id.value || 0);
        parentSelect.innerHTML = '<option value="">Ust Menu Yok</option>';
        menus
            .filter(item => Number(getId(item)) !== currentId)
            .sort((a, b) => Number(getOrderNo(a)) - Number(getOrderNo(b)))
            .forEach(item => {
                const option = document.createElement('option');
                option.value = getId(item);
                option.textContent = getTitle(item);
                parentSelect.appendChild(option);
            });
    };

    const renderList = () => {
        if (!menus.length) {
            listEl.innerHTML = '<p class="text-center text-gray-500 p-4">Kayit bulunamadi.</p>';
            return;
        }

        listEl.innerHTML = menus
            .slice()
            .sort((a, b) => Number(getOrderNo(a)) - Number(getOrderNo(b)))
            .map((item, index) => {
                const id = getId(item);
                const parent = menus.find(x => String(getId(x)) === String(getParentId(item)));
                const code = val(item, 'code', 'Code') || '';

                return `
                    <div class="p-3 rounded cursor-pointer hover:bg-gray-200 ${index % 2 !== 0 ? 'bg-list-item-bg' : 'bg-white'} flex justify-between items-center" data-id="${esc(id)}">
                        <div>
                            <span class="font-medium text-gray-700">${esc(getTitle(item))}</span>
                            <p class="text-xs text-gray-500">${parent ? esc(getTitle(parent)) : 'Ana menu'}${code ? ' / ' + esc(code) : ''}</p>
                        </div>
                        <div class="text-right">
                            <div class="text-sm font-semibold text-gray-700">${esc(getOrderNo(item))}</div>
                        </div>
                    </div>`;
            }).join('');
    };

    const fetchMenus = async () => {
        const response = await fetch(`${API_BASE_URL}/GetAll`, { headers: getAuthHeaders() });
        const json = await response.json();
        if (!response.ok || json.isSuccess === false) {
            throw new Error((json.errors && json.errors[0]) || 'Menüler alınamadı.');
        }
        menus = flattenMenuItems(dataOf(json) || []);
        renderParentOptions();
        renderList();
    };

    const populateForm = item => {
        fields.id.value = getId(item) || '';
        fields.name.value = val(item, 'name', 'Name', 'menuName', 'MenuName') || '';
        fields.code.value = val(item, 'code', 'Code') || '';
        fields.url.value = val(item, 'url', 'Url', 'path', 'Path') || '';
        fields.iconUrl.value = val(item, 'iconUrl', 'IconUrl', 'icon', 'Icon') || '';
        fields.orderNo.value = getOrderNo(item);
        fields.requiredPermissionCode.value = val(item, 'requiredPermissionCode', 'RequiredPermissionCode') || '';
        renderParentOptions();
        fields.parentId.value = getParentId(item) || '';
        setMode('edit');
    };

    listEl.addEventListener('click', e => {
        const row = e.target.closest('[data-id]');
        if (!row) return;
        const item = menus.find(x => String(getId(x)) === String(row.dataset.id));
        if (item) populateForm(item);
    });

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const payload = {
            Name: fields.name.value,
            Code: fields.code.value,
            Url: fields.url.value,
            IconUrl: normalizeIconValue(fields.iconUrl.value),
            ParentId: fields.parentId.value ? Number(fields.parentId.value) : null,
            OrderNo: fields.orderNo.value ? Number(fields.orderNo.value) : 0,
            RequiredPermissionCode: fields.requiredPermissionCode.value
        };

        if (currentMode === 'edit') {
            payload.Id = Number(fields.id.value);
        }

        const response = await fetch(`${API_BASE_URL}/${currentMode === 'edit' ? 'Update' : 'Create'}`, {
            method: currentMode === 'edit' ? 'PUT' : 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        const json = await response.json();
        if (!response.ok || json.isSuccess === false) {
            showToast((json.errors && json.errors[0]) || 'İşlem başarısız.', 'danger');
            return;
        }

        showToast(currentMode === 'edit' ? 'Menü güncellendi.' : 'Menü eklendi.');
        await fetchMenus();
        resetForm();
    });

    document.getElementById('delete-btn').addEventListener('click', () => {
        if (!fields.id.value) return;
        itemToDeleteId = fields.id.value;
        modalMenuName.textContent = fields.name.value;
        deleteModal.classList.remove('hidden');
        deleteModal.querySelector('div').classList.add('scale-100');
    });

    const closeModal = () => {
        deleteModal.querySelector('div').classList.remove('scale-100');
        deleteModal.classList.add('hidden');
        itemToDeleteId = null;
    };

    document.getElementById('cancel-delete-btn').addEventListener('click', closeModal);
    document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
        if (!itemToDeleteId) return;
        const response = await fetch(`${API_BASE_URL}/Delete/${itemToDeleteId}`, { method: 'DELETE', headers: getAuthHeaders() });
        const json = await response.json();
        if (!response.ok || json.isSuccess === false) {
            showToast((json.errors && json.errors[0]) || 'Silme işlemi başarısız.', 'danger');
        } else {
            showToast('Menü silindi.');
            await fetchMenus();
            resetForm();
        }
        closeModal();
    });

    document.getElementById('reset-btn').addEventListener('click', resetForm);
    document.getElementById('cancel-edit-btn').addEventListener('click', resetForm);

    try {
        await fetchMenus();
        resetForm();
    } catch (error) {
        showToast(error.message, 'danger');
    }
});

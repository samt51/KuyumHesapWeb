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
    const API_BASE_URL = '/PageActionSettings';
    const form = document.getElementById('page-action-form');
    const listEl = document.getElementById('page-action-list');
    const addButtons = document.getElementById('add-mode-buttons');
    const editButtons = document.getElementById('edit-mode-buttons');
    const toastContainer = document.getElementById('toast-container');
    const deleteModal = document.getElementById('delete-modal');
    const modalActionName = document.getElementById('modal-action-name');
    let currentMode = 'add';
    let itemToDeleteId = null;
    let actions = [];

    const fields = {
        id: document.getElementById('pageActionId'),
        name: document.getElementById('actionName'),
        code: document.getElementById('actionCode'),
        pageCode: document.getElementById('pageCode'),
        iconUrl: document.getElementById('iconUrl'),
        orderNo: document.getElementById('orderNo'),
        requiredPermissionCode: document.getElementById('requiredPermissionCode')
    };

    const getAuthHeaders = () => ({ 'Content-Type': 'application/json' });
    const dataOf = response => response && response.data !== undefined ? response.data : response;
    const val = (obj, ...keys) => keys.map(k => obj && obj[k]).find(v => v !== undefined && v !== null);
    const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    const readJsonResponse = async response => {
        const text = await response.text();
        if (!text || !text.trim()) {
            return {
                isSuccess: response.ok,
                statusCode: response.status,
                data: null,
                errors: response.ok ? [] : [`Sunucu ${response.status} kodu ile boş yanıt döndü.`]
            };
        }

        try {
            return JSON.parse(text);
        } catch (error) {
            const shortText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 240);
            return {
                isSuccess: false,
                statusCode: response.status,
                data: null,
                errors: [shortText || 'Sunucudan geçersiz yanıt alındı.']
            };
        }
    };
    const normalizeIconValue = value => {
        const icon = String(value || '').trim();
        const classMatch = icon.match(/class\s*=\s*["']([^"']+)["']/i);
        return classMatch && classMatch[1] ? classMatch[1] : icon;
    };
    const errorMessageOf = json => {
        const errors = json && (json.errors || json.Errors);
        if (Array.isArray(errors) && errors.length) return errors[0];
        if (typeof errors === 'string' && errors) return errors;
        return (json && (json.message || json.Message)) || 'İşlem başarısız.';
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
        fields.orderNo.value = '';
        setMode('add');
    };

    const getId = item => val(item, 'id', 'Id', 'pageActionId', 'PageActionId');
    const getName = item => val(item, 'name', 'Name') || 'İsimsiz';
    const getCode = item => val(item, 'code', 'Code') || '';
    const getPageCode = item => val(item, 'pageCode', 'PageCode') || '';
    const getOrderNo = item => val(item, 'orderNo', 'OrderNo', 'order', 'Order') ?? 0;

    const renderList = () => {
        if (!actions.length) {
            listEl.innerHTML = '<p class="text-center text-gray-500 p-4">Kayıt bulunamadı.</p>';
            return;
        }

        listEl.innerHTML = actions
            .slice()
            .sort((a, b) => String(getPageCode(a)).localeCompare(String(getPageCode(b))) || Number(getOrderNo(a)) - Number(getOrderNo(b)))
            .map((item, index) => {
                const id = getId(item);
                const permissionCode = val(item, 'requiredPermissionCode', 'RequiredPermissionCode') || '';
                return `
                    <div class="p-3 rounded cursor-pointer hover:bg-gray-200 ${index % 2 !== 0 ? 'bg-list-item-bg' : 'bg-white'} flex justify-between items-center" data-id="${esc(id)}">
                        <div>
                            <span class="font-medium text-gray-700">${esc(getName(item))}</span>
                            <p class="text-xs text-gray-500">${esc(getPageCode(item))} / ${esc(getCode(item))}</p>
                            <p class="text-xs text-gray-400">${esc(permissionCode)}</p>
                        </div>
                        <div class="text-sm font-semibold text-gray-700">${esc(getOrderNo(item))}</div>
                    </div>`;
            }).join('');
    };

    const fetchActions = async () => {
        const response = await fetch(`${API_BASE_URL}/GetAll`, { headers: getAuthHeaders() });
        const json = await readJsonResponse(response);
        if (!response.ok || json.isSuccess === false) {
            throw new Error(errorMessageOf(json) || 'Aksiyonlar alınamadı.');
        }
        actions = dataOf(json) || [];
        renderList();
    };

    const populateForm = item => {
        fields.id.value = getId(item) || '';
        fields.name.value = getName(item);
        fields.code.value = getCode(item);
        fields.pageCode.value = getPageCode(item);
        fields.iconUrl.value = val(item, 'iconUrl', 'IconUrl') || '';
        fields.orderNo.value = getOrderNo(item);
        fields.requiredPermissionCode.value = val(item, 'requiredPermissionCode', 'RequiredPermissionCode') || '';
        setMode('edit');
    };

    listEl.addEventListener('click', e => {
        const row = e.target.closest('[data-id]');
        if (!row) return;
        const item = actions.find(x => String(getId(x)) === String(row.dataset.id));
        if (item) populateForm(item);
    });

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const payload = {
            Name: fields.name.value,
            Code: fields.code.value,
            PageCode: fields.pageCode.value,
            IconUrl: normalizeIconValue(fields.iconUrl.value),
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
        const json = await readJsonResponse(response);
        if (!response.ok || json.isSuccess === false) {
            showToast(errorMessageOf(json), 'danger');
            return;
        }

        showToast(currentMode === 'edit' ? 'Aksiyon güncellendi.' : 'Aksiyon eklendi.');
        await fetchActions();
        resetForm();
    });

    document.getElementById('delete-btn').addEventListener('click', () => {
        if (!fields.id.value) return;
        itemToDeleteId = fields.id.value;
        modalActionName.textContent = fields.name.value;
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
        const json = await readJsonResponse(response);
        if (!response.ok || json.isSuccess === false) {
            showToast(errorMessageOf(json) || 'Silme işlemi başarısız.', 'danger');
        } else {
            showToast('Aksiyon silindi.');
            await fetchActions();
            resetForm();
        }
        closeModal();
    });

    document.getElementById('reset-btn').addEventListener('click', resetForm);
    document.getElementById('cancel-edit-btn').addEventListener('click', resetForm);

    try {
        await fetchActions();
        resetForm();
    } catch (error) {
        showToast(error.message, 'danger');
    }
});

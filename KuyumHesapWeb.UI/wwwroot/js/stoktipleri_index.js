/* stoktipleri_index.js - StockType\Index.cshtml (Restored to StockType) */

tailwind.config = {
    theme: {
        extend: {
            colors: {
                'rolex-green': '#4C9779',
                'list-item-bg': '#F0FAFA',
                'success': '#22c55e',
                'danger': '#ef4444',
                'secondary': '#6b7280',
            },
            keyframes: {
                'fade-in-out': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '10%': { opacity: '1', transform: 'translateY(0)' },
                    '90%': { opacity: '1', transform: 'translateY(0)' },
                    '100%': { opacity: '0', transform: 'translateY(20px)' },
                },
            },
            animation: {
                'fade-in-out': 'fade-in-out 3s ease-in-out forwards',
            },
        }
    }
}

/* ---- */

document.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('jwt_token');
    const loginUrl = '/Auth/Login';
    const API_BASE_URL = '/StockType';
    const STOKGRUP_API_URL = '/StockGroup/GetAll';
    const DOVIZ_API_URL = '/Currency/GetAll';
    let currentMode = 'add';
    let itemToDeleteId = null;

    // Form ve liste elemanları
    const itemListEl = document.getElementById('item-list');
    const form = document.getElementById('item-form');
    const addModeButtons = document.getElementById('add-mode-buttons');
    const editModeButtons = document.getElementById('edit-mode-buttons');
    const toastContainer = document.getElementById('toast-container');
    const deleteButton = document.getElementById('sil-btn');

    // Modal elemanları
    const deleteModal = document.getElementById('delete-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const modalItemName = document.getElementById('modal-item-name');

    // Form inputları
    const stokTipIDInput = document.getElementById('stokTipID');
    const stokTipAdiInput = document.getElementById('stokTipAdi');
    const stokGrupIDSelect = document.getElementById('stokGrupID');
    const dovizIDSelect = document.getElementById('dovizID');
    const aktifInput = document.getElementById('aktif');

    const getAuthHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });

    const showToast = (message, type = 'success') => {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `p-4 rounded-lg text-white shadow-lg animate-fade-in-out ${type === 'success' ? 'bg-rolex-green' : 'bg-danger'}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    };

    const parseApiResponse = (response) => {
        if (response && response.data !== undefined) return response.data;
        if (response && response.Data !== undefined) return response.Data;
        return response;
    };

    const populateSelect = async (selectElement, url, valueField, textField, placeholder) => {
        try {
            const response = await fetch(url, { headers: getAuthHeaders() });
            if (!response.ok) throw new Error(`${placeholder} yüklenemedi.`);
            const rawData = await response.json();
            const data = parseApiResponse(rawData);
            
            selectElement.innerHTML = `<option value="" disabled selected>${placeholder}</option>`;
            if (data && Array.isArray(data)) {
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item[valueField] || item[valueField.charAt(0).toUpperCase() + valueField.slice(1)];
                    option.textContent = item[textField] || item[textField.charAt(0).toUpperCase() + textField.slice(1)];
                    selectElement.appendChild(option);
                });
            }
            return data;
        } catch (error) {
            console.error(error);
            showToast(error.message, 'danger');
            return [];
        }
    };

    const fetchItems = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/GetAll`, { headers: getAuthHeaders() });
            if (response.status === 401) return window.top.location.href = loginUrl;
            if (!response.ok) throw new Error(await response.text() || 'Veriler alınamadı.');
            const data = await response.json();
            renderItemList(parseApiResponse(data));
        } catch (error) {
            showToast(error.message, 'danger');
        }
    };

    const renderItemList = (items) => {
        itemListEl.innerHTML = !items || items.length === 0
            ? '<p class="text-center text-gray-500 p-4">Kayıt bulunamadı.</p>'
            : items.map((item, index) => {
                const name = item.stockTypeName || item.StockTypeName || 'İsimsiz';
                const id = item.id || item.Id;
                const group = item.stockGroup || item.StockGroup || {};
                const groupName = group.stockGroupName || group.StockGroupName || 'Tanımsız';
                const currency = item.currency || item.Currency || {};
                const currencyCode = currency.currencyCode || currency.CurrencyCode || 'N/A';
                const isActive = item.isActive !== undefined ? item.isActive : item.IsActive;

                const activeDurumHTML = isActive
                    ? `<div class="w-9 h-5 bg-rolex-green rounded-full relative"><div class="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 transition-all"></div></div>`
                    : `<div class="w-9 h-5 bg-gray-300 rounded-full relative"><div class="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 transition-all"></div></div>`;

                return `
                        <div class="p-3 rounded cursor-pointer hover:bg-gray-200 ${index % 2 !== 0 ? 'bg-list-item-bg' : 'bg-white'} flex justify-between items-center" data-id="${id}">
                            <div>
                                <span class="font-medium text-gray-700">${name}</span>
                                <p class="text-xs text-gray-500">${groupName}</p>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="text-sm font-semibold text-rolex-green w-12 text-center">${currencyCode}</span>
                                ${activeDurumHTML}
                            </div>
                        </div>`
            }).join('');
    };

    itemListEl.addEventListener('click', (e) => {
        const itemElement = e.target.closest('[data-id]');
        if (itemElement) handleItemSelect(itemElement.dataset.id);
    });

    const handleItemSelect = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/GetById/${id}`, { headers: getAuthHeaders() });
            if (!response.ok) throw new Error('Detay alınamadı.');
            const data = await response.json();
            populateForm(parseApiResponse(data));
        } catch (error) {
            showToast(error.message, 'danger');
        }
    };

    const populateForm = (item) => {
        form.reset();
        stokTipIDInput.value = item.id || item.Id;
        stokTipAdiInput.value = item.stockTypeName || item.StockTypeName;
        
        const group = item.stockGroup || item.StockGroup || {};
        stokGrupIDSelect.value = group.id || group.Id || "";
        
        const currency = item.currency || item.Currency || {};
        dovizIDSelect.value = currency.id || currency.Id || "";
        
        aktifInput.checked = item.isActive !== undefined ? item.isActive : item.IsActive;

        stokTipAdiInput.dispatchEvent(new Event('input'));
        if(stokGrupIDSelect.value) stokGrupIDSelect.classList.add('has-value');
        if(dovizIDSelect.value) dovizIDSelect.classList.add('has-value');

        setMode('edit');
    };

    const resetForm = () => {
        form.reset();
        stokTipIDInput.value = '';
        aktifInput.checked = true;
        stokGrupIDSelect.value = "";
        dovizIDSelect.value = "";

        stokTipAdiInput.dispatchEvent(new Event('input'));
        stokGrupIDSelect.classList.remove('has-value');
        dovizIDSelect.classList.remove('has-value');
        setMode('add');
    };

    const setMode = (mode) => {
        currentMode = mode;
        addModeButtons.classList.toggle('hidden', mode === 'edit');
        editModeButtons.classList.toggle('hidden', mode === 'add');
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            StockTypeName: stokTipAdiInput.value,
            StockGroupId: parseInt(stokGrupIDSelect.value),
            CurrencyId: parseInt(dovizIDSelect.value),
            IsActive: aktifInput.checked
        };

        if (currentMode === 'edit') {
            payload.Id = parseInt(stokTipIDInput.value);
        }

        const isAdding = currentMode === 'add';
        const url = isAdding ? `${API_BASE_URL}/Create` : `${API_BASE_URL}/Update`;

        try {
            const response = await fetch(url, { 
                method: isAdding ? 'POST' : 'PUT', 
                headers: getAuthHeaders(), 
                body: JSON.stringify(payload) 
            });
            if (!response.ok) throw new Error(await response.text() || 'İşlem başarısız.');

            showToast(isAdding ? 'Kayıt eklendi.' : 'Kayıt güncellendi.');
            await fetchItems();
            resetForm();
        } catch (error) {
            showToast(error.message, 'danger');
        }
    });

    deleteButton.addEventListener('click', () => {
        const itemId = stokTipIDInput.value;
        if (!itemId) return;
        itemToDeleteId = itemId;
        modalItemName.textContent = `'${stokTipAdiInput.value}'`;
        deleteModal.classList.remove('hidden');
        deleteModal.querySelector('div').classList.add('scale-100');
    });

    const closeModal = () => {
        if (!deleteModal) return;
        deleteModal.querySelector('div').classList.remove('scale-100');
        deleteModal.classList.add('hidden');
        itemToDeleteId = null;
    };

    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeModal);

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', async () => {
            if (!itemToDeleteId) return;
            try {
                const response = await fetch(`${API_BASE_URL}/${itemToDeleteId}`, { method: 'DELETE', headers: getAuthHeaders() });
                if (!response.ok) throw new Error('Silme işlemi başarısız.');
                showToast('Kayıt başarıyla silindi.');
                await fetchItems();
                resetForm();
            } catch (error) {
                showToast(error.message, 'danger');
            } finally {
                closeModal();
            }
        });
    }

    if (document.getElementById('vazgec-btn')) document.getElementById('vazgec-btn').addEventListener('click', resetForm);
    if (document.getElementById('vazgec-guncelle-btn')) document.getElementById('vazgec-guncelle-btn').addEventListener('click', resetForm);

    // Initial data load
    await Promise.all([
        populateSelect(stokGrupIDSelect, STOKGRUP_API_URL, 'id', 'stockGroupName', 'Stok Grubu Seçiniz'),
        populateSelect(dovizIDSelect, DOVIZ_API_URL, 'id', 'currencyCode', 'Birim Seçiniz')
    ]);

    await fetchItems();
    resetForm();
});
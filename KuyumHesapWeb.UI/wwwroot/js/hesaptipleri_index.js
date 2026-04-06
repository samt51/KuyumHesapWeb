/* hesaptipleri_index.js - HesapTipleri\Index.cshtml */
const Front_BASE_URL = (window.API_BASE_URL);
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
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '10%': { opacity: '1', transform: 'translateY(0)' },
                    '90%': { opacity: '1', transform: 'translateY(0)' },
                    '100%': { opacity: '0', transform: 'translateY(10px)' },
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
    const API_BASE_URL = Front_BASE_URL;
    let currentMode = 'add';
    let itemToDeleteId = null;
    let allItems = [];

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
    const hesapTipiIDInput = document.getElementById('hesapTipiID');
    const hesapTipiAdiInput = document.getElementById('hesapTipiAdi');
    const bilancoSirasiInput = document.getElementById('bilancoSirasi');
    const bilancoAltiHesaplamaInput = document.getElementById('bilancoAltiHesaplama');
    const aktifInput = document.getElementById('aktif');

    const getAuthHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });

    const mapApiToItem = (it) => {
        if (!it) return null;
        return {
            hesapTipiID: it.id ?? it.Id ?? 0,
            hesapTipiAdi: it.accountTypeName ?? it.AccountTypeName ?? 'Bilinmeyen',
            bilancoSirasi: it.balanceOrder ?? it.BalanceOrder ?? 0,
            bilancoAltiHesaplama: it.isSubBalanceCalculated ?? it.IsSubBalanceCalculated ?? false,
            aktif: it.isActive ?? it.IsActive ?? true,
        };
    };

    const parseApiResponse = async (response) => {
        if (response.status === 401) return window.top.location.href = loginUrl;
        
        let json;
        try {
            json = await response.json();
        } catch (e) {
            throw new Error('Sunucudan geçersiz cevap alındı (JSON hatası).');
        }

        if (!json) throw new Error('Sunucudan boş cevap alındı.');

        // Eğer response bir ResponseDto formatındaysa (isSuccess içeriyorsa)
        if (Object.prototype.hasOwnProperty.call(json, 'isSuccess')) {
            if (json.isSuccess === false) {
                const msg = (json.errors && json.errors.length) ? json.errors.join('\n') : 'İşleminiz gerçekleşemiyor.';
                showErrorModal(msg);
                const err = new Error(msg);
                err.isModalShown = true;
                throw err;
            }
            return json.data;
        }

        // Değilse direkt datadır (MVC Controller'dan dönen JsonResult gibi)
        return json;
    };

    const showErrorModal = (message) => {
        // if modal already exists, update text
        let existing = document.getElementById('api-error-modal');
        if (existing) {
            existing.querySelector('.modal-body').textContent = message;
            existing.classList.remove('hidden');
            return;
        }
        const overlay = document.createElement('div');
        overlay.id = 'api-error-modal';
        overlay.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
        overlay.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-4 mx-4">
                <div class="font-semibold text-lg mb-2">Hata</div>
                <div class="modal-body text-sm text-gray-700 mb-4">${message}</div>
                <div class="text-right">
                    <button id="api-error-ok" class="px-4 py-2 bg-rolex-green text-white rounded">Tamam</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        overlay.querySelector('#api-error-ok').addEventListener('click', () => overlay.classList.add('hidden'));
    };

    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `p-3 rounded-md text-white text-sm shadow-lg animate-fade-in-out ${type === 'success' ? 'bg-rolex-green' : 'bg-danger'}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    };

    const fetchItems = async () => {
        try {
            const response = await fetch('/AccountType/GetAll', { headers: getAuthHeaders() });
            const data = await parseApiResponse(response);
            allItems = (data || []).map(mapApiToItem);
            renderItemList(allItems);
        } catch (error) {
            if (!error.isModalShown) showToast(error.message, 'danger');
        }
    };

    const renderItemList = (items) => {
        itemListEl.innerHTML = !items || items.length === 0
            ? '<p class="text-center text-gray-500 p-4 text-xs">Kayıt bulunamadı.</p>'
            : items.map((item, index) => `
                        <div class="grid grid-cols-5 items-center p-2 rounded cursor-pointer hover:bg-gray-200 ${index % 2 !== 0 ? 'bg-list-item-bg' : 'bg-white'}" data-id="${item.hesapTipiID}">
                            <div class="col-span-2">
                                <span class="font-medium text-gray-700 text-sm">${item.hesapTipiAdi}</span>
                            </div>
                            <div class="text-center text-xs text-gray-600">${item.bilancoSirasi}</div>
                            <div class="flex justify-center">
                                <div class="w-9 h-5 ${item.aktif ? 'bg-rolex-green' : 'bg-gray-300'} rounded-full relative transition-colors">
                                    <div class="w-4 h-4 bg-white rounded-full absolute top-[2px] ${item.aktif ? 'right-[2px]' : 'left-[2px]'} transition-all"></div>
                                </div>
                            </div>
                            <div class="flex justify-center">
                                <div class="w-9 h-5 ${item.bilancoAltiHesaplama ? 'bg-rolex-green' : 'bg-gray-300'} rounded-full relative transition-colors">
                                    <div class="w-4 h-4 bg-white rounded-full absolute top-[2px] ${item.bilancoAltiHesaplama ? 'right-[2px]' : 'left-[2px]'} transition-all"></div>
                                </div>
                            </div>
                        </div>`).join('');
    };

    itemListEl.addEventListener('click', (e) => {
        const itemElement = e.target.closest('[data-id]');
        if (itemElement) handleItemSelect(itemElement.dataset.id);
    });

    const handleItemSelect = async (id) => {
        try {
            const response = await fetch(`/AccountType/GetById/${id}`, { headers: getAuthHeaders() });
            const data = await parseApiResponse(response);
            const item = Array.isArray(data) ? data[0] : data;
            if (!item) throw new Error('Detay alınamadı.');
            populateForm(mapApiToItem(item));
        } catch (error) {
            showToast(error.message, 'danger');
        }
    };

    const populateForm = (item) => {
        form.reset();
        hesapTipiIDInput.value = item.hesapTipiID;
        hesapTipiAdiInput.value = item.hesapTipiAdi;
        bilancoSirasiInput.value = item.bilancoSirasi;
        bilancoAltiHesaplamaInput.checked = item.bilancoAltiHesaplama;
        aktifInput.checked = item.aktif;

        [hesapTipiAdiInput, bilancoSirasiInput].forEach(input => {
            input.dispatchEvent(new Event('input'));
            input.classList.toggle('has-value', !!input.value);
        });

        setMode('edit');
    };

    const resetForm = () => {
        form.reset();
        hesapTipiIDInput.value = '';
        aktifInput.checked = true;
        bilancoAltiHesaplamaInput.checked = false;
        const allInputs = form.querySelectorAll('.form-input');
        allInputs.forEach(input => {
            input.classList.remove('has-value');
            input.dispatchEvent(new Event('input'));
        });
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
            AccountTypeName: hesapTipiAdiInput.value,
            BalanceOrder: parseInt(bilancoSirasiInput.value),
            IsSubBalanceCalculated: bilancoAltiHesaplamaInput.checked,
            IsActive: aktifInput.checked,
        };
 
        if (currentMode === 'edit') {
            payload.Id = parseInt(hesapTipiIDInput.value);
        }

        const method = 'POST';
        const url = currentMode === 'add' ? '/AccountType/Create' : '/AccountType/Update';

        try {
            const response = await fetch(url, {
                method: method,
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                // try to get error message from body
                const txt = await response.text().catch(() => 'İşlem başarısız.');
                throw new Error(txt || 'İşlem başarısız.');
            }
            // Check wrapped response if present
            const resJson = await response.json().catch(() => null);
            if (resJson && resJson.isSuccess === false) {
                const msg = (resJson.errors && resJson.errors.length) ? resJson.errors.join('\n') : 'İşleminiz gerçekleşemiyor.';
                throw new Error(msg);
            }

            showToast(`Hesap tipi başarıyla ${currentMode === 'add' ? 'eklendi' : 'güncellendi'}.`);
            await fetchItems();
            resetForm();
        } catch (error) {
            if (!error.isModalShown) showToast(error.message, 'danger');
        }
    });

    const showDeleteModal = (id, name) => {
        itemToDeleteId = id;
        modalItemName.textContent = `'${name}'`;
        deleteModal.classList.remove('hidden');
        setTimeout(() => deleteModal.querySelector('div').classList.remove('scale-95'), 10);
    };

    const hideDeleteModal = () => {
        deleteModal.querySelector('div').classList.add('scale-95');
        setTimeout(() => deleteModal.classList.add('hidden'), 300);
    };

    deleteButton.addEventListener('click', () => {
        if (hesapTipiIDInput.value) showDeleteModal(hesapTipiIDInput.value, hesapTipiAdiInput.value);
    });

    cancelDeleteBtn.addEventListener('click', hideDeleteModal);

    confirmDeleteBtn.addEventListener('click', async () => {
        if (!itemToDeleteId) return;
        try {
            const response = await fetch(`${API_BASE_URL}/AccountType/${itemToDeleteId}`, { method: 'DELETE', headers: getAuthHeaders() });
            if (!response.ok) {
                const txt = await response.text().catch(() => 'Silme işlemi başarısız.');
                throw new Error(txt || 'Silme işlemi başarısız.');
            }
            const resJson = await response.json().catch(() => null);
            if (resJson && resJson.isSuccess === false) {
                const msg = (resJson.errors && resJson.errors.length) ? resJson.errors.join('\n') : 'İşleminiz gerçekleşemiyor.';
                throw new Error(msg);
            }

            showToast('Kayıt başarıyla silindi.');
            await fetchItems();
            resetForm();
        } catch (error) {
            if (!error.isModalShown) showToast(error.message, 'danger');
        } finally {
            hideDeleteModal();
        }
    });

    document.getElementById('vazgec-btn').addEventListener('click', resetForm);
    document.getElementById('vazgec-guncelle-btn').addEventListener('click', resetForm);

    fetchItems();
    resetForm();
});
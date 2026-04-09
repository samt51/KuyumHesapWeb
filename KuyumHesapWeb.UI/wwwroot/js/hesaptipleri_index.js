/* hesaptipleri_index.js - HesapTipleri\Index.cshtml */

document.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('jwt_token');
    const loginUrl = '/Auth/Login';
    let currentMode = 'add';
    let itemToDeleteId = null;
    let allItems = [];

    // Form ve liste elemanları
    const itemListEl = document.getElementById('item-list');
    const listCountEl = document.getElementById('list-count');
    const listSearchEl = document.getElementById('list-search');
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
    const idInput = document.getElementById('hesapTipiID');
    const hesapTipiAdiInput = document.getElementById('hesapTipiAdi');
    const bilancoSirasiInput = document.getElementById('bilancoSirasi');
    const bilancoAltiHesaplamaInput = document.getElementById('bilancoAltiHesaplama');
    const aktifInput = document.getElementById('aktif');

    const getAuthHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });

    const mapApiToItem = (it) => {
        if (!it) return null;
        return {
            id: it.id ?? it.Id ?? it.hesapTipiID ?? 0,
            hesapTipiAdi: it.hesapTipiAdi ?? it.accountTypeName ?? it.AccountTypeName ?? 'Bilinmeyen',
            bilancoSirasi: it.bilancoSirasi ?? it.balanceOrder ?? it.BalanceOrder ?? 0,
            bilancoAltiHesaplama: it.bilancoAltiHesaplama ?? it.isSubBalanceCalculated ?? it.IsSubBalanceCalculated ?? false,
            aktif: it.aktif ?? it.isActive ?? it.IsActive ?? false
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

        return json;
    };

    const showErrorModal = (message) => {
        let existing = document.getElementById('api-error-modal');
        if (existing) {
            existing.querySelector('.modal-body').textContent = message;
            existing.classList.remove('hidden');
            return;
        }
        const overlay = document.createElement('div');
        overlay.id = 'api-error-modal';
        overlay.className = 'fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm';
        overlay.innerHTML = `
            <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 mx-4 border border-gray-100 transform transition-all scale-100">
                <div class="flex items-center gap-3 mb-4 text-red-600">
                    <i class="fas fa-exclamation-circle text-2xl"></i>
                    <div class="font-bold text-xl">Hata Bildirimi</div>
                </div>
                <div class="modal-body text-sm text-gray-600 mb-6 leading-relaxed">${message}</div>
                <div class="text-right">
                    <button id="api-error-ok" class="px-6 py-2 bg-rolex-green text-white font-bold rounded-lg hover:shadow-lg transition-all active:scale-95">Anladım</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        overlay.querySelector('#api-error-ok').addEventListener('click', () => overlay.classList.add('hidden'));
    };

    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        // Yeni tasarıma uygun toast renkleri
        const bgClass = type === 'success' ? 'bg-success' : 'bg-danger';
        toast.className = `p-4 rounded-xl text-white text-sm font-semibold shadow-2xl animate-fade-in-out flex items-center gap-3 min-w-[300px] border border-white/20 backdrop-blur-md ${bgClass}`;
        toast.innerHTML = `<i class="fas ${icon} text-lg"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 500);
        }, 3500);
    };

    const fetchItems = async () => {
        try {
            const response = await fetch('/AccountType/GetAll', { headers: getAuthHeaders() });
            const data = await parseApiResponse(response);
            allItems = (data || []).map(mapApiToItem);
            renderItemList(allItems);
            if (listCountEl) listCountEl.textContent = `${allItems.length} Kayıt`;
        } catch (error) {
            if (!error.isModalShown) showToast(error.message, 'danger');
        }
    };

    const renderItemList = (items) => {
        itemListEl.innerHTML = !items || items.length === 0
            ? '<div class="flex flex-col items-center justify-center p-12 text-gray-400"><i class="fas fa-folder-open text-4xl mb-3 opacity-20"></i><p class="text-sm font-medium">Kayıt bulunamadı.</p></div>'
            : items.map((item, index) => `
                        <div class="grid grid-cols-5 items-center px-6 py-4 cursor-pointer transition-all border-b border-gray-50 bg-white hover:bg-slate-50 group" data-id="${item.id}">
                            <div class="col-span-2 flex items-center gap-3">
                                <div class="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-rolex-green/10 flex items-center justify-center text-gray-400 group-hover:text-rolex-green transition-all">
                                    <i class="fas fa-tag text-[10px]"></i>
                                </div>
                                <span class="font-bold text-gray-700 text-sm group-hover:text-rolex-green transition-colors">${item.hesapTipiAdi}</span>
                            </div>
                            <div class="text-center">
                                <span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">${item.bilancoSirasi}</span>
                            </div>
                            <div class="text-right">
                                <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold ${item.aktif ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}">
                                    <span class="w-1.5 h-1.5 rounded-full ${item.aktif ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}"></span>
                                    ${item.aktif ? 'AKTİF' : 'PASİF'}
                                </span>
                            </div>
                            <div class="text-right">
                                <i class="fas ${item.bilancoAltiHesaplama ? 'fa-check text-emerald-500' : 'fa-times text-gray-300'} text-[10px]"></i>
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
        idInput.value = item.id;
        hesapTipiAdiInput.value = item.hesapTipiAdi;
        bilancoSirasiInput.value = item.bilancoSirasi;
        bilancoAltiHesaplamaInput.checked = item.bilancoAltiHesaplama;
        aktifInput.checked = item.aktif;

        // Triggers for floating labels
        [hesapTipiAdiInput, bilancoSirasiInput].forEach(inp => inp.dispatchEvent(new Event('input', { bubbles: true })));

        setMode('edit');
    };

    const resetForm = () => {
        form.reset();
        idInput.value = '';
        const allInputs = form.querySelectorAll('input[type="text"], input[type="number"]');
        allInputs.forEach(input => {
            input.dispatchEvent(new Event('input', { bubbles: true }));
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
            IsActive: aktifInput.checked
        };

        if (currentMode === 'edit') {
            payload.Id = parseInt(idInput.value);
        }

        const url = currentMode === 'add' ? '/AccountType/Create' : '/AccountType/Update';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });
            
            const resData = await parseApiResponse(response);

            showToast(`Hesap tipi başarıyla ${currentMode === 'add' ? 'eklendi' : 'güncellendi'}.`);
            await fetchItems();
            resetForm();
        } catch (error) {
            if (!error.isModalShown) showToast(error.message, 'danger');
        }
    });

    listSearchEl.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allItems.filter(x => 
            x.hesapTipiAdi.toLowerCase().includes(term) || 
            x.bilancoSirasi.toString().includes(term)
        );
        renderItemList(filtered);
    });

    const showDeleteModal = (id, name) => {
        itemToDeleteId = id;
        modalItemName.textContent = `'${name}'`;
        deleteModal.classList.remove('hidden');
        setTimeout(() => deleteModal.children[0].classList.replace('scale-95', 'scale-100'), 10);
    };

    const hideDeleteModal = () => {
        deleteModal.children[0].classList.replace('scale-100', 'scale-95');
        setTimeout(() => deleteModal.classList.add('hidden'), 200);
    };

    deleteButton.addEventListener('click', () => {
        if (idInput.value) showDeleteModal(idInput.value, hesapTipiAdiInput.value);
    });

    cancelDeleteBtn.addEventListener('click', hideDeleteModal);

    confirmDeleteBtn.addEventListener('click', async () => {
        if (!itemToDeleteId) return;
        try {
            // Updated to match backend local proxy
            const response = await fetch(`/AccountType/Delete/${itemToDeleteId}`, {
                method: 'DELETE', // Local controller might use POST if [HttpDelete] is not set up correctly with [FromBody]
                headers: getAuthHeaders()
            });
            await parseApiResponse(response);
            showToast('Hesap tipi başarıyla silindi.');
            await fetchItems();
            resetForm();
            hideDeleteModal();
        } catch (error) {
            if (!error.isModalShown) showToast(error.message, 'danger');
        }
    });

    document.getElementById('vazgec-btn').addEventListener('click', resetForm);
    document.getElementById('vazgec-guncelle-btn').addEventListener('click', resetForm);

    fetchItems();
    resetForm();
});
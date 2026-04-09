/* hesaplar_index.js - Account\Index.cshtml */

document.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('jwt_token');
    const loginUrl = '/Auth/Login';
    let currentMode = 'add';
    let itemToDeleteId = null;
    let allAccounts = [];
    let accountTypes = [];

    // Elements
    const itemListEl = document.getElementById('item-list');
    const listCountEl = document.getElementById('list-count');
    const searchInput = document.getElementById('arama-input');
    const typeFilter = document.getElementById('hesap-tipi-filtre');
    const form = document.getElementById('item-form');
    const addModeButtons = document.getElementById('add-mode-buttons');
    const editModeButtons = document.getElementById('edit-mode-buttons');
    const toastContainer = document.getElementById('toast-container');
    const deleteButton = document.getElementById('sil-btn');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Modal
    const deleteModal = document.getElementById('delete-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const modalItemName = document.getElementById('modal-item-name');

    // Inputs
    const idInput = document.getElementById('hesapID');
    const hesapAdiInput = document.getElementById('hesapAdi');
    const hesapTipiIDInput = document.getElementById('hesapTipiID');
    const musteriTipiInput = document.getElementById('musteriTipi');
    const cepTelefonuInput = document.getElementById('cepTelefonu');
    const mailInput = document.getElementById('mail');
    const tcKimlikNoInput = document.getElementById('tcKimlikNo');
    const vergiDairesiInput = document.getElementById('vergiDairesi');
    const vergiNoInput = document.getElementById('vergiNo');
    const aktifInput = document.getElementById('aktif');
    const ulkeInput = document.getElementById('ulke');
    const sehirInput = document.getElementById('sehir');
    const ilceInput = document.getElementById('ilce');
    const mahalleInput = document.getElementById('mahalle');
    const fullAdresInput = document.getElementById('fullAdres');

    const getAuthHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });

    const parseApiResponse = async (response) => {
        if (response.status === 401) return window.top.location.href = loginUrl;
        let json;
        try { json = await response.json(); } catch (e) { throw new Error('Geçersiz cevap.'); }
        if (!json) throw new Error('Boş cevap.');
        if (Object.prototype.hasOwnProperty.call(json, 'isSuccess')) {
            if (!json.isSuccess) {
                const msg = (json.errors && json.errors.length) ? json.errors.join('\n') : 'Hata oluştu.';
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
        overlay.className = 'fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm';
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
        const bgClass = type === 'success' ? 'bg-emerald-600' : 'bg-red-600';
        toast.className = `p-4 rounded-xl text-white text-sm font-semibold shadow-2xl animate-fade-in-out flex items-center gap-3 min-w-[300px] border border-white/10 backdrop-blur-md ${bgClass}`;
        toast.innerHTML = `<i class="fas ${icon} text-lg"></i> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 500);
        }, 3500);
    };

    // Tabs logic
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            tabButtons.forEach(b => {
                b.classList.remove('active', 'border-rolex-green', 'text-rolex-green');
                b.classList.add('text-gray-400', 'border-transparent');
            });
            btn.classList.add('active', 'border-rolex-green', 'text-rolex-green');
            btn.classList.remove('text-gray-400', 'border-transparent');

            tabContents.forEach(c => c.classList.toggle('hidden', c.id !== `tab-${target}`));
        });
    });

    const fetchAccountTypes = async () => {
        try {
            const response = await fetch('/AccountType/GetAll', { headers: getAuthHeaders() });
            const data = await parseApiResponse(response);
            accountTypes = data || [];
            
            // Populate select inputs
            const options = accountTypes.map(t => `<option value="${t.id ?? t.Id}">${t.accountTypeName ?? t.hesapTipiAdi}</option>`).join('');
            hesapTipiIDInput.innerHTML = `<option value="" disabled selected>Seçiniz</option>${options}`;
            typeFilter.innerHTML = `<option value="">Tüm Tipler</option>${options}`;
        } catch (error) {
            console.error('AccountTypes fetch error:', error);
        }
    };

    const fetchAccounts = async () => {
        try {
            itemListEl.innerHTML = '<div class="flex flex-col items-center justify-center p-20 text-gray-300"><i class="fas fa-circle-notch fa-spin text-3xl mb-4"></i><span class="text-xs font-semibold">Yükleniyor...</span></div>';
            const response = await fetch('/Account/GetAll', { headers: getAuthHeaders() });
            const data = await parseApiResponse(response);
            allAccounts = (data || []).map(it => ({
                id: it.id ?? it.Id,
                hesapAdi: it.hesapAdi ?? it.accountName ?? 'Bilinmeyen',
                hesapTipiID: it.hesapTipiID ?? it.accountTypeId,
                hesapTipiAdi: it.hesapTipiAdi ?? it.accountTypeName ?? 'Bilinmeyen',
                aktif: it.aktif ?? it.isActive ?? false
            }));
            renderList(allAccounts);
            listCountEl.textContent = `${allAccounts.length} Kayıt`;
        } catch (error) {
            if (!error.isModalShown) showToast(error.message, 'danger');
        }
    };

    const renderList = (items) => {
        itemListEl.innerHTML = items.length === 0
            ? '<div class="flex flex-col items-center justify-center p-12 text-gray-400"><i class="fas fa-folder-open text-4xl mb-3 opacity-20"></i><p class="text-xs font-medium">Kayıt bulunamadı.</p></div>'
            : items.map(item => `
                <div class="grid grid-cols-4 items-center px-6 py-4 cursor-pointer transition-all border-b border-gray-50 bg-white hover:bg-slate-50 group" data-id="${item.id}">
                    <div class="col-span-2 flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-rolex-green/10 flex items-center justify-center text-gray-400 group-hover:text-rolex-green transition-all">
                            <i class="fas fa-user text-[10px]"></i>
                        </div>
                        <span class="font-bold text-gray-700 text-[11px] group-hover:text-rolex-green transition-colors line-clamp-1">${item.hesapAdi}</span>
                    </div>
                    <div class="text-center">
                        <span class="bg-gray-100 text-gray-400 group-hover:text-rolex-green/70 px-2 py-0.5 rounded text-[9px] font-bold transition-all uppercase">${item.hesapTipiAdi}</span>
                    </div>
                    <div class="text-right">
                        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${item.aktif ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}">
                            <span class="w-1.5 h-1.5 rounded-full ${item.aktif ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}"></span>
                            ${item.aktif ? 'AKTİF' : 'PASİF'}
                        </span>
                    </div>
                </div>`).join('');
    };

    itemListEl.addEventListener('click', async (e) => {
        const itemEl = e.target.closest('[data-id]');
        if (!itemEl) return;
        const id = itemEl.dataset.id;
        try {
            const response = await fetch(`/Account/GetById/${id}`, { headers: getAuthHeaders() });
            const data = await parseApiResponse(response);
            populateForm(data);
        } catch (error) {
            showToast(error.message, 'danger');
        }
    });

    const populateForm = (data) => {
        const item = data.getByIdAccountQueryResponse || data;
        form.reset();
        idInput.value = item.id ?? item.Id;
        hesapAdiInput.value = item.hesapAdi ?? item.accountName ?? '';
        hesapTipiIDInput.value = item.hesapTipiID ?? item.accountTypeId ?? '';
        musteriTipiInput.value = item.musteriTipi ?? item.customerType ?? 'Bireysel';
        cepTelefonuInput.value = item.cepTelefonu ?? item.phone ?? '';
        mailInput.value = item.mail ?? item.email ?? '';
        tcKimlikNoInput.value = item.tcKimlikNo ?? item.identityNumber ?? '';
        vergiDairesiInput.value = item.vergiDairesi ?? item.taxOffice ?? '';
        vergiNoInput.value = item.vergiNo ?? item.taxNumber ?? '';
        aktifInput.checked = item.aktif ?? item.isActive ?? false;
        ulkeInput.value = item.ulke ?? item.country ?? 'Türkiye';
        sehirInput.value = item.sehir ?? item.city ?? '';
        ilceInput.value = item.ilce ?? item.district ?? '';
        mahalleInput.value = item.mahalle ?? item.neighborhood ?? '';
        fullAdresInput.value = item.fullAdres ?? item.address ?? '';

        // Trigger floating labels and visibility
        musteriTipiInput.dispatchEvent(new Event('change'));
        const allInps = form.querySelectorAll('input, select, textarea');
        allInps.forEach(i => i.dispatchEvent(new Event('input', { bubbles: true })));

        setMode('edit');
    };

    musteriTipiInput.addEventListener('change', () => {
        const val = musteriTipiInput.value;
        document.getElementById('bireysel-fields').classList.toggle('hidden', val !== 'Bireysel');
        document.getElementById('kurumsal-fields').classList.toggle('hidden', val !== 'Kurumsal');
    });

    const setMode = (mode) => {
        currentMode = mode;
        addModeButtons.classList.toggle('hidden', mode === 'edit');
        editModeButtons.classList.toggle('hidden', mode === 'add');
    };

    const resetForm = () => {
        form.reset();
        idInput.value = '';
        musteriTipiInput.dispatchEvent(new Event('change'));
        const allInps = form.querySelectorAll('input, select, textarea');
        allInps.forEach(i => i.dispatchEvent(new Event('input', { bubbles: true })));
        setMode('add');
        // Back to first tab
        tabButtons[0].click();
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            GetByIdAccountQueryResponse: {
                id: currentMode === 'edit' ? parseInt(idInput.value) : 0,
                hesapAdi: hesapAdiInput.value,
                hesapTipiID: parseInt(hesapTipiIDInput.value),
                musteriTipi: musteriTipiInput.value,
                cepTelefonu: cepTelefonuInput.value,
                mail: mailInput.value,
                tcKimlikNo: tcKimlikNoInput.value,
                vergiDairesi: vergiDairesiInput.value,
                vergiNo: vergiNoInput.value,
                aktif: aktifInput.checked,
                ulke: ulkeInput.value,
                sehir: sehirInput.value,
                ilce: ilceInput.value,
                mahalle: mahalleInput.value,
                fullAdres: fullAdresInput.value
            }
        };

        const url = currentMode === 'add' ? '/Account/Create' : '/Account/Update';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(currentMode === 'add' ? { request: payload.GetByIdAccountQueryResponse } : payload)
            });
            await parseApiResponse(response);
            showToast(`Hesap başarıyla ${currentMode === 'add' ? 'eklendi' : 'güncellendi'}.`);
            await fetchAccounts();
            resetForm();
        } catch (error) {
            if (!error.isModalShown) showToast(error.message, 'danger');
        }
    });

    const filterAccounts = () => {
        const term = searchInput.value.toLowerCase();
        const typeId = typeFilter.value;
        const filtered = allAccounts.filter(a => {
            const matchName = a.hesapAdi.toLowerCase().includes(term);
            const matchType = !typeId || a.hesapTipiID == typeId;
            return matchName && matchType;
        });
        renderList(filtered);
    };

    searchInput.addEventListener('input', filterAccounts);
    typeFilter.addEventListener('change', filterAccounts);

    const showDeleteModal = (id, name) => {
        itemToDeleteId = id;
        modalItemName.textContent = `'${name}'`;
        deleteModal.classList.remove('hidden');
        setTimeout(() => deleteModal.querySelector('.bg-white').classList.replace('scale-95', 'scale-100'), 10);
    };

    const hideDeleteModal = () => {
        deleteModal.querySelector('.bg-white').classList.replace('scale-100', 'scale-95');
        setTimeout(() => deleteModal.classList.add('hidden'), 200);
    };

    deleteButton.addEventListener('click', () => {
        if (idInput.value) showDeleteModal(idInput.value, hesapAdiInput.value);
    });

    cancelDeleteBtn.addEventListener('click', hideDeleteModal);
    confirmDeleteBtn.addEventListener('click', async () => {
        if (!itemToDeleteId) return;
        try {
            const response = await fetch(`/Account/Delete/${itemToDeleteId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            await parseApiResponse(response);
            showToast('Hesap başarıyla silindi.');
            await fetchAccounts();
            resetForm();
            hideDeleteModal();
        } catch (error) {
            if (!error.isModalShown) showToast(error.message, 'danger');
        }
    });

    document.getElementById('vazgec-btn').addEventListener('click', resetForm);
    document.getElementById('vazgec-guncelle-btn').addEventListener('click', resetForm);

    // Init
    await fetchAccountTypes();
    await fetchAccounts();
    resetForm();
});

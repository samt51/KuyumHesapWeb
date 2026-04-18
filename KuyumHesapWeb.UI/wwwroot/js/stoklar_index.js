/* stoklar_index.js - Stoklar\Index.cshtml */

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
    const API_BASE_URL = '/Stock';
    const STOKTIP_API_URL = '/StockType/GetAll';
    const STOKGRUP_API_URL = '/StockGroup/GetAll';
    const DOVIZ_API_URL = '/Currency/GetAll';
    let currentMode = 'add';
    let itemToDeleteId = null;
    let allItems = [];
    let stokTipleri = [];
    let stokGruplari = [];

    // Form ve liste elemanları
    const itemListEl = document.getElementById('item-list');
    const form = document.getElementById('item-form');
    const addModeButtons = document.getElementById('add-mode-buttons');
    const editModeButtons = document.getElementById('edit-mode-buttons');
    const toastContainer = document.getElementById('toast-container');


    // Filtre elemanları
    const listSearchInput = document.getElementById('listSearchInput');
    const grupFilterSelect = document.getElementById('grupFilterSelect');
    const tipFilterSelect = document.getElementById('tipFilterSelect');

    // Modal elemanları
    const deleteModal = document.getElementById('delete-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const modalItemName = document.getElementById('modal-item-name');

    // Form inputları
    const stokIDInput = document.getElementById('stokID');
    const stokAdiInput = document.getElementById('stokAdi');
    const stokTipIDSelect = document.getElementById('stokTipID');
    const grupAdiInput = document.getElementById('grupAdi');
    const grupIDInput = document.getElementById('grupID');
    const birimSelect = document.getElementById('birim');
    const stokBirimiAdiInput = document.getElementById('stokBirimiAdi');
    const stokBirimiInput = document.getElementById('stokBirimi');
    const iscilikBirimiSelect = document.getElementById('iscilikBirimi');
    const milyemInput = document.getElementById('milyem');
    const aktifInput = document.getElementById('aktif');

    const getAuthHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });

    const showToast = (message, type = 'success') => {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = `p-3 rounded-md text-white text-sm shadow-lg animate-fade-in-out ${type === 'success' ? 'bg-rolex-green' : 'bg-danger'}`;
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

    const applyFiltersAndRender = () => {
        const searchTerm = listSearchInput.value.toLowerCase();
        const selectedGrup = grupFilterSelect.value;
        const selectedTip = tipFilterSelect.value;

        let filteredItems = allItems;

        if (searchTerm) {
            filteredItems = filteredItems.filter(item => {
                const name = item.stockName || item.StockName || '';
                return name.toLowerCase().includes(searchTerm);
            });
        }
        if (selectedGrup) {
            filteredItems = filteredItems.filter(item => {
                const gName = item.stockGroupName || item.StockGroupName || '';
                return gName === selectedGrup;
            });
        }
        if (selectedTip) {
            filteredItems = filteredItems.filter(item => {
                const tName = item.stockTypeName || item.StockTypeName || '';
                return tName === selectedTip;
            });
        }
        renderItemList(filteredItems);
    };

    const updateDependentFields = async (stokTipId) => {
        if (!stokTipId) return;
        try {
            const response = await fetch(`/StockType/GetById/${stokTipId}`, { headers: getAuthHeaders() });
            if (!response.ok) throw new Error('Tip detayları alınamadı.');
            const rawData = await response.json();
            const item = parseApiResponse(rawData);

            const group = item.stockGroup || item.StockGroup || {};
            grupIDInput.value = group.id || group.Id || '';
            grupAdiInput.value = group.stockGroupName || group.StockGroupName || '';
            
            const currency = item.currency || item.Currency || {};
            stokBirimiInput.value = currency.id || currency.Id || '';
            stokBirimiAdiInput.value = currency.currencyCode || currency.CurrencyCode || '';

            [grupAdiInput, stokBirimiAdiInput].forEach(input => {
                input.dispatchEvent(new Event('input'));
                input.classList.toggle('has-value', !!input.value);
            });
        } catch (error) {
            showToast(error.message, 'danger');
        }
    };

    stokTipIDSelect.addEventListener('change', (e) => {
        updateDependentFields(e.target.value);
    });

    const fetchItems = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/GetAll`, { headers: getAuthHeaders() });
            if (response.status === 401) return window.top.location.href = loginUrl;
            if (!response.ok) throw new Error(await response.text() || 'Veriler alınamadı.');
            const data = await response.json();
            allItems = parseApiResponse(data);
            applyFiltersAndRender();
        } catch (error) {
            showToast(error.message, 'danger');
        }
    };

    const renderItemList = (items) => {
        itemListEl.innerHTML = !items || items.length === 0
            ? '<p class="text-center text-gray-500 p-4">Kayıt bulunamadı.</p>'
            : items.map((item, index) => {
                const name = item.stockName || item.StockName || '...';
                const id = item.id || item.Id;
                const typeName = item.stockTypeName || item.StockTypeName || '...';
                const groupName = item.stockGroupName || item.StockGroupName || '...';
                const unitName = item.unitName || item.UnitName || '...';
                const laborUnit = item.laborUnit || item.LaborUnit || 'N/A';
                const millRate = item.millRate || item.MillRate || 0;
                const isActive = item.isActive !== undefined ? item.isActive : item.IsActive;

                const formattedMilyem = millRate.toLocaleString('tr-TR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });

                return `
                        <div class="p-2 rounded cursor-pointer hover:bg-gray-200 ${index % 2 !== 0 ? 'bg-list-item-bg' : 'bg-white'} flex justify-between items-center" data-id="${id}">
                            <div>
                                <span class="font-medium text-gray-700 text-sm">${name}</span>
                                <p class="text-xs text-gray-500">${typeName} / ${groupName}</p>
                            </div>
                            <div class="flex items-center gap-x-6 text-center text-xs">
                                <span class="font-semibold text-rolex-green w-10">${unitName}</span>
                                <span class="text-gray-600 w-12">${laborUnit}</span>
                                <span class="text-gray-600 w-12">${formattedMilyem}</span>
                                <div class="w-8 flex justify-center">
                                    <div class="w-9 h-5 ${isActive ? 'bg-rolex-green' : 'bg-gray-300'} rounded-full relative transition-colors">
                                        <div class="w-4 h-4 bg-white rounded-full absolute top-[2px] ${isActive ? 'right-[2px]' : 'left-[2px]'} transition-all"></div>
                                    </div>
                                </div>
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
        stokIDInput.value = item.id || item.Id;
        stokAdiInput.value = item.stockName || item.StockName;
        stokTipIDSelect.value = (item.stockTypeResponseDto ? item.stockTypeResponseDto.id : null) || (item.StockTypeResponseDto ? item.StockTypeResponseDto.Id : null) || item.stockTypeId || item.StockTypeId;
        birimSelect.value = item.unitName || item.UnitName;
        iscilikBirimiSelect.value = item.laborUnitId || item.LaborUnitId;
        
        const millRate = item.millRate || item.MillRate || 0;
        milyemInput.value = millRate.toLocaleString('tr-TR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
        
        aktifInput.checked = item.isActive !== undefined ? item.isActive : item.IsActive;

        updateDependentFields(stokTipIDSelect.value);

        const allInputs = [stokAdiInput, stokTipIDSelect, birimSelect, iscilikBirimiSelect, milyemInput, grupAdiInput, stokBirimiAdiInput];
        allInputs.forEach(input => {
            input.dispatchEvent(new Event('input'));
            input.classList.toggle('has-value', !!input.value);
        });

        setMode('edit');
    };

    const resetForm = () => {
        form.reset();
        stokIDInput.value = '';
        aktifInput.checked = true;
        const allInputs = form.querySelectorAll('.form-input, .form-select');
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
            StockName: stokAdiInput.value,
            StockTypeId: parseInt(stokTipIDSelect.value),
            StockGroupId: parseInt(grupIDInput.value), // For Create
            GroupId: parseInt(grupIDInput.value),      // For Update (Backend inconsistency fix)
            UnitName: birimSelect.value,
            StockUnitId: parseInt(stokBirimiInput.value),
            LaborUnitId: parseInt(iscilikBirimiSelect.value),
            MillRate: parseFloat(milyemInput.value.replace(/\./g, '').replace(',', '.')),
            IsActive: aktifInput.checked,
        };

        if (currentMode === 'edit') {
            payload.Id = parseInt(stokIDInput.value);
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

            showToast(`Stok başarıyla ${isAdding ? 'eklendi' : 'güncellendi'}.`);
            await fetchItems();
            resetForm();
        } catch (error) {
            showToast(error.message, 'danger');
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

  

    cancelDeleteBtn.addEventListener('click', hideDeleteModal);

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
            hideDeleteModal();
        }
    });

    document.getElementById('vazgec-btn').addEventListener('click', resetForm);
    document.getElementById('vazgec-guncelle-btn').addEventListener('click', resetForm);

    listSearchInput.addEventListener('input', applyFiltersAndRender);

    const populateAndSetupFilters = async () => {
        stokTipleri = await populateSelect(stokTipIDSelect, STOKTIP_API_URL, 'id', 'stockTypeName', 'Stok Tipi Seçiniz');

        try {
            const rawGrupData = await fetch(STOKGRUP_API_URL, { headers: getAuthHeaders() });
            if (!rawGrupData.ok) throw new Error('Stok grupları yüklenemedi.');
            const rawGrupJson = await rawGrupData.json();
            stokGruplari = parseApiResponse(rawGrupJson);

            grupFilterSelect.innerHTML = '<option value="">Tüm Gruplar</option>';
            stokGruplari.forEach(grup => {
                const option = document.createElement('option');
                option.value = grup.stockGroupName || grup.StockGroupName;
                option.textContent = grup.stockGroupName || grup.StockGroupName;
                grupFilterSelect.appendChild(option);
            });
        } catch (error) { showToast(error.message, 'danger'); }

        tipFilterSelect.innerHTML = '<option value="">Tüm Tipler</option>';
        stokTipleri.forEach(tip => {
            const option = document.createElement('option');
            option.value = tip.stockTypeName || tip.StockTypeName;
            option.textContent = tip.stockTypeName || tip.StockTypeName;
            tipFilterSelect.appendChild(option);
        });
    };

    grupFilterSelect.addEventListener('change', () => {
        const selectedGrupAdi = grupFilterSelect.value;
        const currentTipValue = tipFilterSelect.value;
        tipFilterSelect.innerHTML = '<option value="">Tüm Tipler</option>';

        let typesToShow = stokTipleri;
        if (selectedGrupAdi) {
            const selectedGrup = stokGruplari.find(g => (g.stockGroupName || g.StockGroupName) === selectedGrupAdi);
            if (selectedGrup) {
                const sId = selectedGrup.id || selectedGrup.Id;
                typesToShow = stokTipleri.filter(tip => {
                    const group = tip.stockGroup || tip.StockGroup || {};
                    return (group.id || group.Id) === sId;
                });
            }
        }

        typesToShow.forEach(tip => {
            const name = tip.stockTypeName || tip.StockTypeName;
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            tipFilterSelect.appendChild(option);
        });

        if (typesToShow.some(tip => (tip.stockTypeName || tip.StockTypeName) === currentTipValue)) {
            tipFilterSelect.value = currentTipValue;
        }

        applyFiltersAndRender();
    });

    tipFilterSelect.addEventListener('change', applyFiltersAndRender);

    // Initial data load
    await populateAndSetupFilters();
    await populateSelect(iscilikBirimiSelect, DOVIZ_API_URL, 'id', 'currencyCode', 'İşçilik Birimi Seçiniz');
    await fetchItems();
    resetForm();
});
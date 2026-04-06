/* stokgrubu_index.js - StokGrubu\Index.cshtml */

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

document.addEventListener('DOMContentLoaded', () => {

    const token = localStorage.getItem('jwt_token');
    const loginUrl = '/Auth/Login';
    const API_BASE_URL = '/StockGroup';
    let currentMode = 'add';

    const itemListEl = document.getElementById('item-list');
    const form = document.getElementById('item-form');
    const addModeButtons = document.getElementById('add-mode-buttons');
    const editModeButtons = document.getElementById('edit-mode-buttons');
    const toastContainer = document.getElementById('toast-container');

    const idInput = document.getElementById('id');
    const stokGrupAdiInput = document.getElementById('stokGrupAdi');
    const deleteButton = document.getElementById('sil-btn');

    const getAuthHeaders = () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    });

    const showToast = (message, type = 'success') => {
        if (!toastContainer) return;
        const bgColor = type === 'success' ? 'bg-rolex-green' : 'bg-danger';
        const toast = document.createElement('div');
        toast.className = `p-4 rounded-lg text-white shadow-lg animate-fade-in-out ${bgColor}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    };

    const parseApiResponse = (response) => {
        if (response && response.data !== undefined) return response.data;
        if (response && response.Data !== undefined) return response.Data;
        return response;
    };

    const fetchItems = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/GetAll`, { headers: getAuthHeaders() });
            if (response.status === 401) {
                window.top.location.href = loginUrl;
                return;
            }
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Veriler alınamadı.');
            }
            const data = await response.json();
            const items = parseApiResponse(data);
            renderItemList(items);
        } catch (error) {
            showToast(error.message, 'danger');
        }
    };

    const renderItemList = (items) => {
        itemListEl.innerHTML = '';
        if (!items || items.length === 0) {
            itemListEl.innerHTML = '<p class="text-center text-gray-500 p-4">Kayıt bulunamadı.</p>';
            return;
        }
        items.forEach((item, index) => {
            const row = document.createElement('div');
            const bgColorClass = index % 2 !== 0 ? 'bg-list-item-bg' : 'bg-white';
            row.className = `p-3 rounded cursor-pointer hover:bg-gray-200 ${bgColorClass}`;
            row.dataset.id = item.id || item.Id;
            row.innerHTML = `<span class="font-medium text-gray-700">${item.stockGroupName || item.StockGroupName}</span>`;
            row.addEventListener('click', () => handleItemSelect(item.id || item.Id));
            itemListEl.appendChild(row);
        });
    };

    const handleItemSelect = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/GetById/${id}`, { headers: getAuthHeaders() });
            if (!response.ok) throw new Error('Detay alınamadı.');
            const data = await response.json();
            const item = parseApiResponse(data);
            populateForm(item);
        } catch (error) {
            showToast(error.message, 'danger');
        }
    };

    const populateForm = (item) => {
        form.reset();
        idInput.value = item.id || item.Id;
        stokGrupAdiInput.value = item.stockGroupName || item.StockGroupName;
        stokGrupAdiInput.dispatchEvent(new Event('input'));
        setMode('edit');
    };

    const resetForm = () => {
        form.reset();
        idInput.value = '';
        stokGrupAdiInput.value = '';
        stokGrupAdiInput.dispatchEvent(new Event('input'));
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
            StockGroupName: stokGrupAdiInput.value
        };

        if (currentMode === 'edit') {
            payload.Id = parseInt(idInput.value);
        }

        const method = currentMode === 'add' ? 'POST' : 'PUT';
        const url = currentMode === 'add' ? `${API_BASE_URL}/Create` : `${API_BASE_URL}/Update`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'İşlem başarısız.');
            }

            showToast(currentMode === 'add' ? 'Kayıt başarıyla eklendi.' : 'Kayıt başarıyla güncellendi.');
            await fetchItems();
            resetForm();
        } catch (error) {
            showToast(error.message, 'danger');
        }
    });

    deleteButton.addEventListener('click', async () => {
        const itemId = idInput.value;
        if (!itemId || !confirm(`'${stokGrupAdiInput.value}' kaydını silmek istediğinizden emin misiniz?`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/${itemId}`, { method: 'DELETE', headers: getAuthHeaders() });
            if (!response.ok) throw new Error('Silme işlemi başarısız.');
            showToast('Kayıt başarıyla silindi.');
            await fetchItems();
            resetForm();
        } catch (error) {
            showToast(error.message, 'danger');
        }
    });

    document.getElementById('vazgec-btn').addEventListener('click', resetForm);
    document.getElementById('vazgec-guncelle-btn').addEventListener('click', resetForm);

    fetchItems();
    resetForm();
});
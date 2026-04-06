/* doviz_index.js - Doviz\Index.cshtml */
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
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '10%': { opacity: '1', transform: 'translateY(0)' },
                    '90%': { opacity: '1', transform: 'translateY(0)' },
                    '100%': { opacity: '0', transform: 'translateY(-20px)' },
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
    const API_BASE_URL = ''; // Local controller
    let allItems = [];
    let currentMode = 'add';
    const form = document.getElementById('item-form');
    const itemListEl = document.getElementById('item-list');
    const addModeButtons = document.getElementById('add-mode-buttons');
    const editModeButtons = document.getElementById('edit-mode-buttons');
    const toastContainer = document.getElementById('toast-container');
    const getAuthHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });

    const currencyCountryMap = {
        'USD': 'AMERİKA BİRLEŞİK DEVLETLERİ', 'EUR': 'AVRUPA BİRLİĞİ', 'GBP': 'İNGİLTERE',
        'CHF': 'İSVİÇRE', 'CAD': 'KANADA', 'JPY': 'JAPONYA', 'AUD': 'AVUSTRALYA',
        'TRY': 'TÜRKİYE'
    };

    const fields = {
        id: document.getElementById('id'),
        dovizKodu: document.getElementById('dovizKodu'),
        dovizAdi: document.getElementById('dovizAdi'),
        sembol: document.getElementById('sembol'),
        ulke: document.getElementById('ulke'),
        metaKodu: document.getElementById('metaKodu'),
        alisOrani: document.getElementById('alisOrani'),
        satisOrani: document.getElementById('satisOrani'),
        aktif: document.getElementById('aktif'),
        bilancoParabirimi: document.getElementById('bilancoParabirimi'),
        ulkeParabirimi: document.getElementById('ulkeParabirimi'),
    };

    const showToast = (message, type = 'success') => {
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
            const response = await fetch(`/Currency/GetAll`, { headers: getAuthHeaders() });
            if (response.status === 401) { window.top.location.href = loginUrl; return; }
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Veriler alınamadı.');
            }
            const data = await response.json();
            allItems = parseApiResponse(data);
            renderItemList(allItems);
        } catch (error) {
            console.error('Fetch Error:', error);
            showToast(error.message, 'danger');
        }
    };

    const renderItemList = (items) => {
        const parsedData = parseApiResponse(items);
        itemListEl.innerHTML = '';
        if (!parsedData || parsedData.length === 0) { 
            itemListEl.innerHTML = '<p class="text-center text-gray-500 p-4">Kayıt bulunamadı.</p>'; 
            return; 
        }
        
        parsedData.forEach((item, index) => {
            const row = document.createElement('div');
            const rowClass = `grid grid-cols-4 items-center p-3 rounded cursor-pointer hover:bg-gray-200 ${index % 2 !== 0 ? 'bg-list-item-bg' : 'bg-white'}`;
            row.className = rowClass;
            row.dataset.id = item.id || item.Id;
            
            const formatOptions = { style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3 };
            const buyRate = item.buyRate || item.BuyRate || 0;
            const sellRate = item.sellRate || item.SellRate || 0;

            row.innerHTML = `<span class="font-medium text-gray-700">${item.currencyCode || item.CurrencyCode}</span>
                             <span class="font-medium text-gray-700">${item.currencyName || item.CurrencyName}</span>
                             <span class="font-medium text-gray-700 text-right">${buyRate.toLocaleString('tr-TR', formatOptions)}</span>
                             <span class="font-medium text-gray-700 text-right">${sellRate.toLocaleString('tr-TR', formatOptions)}</span>`;
            row.addEventListener('click', () => populateForm(item));
            itemListEl.appendChild(row);
        });
    };

    const populateForm = (item) => {
        const id = item.id || item.Id;
        const code = item.currencyCode || item.CurrencyCode;
        const name = item.currencyName || item.CurrencyName;
        const symbol = item.symbol || item.Symbol;
        const country = item.country || item.Country;
        const metaCode = item.metaCode || item.MetaCode;
        const buyRate = item.buyRate || item.BuyRate;
        const sellRate = item.sellRate || item.SellRate;
        const isActive = item.isActive !== undefined ? item.isActive : item.IsActive;
        const isBaseCurrency = item.isBaseCurrency !== undefined ? item.isBaseCurrency : item.IsBaseCurrency;
        const isNationalCurrency = item.isNationalCurrency !== undefined ? item.isNationalCurrency : item.IsNationalCurrency;

        fields.id.value = id || '';
        fields.dovizKodu.value = code || '';
        fields.dovizAdi.value = name || '';
        fields.sembol.value = symbol || '';
        fields.ulke.value = country || '';
        fields.metaKodu.value = metaCode || '';
        fields.alisOrani.value = buyRate || 0;
        fields.satisOrani.value = sellRate || 0;
        fields.aktif.checked = isActive;
        fields.bilancoParabirimi.checked = isBaseCurrency;
        fields.ulkeParabirimi.checked = isNationalCurrency;

        Object.values(fields).forEach(input => {
            if (input && input.classList && input.classList.contains('form-input')) {
                input.dispatchEvent(new Event('input'));
            }
        });
        setMode('edit');
    };

    const resetForm = () => {
        form.reset();
        Object.values(fields).forEach(input => {
            if (input && input.classList && input.classList.contains('form-input')) {
                input.dispatchEvent(new Event('input'));
            }
        });
        fields.aktif.checked = true;
        setMode('add');
    };

    const setMode = (mode) => {
        currentMode = mode;
        addModeButtons.classList.toggle('hidden', mode === 'edit');
        editModeButtons.classList.toggle('hidden', mode === 'add');
    };

    fields.dovizKodu.addEventListener('input', (e) => {
        const code = e.target.value.toUpperCase();
        fields.ulke.value = currencyCountryMap[code] || '';
        fields.ulke.dispatchEvent(new Event('input'));
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            CurrencyCode: fields.dovizKodu.value,
            CurrencyName: fields.dovizAdi.value,
            Symbol: fields.sembol.value,
            Country: fields.ulke.value,
            MetaCode: fields.metaKodu.value,
            BuyRate: parseFloat(fields.alisOrani.value) || 0,
            SellRate: parseFloat(fields.satisOrani.value) || 0,
            IsActive: fields.aktif.checked,
            IsBaseCurrency: fields.bilancoParabirimi.checked,
            IsNationalCurrency: fields.ulkeParabirimi.checked
        };

        if (currentMode === 'edit') {
            payload.Id = parseInt(fields.id.value);
        }

        const method = currentMode === 'add' ? 'POST' : 'PUT';
        const url = currentMode === 'add' ? '/Currency/Create' : '/Currency/Update';

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
            console.error('Submit Error:', error);
            showToast(error.message, 'danger');
        }
    });

    document.getElementById('sil-btn').addEventListener('click', async () => {
        const itemId = fields.id.value;
        if (!itemId || !confirm(`'${fields.dovizAdi.value}' kaydını silmek istediğinizden emin misiniz?`)) return;
        try {
            const response = await fetch(`/Currency/${itemId}`, { method: 'DELETE', headers: getAuthHeaders() });
            if (!response.ok) throw new Error('Silme işlemi başarısız.');
            showToast('Kayıt başarıyla silindi.');
            await fetchItems(); 
            resetForm();
        } catch (error) {
            console.error('Delete Error:', error);
            showToast(error.message, 'danger');
        }
    });

    document.getElementById('vazgec-btn').addEventListener('click', resetForm);
    document.getElementById('vazgec-guncelle-btn').addEventListener('click', resetForm);

    fetchItems();
    resetForm();
});
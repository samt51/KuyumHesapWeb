
const Front_BASE_URL = (window.API_BASE_URL);

console.log(Front_BASE_URL);
// ========= MOBILE RESPONSIVE TABS & MODAL LOGIC =========
window.switchMobileTab = function (tabName) {
    const islemTab = document.getElementById('mobile-tab-islem');
    const fisTab = document.getElementById('mobile-tab-fis');
    const islemBtn = document.getElementById('tab-btn-islem');
    const fisBtn = document.getElementById('tab-btn-fis');
    const indicator = document.getElementById('mobile-tab-indicator');
    if (!islemTab || !fisTab) return;

    if (tabName === 'islem') {
        islemTab.classList.remove('hidden');
        fisTab.classList.add('hidden');
        fisTab.classList.remove('flex');
        islemTab.classList.add('flex');

        if (indicator) indicator.style.transform = 'translateX(0)';
        islemBtn.className = 'relative z-10 flex-1 py-1.5 text-center text-sm font-semibold text-blue-600 transition-colors duration-300 focus:outline-none';
        fisBtn.className = 'relative z-10 flex-1 py-1.5 text-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-300 focus:outline-none';
    } else {
        fisTab.classList.remove('hidden');
        islemTab.classList.add('hidden');
        islemTab.classList.remove('flex');
        fisTab.classList.add('flex');

        if (indicator) indicator.style.transform = 'translateX(100%)';
        fisBtn.className = 'relative z-10 flex-1 py-1.5 text-center text-sm font-semibold text-blue-600 transition-colors duration-300 focus:outline-none';
        islemBtn.className = 'relative z-10 flex-1 py-1.5 text-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-300 focus:outline-none';
    }
};

window.openMobileModal = function (titleText) {
    if (window.innerWidth >= 1024) return;
    const wrapper = document.getElementById('mobile-modal-wrapper');
    const backdrop = document.getElementById('mobile-form-backdrop');
    const title = document.getElementById('mobile-modal-title');
    const panel = document.getElementById('middle-panel');
    if (wrapper && backdrop) {
        if (titleText) title.textContent = titleText;
        wrapper.classList.remove('hidden');
        wrapper.classList.add('flex');
        backdrop.classList.remove('hidden');
        setTimeout(() => panel.classList.remove('translate-y-full'), 10);
    }
};

window.closeMobileModal = function () {
    const wrapper = document.getElementById('mobile-modal-wrapper');
    const backdrop = document.getElementById('mobile-form-backdrop');
    const panel = document.getElementById('middle-panel');
    if (wrapper && backdrop) {
        panel.classList.add('translate-y-full');
        backdrop.classList.add('hidden');
        setTimeout(() => {
            wrapper.classList.add('hidden');
            wrapper.classList.remove('flex');
        }, 300);
    }
};
// ========================================================

/* ================================================================
 * satisVeCari.js
 * KuyumHesapWEB - Satis ve Cari ekrani is mantigi
 * ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const _initialActionOverlay = document.getElementById('action-buttons-overlay');
    if (_initialActionOverlay) {
        _initialActionOverlay.classList.add('hidden');
    }

    document.addEventListener('focusin', (e) => {
        if (e.target && e.target.matches('input[type="text"], input[type="datetime-local"], textarea')) {
            try {
                e.target.select();
            } catch (err) {
            }
        }
    });
    let cariDevirBakiyeler = {};
    const enforceNumericInput = (inputElement) => {
        if (!inputElement) return;

        const handleInput = (e) => {
            const originalValue = e.target.value;
            // Sadece rakamlara ve virgül karakterine izin ver
            const sanitizedValue = originalValue.replace(/[^0-9,]/g, '');

            if (originalValue !== sanitizedValue) {
                // Geçersiz karakter girilirse, uyarı olarak kenarlığı kırmızı yap
                inputElement.classList.add('border-red-500');
                setTimeout(() => {
                    inputElement.classList.remove('border-red-500');
                }, 500);
            }

            e.target.value = sanitizedValue;
        };

        const handlePaste = (e) => {
            e.preventDefault();
            const pasteData = (e.clipboardData || window.clipboardData).getData('text');
            const sanitizedData = pasteData.replace(/[^0-9,]/g, '');
            document.execCommand('insertText', false, sanitizedData);
        };

        inputElement.addEventListener('input', handleInput);
        inputElement.addEventListener('paste', handlePaste); // Yapıştırma işlemini de kontrol et
    };
    const token = localStorage.getItem('jwt_token');
    // API base URL güncellendi
    const API_BASE_URL = Front_BASE_URL;
    let state =
    {
        operationType: 'satis',
        receiptItems: [],
        selectedItemIndex: -1,
        activeCurrency: 'TRY',
        activeCurrencyId: null,
        loadedFis: null,
        fisList: []
    };
    let isFormDirty = false;
    let timeUpdateInterval;
    let isTimeManuallySet = false;
    let lastFetchedEkstreFinalBalance = {};
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return ''; // Geçersiz tarih kontrolü

            return date.toLocaleString('tr-TR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return '';
        }
    };
    const operationTypeToggle = document.getElementById('operation-type-toggle');
    const currencySelect = document.getElementById('currency-select');
    const customerSelect = document.getElementById('customer-select');
    const salespersonSelect = document.getElementById('salesperson-select');
    const receiptTitle = document.getElementById('receipt-title');
    const fisTarihiInput = document.getElementById('fis-tarihi');
    const dynamicContentArea = document.getElementById('dynamic-content-area');
    const receiptLog = document.getElementById('receipt-log');
    const middlePanel = document.getElementById('middle-panel');
    const loadingOverlay = document.getElementById('loading-overlay');
    const [girenToplamSpan, cikanToplamSpan, farkToplamSpan] = [document.getElementById('giren-toplam'), document.getElementById('cikan-toplam'), document.getElementById('fark-toplam')];
    const [addButton, cancelButton, deleteButton] = [document.getElementById('add-button'), document.getElementById('cancel-button'), document.getElementById('delete-button')];
    const [mainSaveButton, mainResetButton, mainDeleteButton] = [document.getElementById('main-save-button'), document.getElementById('main-reset-button'), document.getElementById('main-delete-button')];
    const allActionButtons = document.querySelectorAll('.action-btn');
    const confirmationModal = document.getElementById('confirmation-modal');
    const modalMessage = document.getElementById('modal-message');
    const toastModal = document.getElementById('toast-modal');


    // YENİ: güvenli alan okuma yardımcı fonksiyonu
    const tryKeys = (obj, keys) => {
        if (!obj) return undefined;
        for (const k of keys) {
            if (obj[k] !== undefined && obj[k] !== null) return obj[k];
            const found = Object.keys(obj).find(x => x.toLowerCase() === String(k).toLowerCase());
            if (found) return obj[found];
        }
        return undefined;
    };

    // fetchAndRenderEkstre — artık Receipt controller'ına POST atar ve bakiye alan isimleri için esnek okuma yapar
    const fetchAndRenderEkstre = async () => {
        const selectedValue = customerSlimSelect.getSelected();
        const hesapId = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;

        if (!hesapId || hesapId === '') {
            showToast('Lütfen bir hesap seçiniz.', 'warning');
            return;
        }

        const seciliHesap = allAccounts.find(acc => acc.hesapID == hesapId);
        if (seciliHesap) {
            ekstreHesapAdi.textContent = seciliHesap.hesapAdi;
            ekstreHesapAdi.title = seciliHesap.hesapAdi;
            ekstreHesapId.textContent = `Müşteri No: ${seciliHesap.hesapID}`;
            ekstreHesapTipi.textContent = `Hesap Tipi: ${seciliHesap.hesapTipiAdi}`;
            ekstreHesapTelefon.textContent = seciliHesap.telefon ? `Tel: ${seciliHesap.telefon}` : '';
        }

        const baslangicInputValue = ekstreBaslangic.value;
        const bitisInputValue = ekstreBitis.value;

        if (!baslangicInputValue || !bitisInputValue) {
            showToast('Lütfen başlangıç ve bitiş tarihlerini seçiniz.', 'warning');
            return;
        }

        const payload = {
            CustomerId: parseInt(hesapId, 10),
            StartDate: baslangicInputValue,
            EndDate: bitisInputValue
        };

        ekstreContent.innerHTML = '<div class="text-center p-8"><i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i></div>';

        try {
            const response = await fetch(`${API_BASE_URL}/Receipt/GetEkstreByCustomerIdAndDate`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Ekstre alınamadı (${response.status}) - ${errorText}`);
            }

            const data = await response.json();
            const hareketler = (data && (data.hareketler || data.Hareketler)) || [];
            const devreden = (data && (data.devredenBakiyeler || data.DevredenBakiyeler || data.DevredenBakiye)) || [];

            const balancesHistory = new Map();
            const finalBalances = (devreden || []).reduce((acc, b) => {
                const code = tryKeys(b, ['CurrencyCode', 'currencyCode', 'dovizKodu', 'Currency']) || '';
                const bal = tryKeys(b, ['Balance', 'balance', 'bakiye']) ?? 0;
                if (code) acc[code] = bal;
                return acc;
            }, {});

            hareketler.forEach(h => {
                // desteklenen alan isimleri listesi — backend'in döndürdüğü farklı isimlere karşı esneklik
                const bakiyeBirimi = tryKeys(h, ['BalanceCurrency', 'balanceCurrency', 'bakiyeBirimi', 'birim', 'unit', 'Unit']) || '';
                if (!bakiyeBirimi) return;

                const currentBalances = { ...finalBalances };
                const finalBal = tryKeys(h, ['FinalBalance', 'finalBalance', 'sonBakiye', 'FinalBal', 'final_bal']) ?? 0;
                currentBalances[bakiyeBirimi] = finalBal;

                const movementKey = tryKeys(h, ['MovementId', 'movementId', 'hareketID', 'hareketId', 'hareketID']);
                balancesHistory.set(movementKey ?? (h.hareketID ?? h.movementId ?? Math.random()), JSON.stringify(currentBalances));
                Object.assign(finalBalances, currentBalances);
            });

            lastFetchedEkstreFinalBalance = { ...finalBalances };
            renderBakiyeOzeti(finalBalances);

            if (hareketler.length > 0) {
                const contentHTML = hareketler.map(h => createEkstreSatiri(h, balancesHistory.get(tryKeys(h, ['MovementId', 'movementId', 'hareketID', 'hareketId'])))).join('');
                ekstreContent.innerHTML = `<div class="ekstre-list-container">${contentHTML}</div>`;
                setTimeout(() => {
                    const firstRow = ekstreContent.querySelector('.ekstre-item');
                    if (firstRow) {
                        const prev = ekstreContent.querySelector('.selected-ekstre-row');
                        if (prev && prev !== firstRow) prev.classList.remove('selected-ekstre-row');
                        firstRow.classList.add('selected-ekstre-row');
                        try {
                            const balances = JSON.parse(firstRow.dataset.balances || '{}');
                            renderBakiyeOzeti(balances);
                        } catch (e) {
                            renderBakiyeOzeti(lastFetchedEkstreFinalBalance);
                        }
                    } else {
                        renderBakiyeOzeti(lastFetchedEkstreFinalBalance);
                    }
                }, 10);
            } else {
                ekstreContent.innerHTML = '<p class="text-center text-gray-500 py-8">Belirtilen tarih aralığında hareket bulunamadı.</p>';
            }
        } catch (error) {
            console.error("Ekstre hatası:", error);
            ekstreContent.innerHTML = `<p class="text-center text-red-500 p-8">Hata: ${error.message}</p>`;
        }
    };

    // fetchAndRenderCariBakiye — cari bakiye çağrısını artık POST üzerinden yapar; alan isimleri esnek okunur
    // fetchAndRenderCariBakiye — cari bakiye çağrısını artık POST üzerinden yapar
    const fetchAndRenderCariBakiye = async (endDateString) => {
        const selectedValue = customerSlimSelect.getSelected();
        const hesapId = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;

        if (!hesapId || hesapId === '' || state.operationType !== 'cari') {
            cariDevirBakiyeler = {};
            renderCariTotals();
            return;
        }

        try {
            const baslangicTarihi = '1970-01-01';
            const bitisTarihi = endDateString ? getLocalDateString(new Date(endDateString)) : getLocalDateString(new Date());

            const data = await getHesapEkstresi(hesapId, baslangicTarihi, bitisTarihi);

            const bakiyeDurumu = (data.devredenBakiyeler || data.DevredenBakiyeler || []).reduce((acc, b) => {
                const code = b.currencyCode ?? b.CurrencyCode ?? b.dovizKodu ?? '';
                const val = b.balance ?? b.Balance ?? 0;
                if (code) acc[code] = val;
                return acc;
            }, {});

            (data.hareketler || data.Hareketler || []).forEach(h => {
                const bakiyeGosterimBirimi = h.karsilikBirim || h.birim || h.BalanceCurrency || '';
                // Öncelik: FinalBalance -> finalBalance -> sonBakiye -> mevcut değer -> 0
                bakiyeDurumu[bakiyeGosterimBirimi] = (h.FinalBalance ?? h.finalBalance ?? h.sonBakiye ?? bakiyeDurumu[bakiyeGosterimBirimi] ?? 0);
            });

            cariDevirBakiyeler = bakiyeDurumu;
        } catch (error) {
            console.error(`Devir bakiyeleri alınırken hata oluştu: ${error.message}`);
            cariDevirBakiyeler = {};
        } finally {
            renderCariTotals();
        }
    };
    const ekstreButton = document.getElementById('ekstre-button');
    const ekstreModal = document.getElementById('ekstre-modal');
    const salesListButton = document.getElementById('sales-list-button');
    const fisListModal = document.getElementById('fis-list-modal');
    const fisListModalTitle = document.getElementById('fis-list-modal-title');
    const fisListContent = document.getElementById('fis-list-content');
    const fisListModalCloseButton = document.getElementById('fis-list-modal-close-button');
    const fisListCustomerFilter = document.getElementById('fis-list-customer-filter');
    const fisListStartDate = document.getElementById('fis-list-start-date');
    const fisListEndDate = document.getElementById('fis-list-end-date');
    const fisListFilterButton = document.getElementById('fis-list-filter-button');
    let fisListCustomerFilterSlimSelect;
    const ekstreHesapAdi = document.getElementById('ekstre-hesap-adi');
    const ekstreHesapId = document.getElementById('ekstre-hesap-id');
    const ekstreHesapTipi = document.getElementById('ekstre-hesap-tipi');
    const ekstreHesapTelefon = document.getElementById('ekstre-hesap-telefon');
    const ekstreBaslangic = document.getElementById('ekstre-baslangic-tarihi');
    const ekstreBitis = document.getElementById('ekstre-bitis-tarihi');
    const ekstreGetirButton = document.getElementById('ekstre-getir-button');
    const ekstreContent = document.getElementById('ekstre-content');
    const ekstreModalCloseButton = document.getElementById('ekstre-modal-close-button');
    const ekstreBakiyeOzeti = document.getElementById('ekstre-bakiye-ozeti');
    const ekstreHasPozisyon = document.getElementById('ekstre-has-pozisyon');
    let allAccounts = [];
    let allFinancialAccounts = [];
    let allCurrencies = [];
    let allExchangeRates = [];
    let allStoklar = [];
    let originalCustomerOptions = [];
    let customerSlimSelect;
    let salespersonSlimSelect;
    let bakiyeSnapshots = [];
    let nationalCurrency = null;
    const getAuthHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
    const showToast = (message, type = 'warning') => {
        console.log(`${type.toUpperCase()}: ${message}`);

        const titleContainer = toastModal.querySelector('div');
        const titleEl = toastModal.querySelector('h3');
        const messageEl = toastModal.querySelector('p');
        const okButton = toastModal.querySelector('button');

        messageEl.textContent = message;
        titleEl.className = 'text-lg font-bold mb-4';

        switch (type) {
            case 'success':
                titleEl.textContent = 'Başarılı';
                titleEl.classList.add('text-green-700');
                break;
            case 'danger':
            case 'error':
                titleEl.textContent = 'Hata';
                titleEl.classList.add('text-red-700');
                break;
            case 'info':
                titleEl.textContent = 'Bilgi';
                titleEl.classList.add('text-blue-700');
                break;
            default:
                titleEl.textContent = 'Uyarı';
                titleEl.classList.add('text-gray-800');
                break;
        }

        toastModal.classList.remove('hidden');
        setTimeout(() => {
            titleContainer.classList.remove('scale-95', 'opacity-0');
            titleContainer.classList.add('scale-100', 'opacity-100');
        }, 10);

        const closeToast = () => {
            titleContainer.classList.add('scale-95', 'opacity-0');
            titleContainer.classList.remove('scale-100', 'opacity-100');
            setTimeout(() => {
                toastModal.classList.add('hidden');
            }, 300);
        };

        const newOkButton = okButton.cloneNode(true);
        okButton.parentNode.replaceChild(newOkButton, okButton);
        newOkButton.addEventListener('click', closeToast);
    };
    const formatCurrency = (amount, digits = 2) => {
        if (isNaN(amount) || amount === null) return '0,00';
        return new Intl.NumberFormat('tr-TR', { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(amount);
    }
    // Yeni helper: ekran üzerinde gösterilecek KUR formatı — 3 ondalık
    const formatRate = (amount) => {
        return formatCurrency(amount, 3);
    };
    const parseFormattedNumber = (str) => parseFloat(String(str || '0').replace(/\./g, '').replace(',', '.')) || 0;
    // --- Güncellendi: artık isEntry opsiyonel parametre alıyor ve querystring'e ekliyor ---
    const fetchLatestCure = async (currencyId, isEntry = null) => {
        try {
            if (!currencyId) return null;
            const base = String(Front_BASE_URL || API_BASE_URL).replace(/\/$/, '');
            let url = `${base}/Cure/GetLastCure?id=${encodeURIComponent(currencyId)}`;
            // isEntry yalnızca boolean verildiğinde querystring'e eklenir (nullable davranışı korunur)
            if (typeof isEntry === 'boolean') {
                url += `&isEntry=${isEntry ? 'true' : 'false'}`;
            }
            const resp = await fetch(url, { headers: getAuthHeaders() });
            if (!resp.ok) {
                const txt = await resp.text().catch(() => '');
                console.warn('Cure/GetLastCure failed:', resp.status, txt);
                return null;
            }
            const value = await resp.json();
            const num = parseFloat(value);
            if (isNaN(num)) return null;
            return num;
        } catch (err) {
            console.warn('fetchLatestCure error', err);
            return null;
        }
    };
    const toLocalISOString = (date) => {
        const tzoffset = (new Date()).getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date - tzoffset)).toISOString().slice(0, -1);
        return localISOTime.substring(0, 16);
    };
    const getLocalDateString = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const showLoadingOverlay = () => {
        // Disabled during testing so "Lütfen Bekleyiniz..." görünmez.
        // To enable again: loadingOverlay.classList.remove('hidden');
    };
    const hideLoadingOverlay = () => {
        // Disabled during testing.
        // To enable again: loadingOverlay.classList.add('hidden');
    };
    const updateHeaderLockState = (forceLock = false) => {
        const hasItems = state.receiptItems.length > 0;
        const shouldLock = forceLock || hasItems;
        fisTarihiInput.disabled = shouldLock;
        if (shouldLock) {
            customerSlimSelect.disable();
            currencySelect.disabled = true;
        } else {
            customerSlimSelect.enable();
            currencySelect.disabled = false;
        }
    };
    const showConfirmationModal = (message, onConfirm, onCancel = () => { }) => {
        modalMessage.textContent = message;
        confirmationModal.classList.remove('hidden');

        const confirmBtn = document.getElementById('modal-confirm');
        const cancelBtn = document.getElementById('modal-cancel');

        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

        newConfirmBtn.addEventListener('click', () => {
            onConfirm();
            confirmationModal.classList.add('hidden');
        });
        newCancelBtn.addEventListener('click', () => {
            onCancel();
            confirmationModal.classList.add('hidden');
        });
    };
    const populateSelect = async (selectElement, url, dataTextField, dataValueField, placeholder, filter) => {
        try {
            const response = await fetch(url, { headers: getAuthHeaders() });
            if (!response.ok) throw new Error(`Veri alınamadı: ${response.statusText}`);
            let data = await response.json();
            if (!Array.isArray(data)) {
                console.error(`Beklenmeyen veri formatı alındı. URL: ${url}. Alınan veri:`, data);
                data = [];
            }
            if (filter) data = data.filter(filter);
            selectElement.innerHTML = placeholder ? `<option value="">${placeholder}</option>` : '';
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item[dataValueField];
                option.textContent = item[dataTextField];
                selectElement.appendChild(option);
            });
            return data;
        } catch (error) {
            showToast(`Listeleme hatası: ${error.message}`, 'danger');
            return [];
        }
    };
    const renderCariTotals = () => {
        const cariTotalsDiv = document.getElementById('cari-totals');
        const hesapId = customerSlimSelect?.getSelected();

        let tableHTML = `
                <table class="w-full text-xs font-mono">
                    <thead>
                        <tr class="border-b">
                            <th class="py-1 text-left">Birim</th>
                            <th class="py-1 text-right">Devir</th>
                            <th class="py-1 text-right">Giren</th>
                            <th class="py-1 text-right">Çıkan</th>
                            <th class="py-1 text-right">Kalan</th>
                        </tr>
                    </thead>
                    <tbody>
            `;

        if (!hesapId) {
            tableHTML += `<tr><td colspan="5" class="text-center py-4 text-gray-500">Lütfen bir hesap seçin.</td></tr>`;
        } else {
            const allCurrencies = new Set([
                ...Object.keys(cariDevirBakiyeler),
                ...state.receiptItems.map(item => item.equivalentCurrency)
            ]);

            let hasData = false;
            for (const currency of allCurrencies) {
                if (!currency) continue;

                const devir = cariDevirBakiyeler[currency] || 0;

                const giren = state.receiptItems
                    .filter(i => i.isIncome && i.equivalentCurrency === currency)
                    .reduce((sum, i) => sum + i.equivalentTotal, 0);

                const cikan = state.receiptItems
                    .filter(i => !i.isIncome && i.equivalentCurrency === currency)
                    .reduce((sum, i) => sum + i.equivalentTotal, 0);

                const kalan = devir + giren - cikan;

                hasData = true;
                const formatAndColor = (val) => {
                    const color = val < 0 ? 'text-red-600' : 'text-green-600';
                    const sign = val >= 0 ? '+' : '';
                    return `<span class="${color}">${sign}${formatCurrency(val)}</span>`;
                };

                tableHTML += `
                        <tr>
                            <td class="py-1 text-left font-bold">${currency}</td>
                            <td class="py-1 text-right">${formatAndColor(devir)}</td>
                            <td class="py-1 text-right">${formatCurrency(giren)}</td>
                            <td class="py-1 text-right">${formatCurrency(cikan)}</td>
                            <td class="py-1 text-right font-bold">${formatAndColor(kalan)}</td>
                        </tr>
                    `;
            }

            if (!hasData) {
                tableHTML += `<tr><td colspan="5" class="text-center py-4 text-gray-500">Hesabın hareketi veya devir bakiyesi yok.</td></tr>`;
            }
        }

        tableHTML += '</tbody></table>';
        cariTotalsDiv.innerHTML = tableHTML;
    };
    // fetchAndRenderCariBakiye — cari bakiye çağrısını artık POST üzerinden yapar

    const renderReceipt = () => {
        const createItemHTML = (item) => {
            const originalIndex = state.receiptItems.indexOf(item);
            const isIncome = item.isIncome;
            const amountClass = isIncome ? 'text-green-600' : 'text-red-600';
            const sign = isIncome ? '+' : '-';
            let selectedClass = 'border-l-4 border-transparent';
            if (originalIndex === state.selectedItemIndex) {
                selectedClass = isIncome ? 'selected-item-income border-l-4' : 'selected-item-expense border-l-4';
            }
            let itemHTML = '';

            if (item.itemClass === 'acik-hesap') {
                const isIncome = item.isIncome;
                const amountClass = isIncome ? 'text-green-600' : 'text-red-600';
                const selectedClass = originalIndex === state.selectedItemIndex ?
                    (isIncome ? 'selected-item-income border-l-4' : 'selected-item-expense border-l-4') :
                    'border-l-4 border-transparent';

                // Tek satırda gösterim
                itemHTML = `
                <div class="flex justify-between items-center">
                    <div class="font-bold ${amountClass}">
                        ${isIncome ? 'ALACAĞINA' : 'BORCUNA'}
                    </div>
                    <div class="font-mono text-right font-bold ${amountClass}">
                        ${formatCurrency(item.total)} ${item.currency}
                    </div>
                </div>
                ${item.details?.karsilikAktif ? `<div class="text-xs text-gray-500 text-right">(${formatCurrency(item.details.karsilik.amount)} ${item.details.karsilik.currency})</div>` : ''}
            `;

                return `<div class="receipt-item text-xs p-2 rounded-md transition-colors cursor-pointer hover:bg-gray-50 ${selectedClass}" data-index="${originalIndex}">${itemHTML}</div>`;
            }
            // Nakit, İskonto, Virman Kalemleri
            if (item.itemClass === 'cash' || item.itemClass === 'iskonto' || item.itemClass === 'virman') {
                const directionText = item.isIncome ? ' ALACAĞINA' : ' BORCUNA';
                const miktarHTML = `${sign}${formatCurrency(item.total)} ${item.currency}`; // Ana miktar

                // SOL ÜST: Sadece İskonto ve Virman için yönü ekle
                const miktarHTML_solUst = (item.itemClass === 'iskonto' || item.itemClass === 'virman') ? `${miktarHTML}${directionText}` : miktarHTML;

                const accountName = item.details?.karsiHesapAdi || item.details?.accountName || 'Bilinmeyen Hesap';

                const defaultVirmanDescGiris = 'Virman Girişi'; const defaultVirmanDescCikis = 'Virman Çıkışı';
                const defaultIskontoDescAlacak = 'Hesabın Alacağına (+)'; const defaultIskontoDescBorc = 'Hesabın Borcuna (-)';
                let descriptionText = '';
                if (item.description && ![defaultVirmanDescGiris, defaultVirmanDescCikis, defaultIskontoDescAlacak, defaultIskontoDescBorc].includes(item.description)) {
                    descriptionText = ` - ${item.description}`;
                }

                let karsilikHTML_sagUst = '';
                let karsilikHTML_parantez = '';
                let kurHTML = '';

                const karsilikVar = (item.details?.karsilikBirimi && item.details.karsilikBirimi !== item.currency) || (item.details?.bilancoBirimi && item.details.bilancoBirimi !== item.currency);
                const karsilikDegeri = item.details?.karsilikDegeri ?? item.details?.bilancoDegeri ?? item.equivalentTotal;
                const karsilikBirimi = item.details?.karsilikBirimi ?? item.details?.bilancoBirimi ?? item.equivalentCurrency;
                const karsilikKuru = item.details?.karsilikKuru ?? item.details?.bilancoKuru ?? item.hesapKuru;

                if ((item.itemClass === 'iskonto' || item.itemClass === 'virman') && state.operationType === 'satis' && karsilikVar) {
                    // Durum 1: Satış + İskonto/Virman + Farklı Karşılık
                    karsilikHTML_sagUst = miktarHTML; // Sağ üst = Sadece Ana Miktar
                    karsilikHTML_parantez = `${formatCurrency(karsilikDegeri)} ${karsilikBirimi}`;
                    kurHTML = `${karsilikBirimi} Kuru: ${formatCurrency(karsilikKuru, 4)}`;
                    itemHTML = `
                                        <div class="flex justify-between items-center">
                                            <span class="font-mono font-bold ${amountClass}">${miktarHTML_solUst}</span>
                                            <span class="font-mono font-bold ${amountClass} text-right">${karsilikHTML_sagUst}</span>
                                        </div>
                                        <div class="flex justify-between items-center text-gray-500 text-xs mt-1">
                                            <span>
                                                ${accountName}${descriptionText}
                                                <span class="font-mono font-bold text-gray-600">(${karsilikHTML_parantez})</span>
                                            </span>
                                            <span class="font-mono">${kurHTML}</span>
                                        </div>`;
                } else {
                    // Durum 2: Diğerleri
                    karsilikHTML_sagUst = `${formatCurrency(item.equivalentTotal)} ${item.equivalentCurrency}`; // Sağ Üst = Karşılık Tutarı
                    kurHTML = `${item.equivalentCurrency} Kuru: ${formatCurrency(item.hesapKuru, 4)}`;

                    // === DÜZELTME: Sağ üste yön EKLEME ===
                    // Artık directionText'i buraya eklemeyeceğiz.
                    const miktarHTML_sagUst_final = karsilikHTML_sagUst;
                    // === DÜZELTME SONU ===

                    itemHTML = `
                                        <div class="flex justify-between items-center">
                                            <span class="font-mono font-bold ${amountClass}">${miktarHTML_solUst}</span>
                                            <span class="font-mono font-bold ${amountClass} text-right">${miktarHTML_sagUst_final}</span>
                                        </div>
                                        <div class="flex justify-between items-center text-gray-500 text-xs mt-1">
                                            <span>${accountName}${descriptionText}</span>
                                            <span class="font-mono">${kurHTML}</span>
                                        </div>`;
                }

            } else if (item.itemClass === 'product') {
                // Ürün kodu (Değişiklik yok)
                const urunSafHasDegeri = (item.details?.toplamHas || 0) - (item.details?.toplamIscilik || 0);
                const toplamBakiyeEtkisi = item.details?.toplamHas || 0;
                let iscilikDiv = '';
                if ((item.details?.toplamIscilik || 0) > 0) { iscilikDiv = `<div class="text-xs text-gray-500 mt-1">İşçilik: (${formatCurrency(item.details.birimIscilik, 3)}) <span class="font-semibold ml-1">${formatCurrency(item.details.toplamIscilik)} HAS</span></div>`; }
                else if (item.details?.stok && item.details.stok.stokGrupAdi !== 'HURDA GRUBU') { iscilikDiv = `<div class="text-xs text-gray-500 mt-1">İşçiliksiz</div>`; }
                const urunAdi = item.details?.stok ? item.details.stok.stokAdi : item.details?.stokAdi;
                itemHTML = `<div class="font-mono"><div class="text-sm font-bold ${amountClass}">${urunAdi} ${formatCurrency(item.details?.miktar)} ${item.details?.birim} (${formatCurrency(item.details?.milyem, 3)}) <span class="ml-2 font-semibold text-gray-700">${formatCurrency(urunSafHasDegeri)} HAS</span><span class="float-right">${formatCurrency(toplamBakiyeEtkisi)} HAS</span></div>${iscilikDiv}</div>`;
            }

            return `<div class="receipt-item text-xs p-2 rounded-md transition-colors cursor-pointer hover:bg-gray-50 ${selectedClass}" data-index="${originalIndex}">${itemHTML}</div>`;
        };

        const groupedItems = state.receiptItems.reduce((acc, item) => { /* ... (Gruplama - Değişiklik yok) ... */
            let groupKey;
            if (item.itemClass === 'product') {
                const direction = item.isIncome ? 'GİRİŞLER' : 'ÇIKIŞLAR';
                const urunTipi = item.details?.stok ? item.details.stok.stokTipAdi : item.details?.stokTipAdi;
                let productType = (urunTipi || 'DİĞER').toUpperCase();
                if (productType === 'SARRAFİYE') { productType = 'ALTIN'; }
                groupKey = `ÜRÜN ${direction} (${productType})`;
            } else if (item.itemClass === 'iskonto') { groupKey = 'İSKONTOLAR'; }
            else if (item.itemClass === 'virman') { groupKey = 'VİRMAN (MAHSUPLAR)'; }
            else if (item.itemClass === 'acik-hesap') { groupKey = 'AÇIK HESAP'; }
            else { groupKey = item.isIncome ? 'NAKİT GİRİŞLER' : 'NAKİT ÇIKIŞLAR'; }
            if (!acc[groupKey]) { acc[groupKey] = { items: [], isIncome: item.isIncome }; }
            if (item.itemClass === 'iskonto' || item.itemClass === 'virman') { acc[groupKey].isIncome = item.isIncome; }
            acc[groupKey].items.push(item);
            return acc;
        }, {});
        const sortedGroupKeys = Object.keys(groupedItems).sort((a, b) => { /* ... (Sıralama - Değişiklik yok) ... */
            const groupA = groupedItems[a]; const groupB = groupedItems[b];
            const incomeSort = Number(groupB.isIncome) - Number(groupA.isIncome);
            if (incomeSort !== 0) { return incomeSort; }
            return a.localeCompare(b);
        });

        let receiptHTML = '';
        for (const groupKey of sortedGroupKeys) {
            const group = groupedItems[groupKey];
            const headerColor = group.isIncome ? 'text-green-700' : 'text-red-700';
            let borderColor = group.isIncome ? 'border-green-200' : 'border-red-200';
            if (groupKey === 'İSKONTOLAR' || groupKey === 'VİRMAN (MAHSUPLAR)') { borderColor = 'border-blue-200'; }
            receiptHTML += `<div class="mb-3 border ${borderColor} rounded-md shadow-sm overflow-hidden"><div class="flex justify-between items-center p-2 border-b ${borderColor} bg-gray-50"><h6 class="text-xs font-bold ${headerColor} uppercase tracking-wider">${groupKey}</h6></div><div class="space-y-1 p-2">${group.items.map(createItemHTML).join('')}</div></div>`;
        }

        receiptLog.innerHTML = receiptHTML;
        if (state.operationType === 'satis') { updateTotals(); }
        else { renderCariTotals(); }
    };
    const updateTotals = () => {
        // Tüm işlemleri dahil ederek toplam hesaplama
        const giren = state.receiptItems
            .filter(i => i.isIncome)  // isIncome true olanlar
            .reduce((sum, i) => sum + i.equivalentTotal, 0);

        const cikan = state.receiptItems
            .filter(i => !i.isIncome)  // isIncome false olanlar
            .reduce((sum, i) => sum + i.equivalentTotal, 0);

        const fark = giren - cikan;

        // Toplamları ekranda göster
        girenToplamSpan.textContent = `${formatCurrency(giren)} ${state.activeCurrency}`;
        cikanToplamSpan.textContent = `${formatCurrency(cikan)} ${state.activeCurrency}`;
        farkToplamSpan.textContent = `${formatCurrency(fark)} ${state.activeCurrency}`;
        farkToplamSpan.className = `font-extrabold text-sm ${fark >= 0 ? 'text-blue-700' : 'text-red-700'}`;
    };
    const showDefaultMessage = () => {
        isFormDirty = false;
        middlePanel.classList.remove('hat-green', 'hat-red');
        dynamicContentArea.innerHTML = `<div class="w-full h-full flex flex-col items-center justify-center text-center text-gray-400"><i class="fas fa-hand-pointer text-5xl mb-4"></i><p class="text-xl">Lütfen bir işlem seçin.</p></div>`;
        [addButton, cancelButton, deleteButton].forEach(btn => btn.classList.add('hidden'));
        state.selectedItemIndex = -1;
        renderReceipt();
        updateHeaderLockState();
    };
    const updateButtonLabels = () => {
        const isCari = state.operationType === 'cari';
        document.getElementById('label-nakit-tahsilat').textContent = isCari ? 'Nakit Giriş' : 'Nakit Tahsilat';
        document.getElementById('label-nakit-odeme').textContent = isCari ? 'Nakit Çıkış' : 'Nakit Ödeme';

        const urunAlisLabel = document.getElementById('label-urun-alis');
        const urunSatisLabel = document.getElementById('label-urun-satis');
        if (isCari) {
            urunAlisLabel.textContent = 'Ürün Giriş';
            urunSatisLabel.textContent = 'Ürün Çıkış';
        } else {
            urunAlisLabel.textContent = 'Ürün Alış';
            urunSatisLabel.textContent = 'Ürün Satış';
        }
    };
    const updateMainButtons = () => {
        const isSlipLoaded = state.loadedFis !== null;

        if (isSlipLoaded) {
            // Fiş yüklü, ama düzenleme modunda mıyız?
            if (state.isEditModeActive) {
                // EVET, DÜZENLEME MODU: Güncelle ve Sil butonlarını göster
                mainSaveButton.innerHTML = `<i class="fas fa-sync-alt mr-2"></i>Güncelle`;
                mainSaveButton.classList.remove('hidden');
                mainDeleteButton.classList.remove('hidden');
            } else {
                // HAYIR, SADECE ÖNİZLEME: Bütün butonları gizle
                mainSaveButton.classList.add('hidden');
                mainDeleteButton.classList.add('hidden');
            }
        } else {
            // FİŞ YÜKLÜ DEĞİL (YENİ İŞLEM): Sadece Kaydet butonunu göster
            mainSaveButton.innerHTML = `<i class="fas fa-save mr-2"></i>Kaydet`;
            mainSaveButton.classList.remove('hidden');
            mainDeleteButton.classList.add('hidden');
        }
    };
    // REPLACEMENT: improved action buttons visibility logic that respects SlimSelect value
    // REPLACEMENT: Do not show the white overlay that covers the header on load.
    // Instead only dim/disable the action-buttons container so the rounded border + shadow remain visible.
    // REPLACEMENT: improved action buttons visibility logic that respects SlimSelect value
    // REPLACE: improved action buttons visibility and initial normalization
    const updateActionButtonsVisibility = () => {
        const overlay = document.getElementById('action-buttons-overlay');
        const container = document.getElementById('action-buttons-container');
        if (!container) return;

        // Resolve selection robustly (SlimSelect may return string, array, object)
        const resolveSelectedCustomerId = () => {
            let raw = '';
            try {
                if (customerSlimSelect && typeof customerSlimSelect.getSelected === 'function') {
                    raw = customerSlimSelect.getSelected();
                } else if (customerSelect) {
                    raw = customerSelect.value;
                }
            } catch (e) {
                raw = customerSelect ? customerSelect.value : '';
            }

            // Keep a copy of native option text (useful when placeholder is selected)
            const nativeText = (customerSelect && customerSelect.selectedIndex >= 0) ?
                String(customerSelect.options[customerSelect.selectedIndex].text || '').trim().toLowerCase() : '';

            // If array, take first element (it might be string or object)
            if (Array.isArray(raw)) {
                raw = raw.length > 0 ? raw[0] : '';
            }

            // If object, try common keys (but also check text for placeholder)
            if (raw && typeof raw === 'object') {
                const objText = String(raw.text ?? raw.label ?? '').trim().toLowerCase();
                if (objText) {
                    raw = raw.value ?? raw.id ?? raw[0] ?? '';
                    // if the object shown text equals placeholder, treat as empty
                    if (nativeText && objText === nativeText) return '';
                } else {
                    raw = raw.value ?? raw.id ?? raw[0] ?? '';
                }
            }

            raw = String(raw ?? '').trim();

            // fallback to native select value/text if still empty
            if ((!raw || raw === '') && customerSelect) {
                raw = String(customerSelect.value ?? '').trim();
            }

            // detect placeholder texts (use first original option text if available)
            const placeholderFromOriginal = (originalCustomerOptions && originalCustomerOptions.length > 0)
                ? String(originalCustomerOptions[0].text || '').trim().toLowerCase()
                : 'hesap seçiniz...';
            const lowered = String(raw).trim().toLowerCase();

            // treat known placeholders or native placeholder text as empty
            if (!lowered || lowered === 'null' || lowered === '0' || lowered === 'all' || lowered === placeholderFromOriginal || nativeText === placeholderFromOriginal) {
                return '';
            }
            return raw;
        };

        const customerId = resolveSelectedCustomerId();
        const hasCustomer = !!customerId;

        // Overlay show/hide via classes only
        if (overlay) {
            if (!hasCustomer) {
                overlay.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
            } else {
                overlay.classList.add('hidden', 'opacity-0', 'pointer-events-none');
            }
        }

        // Keep outer border visible; only visually dim internal buttons when no selection
        container.classList.toggle('dim-buttons', !hasCustomer);

        const actionBtns = container.querySelectorAll('.action-btn');
        actionBtns.forEach(b => {
            if (hasCustomer) {
                b.classList.remove('opacity-60');
                b.disabled = false;
                b.removeAttribute('aria-disabled');
            } else {
                b.classList.add('opacity-60');
                b.disabled = true;
                b.setAttribute('aria-disabled', 'true');
            }
        });
    };
    const updateActiveCurrency = () => {
        const selectedOption = currencySelect.options[currencySelect.selectedIndex];
        if (selectedOption && selectedOption.value) {
            state.activeCurrency = selectedOption.text;
            state.activeCurrencyId = selectedOption.value;
        } else if (state.operationType === 'satis') {
            const countryCurrency = allCurrencies.find(c => c.ulkeParabirimi === true);
            if (countryCurrency) {
                currencySelect.value = countryCurrency.id;
                state.activeCurrency = countryCurrency.dovizKodu;
                state.activeCurrencyId = countryCurrency.id;
            }
        }
        if (document.body.contains(receiptLog)) renderReceipt();
    };
    const updateUIForOperationType = () => {
        const isCari = operationTypeToggle.checked;
        state.operationType = isCari ? 'cari' : 'satis';
        document.body.className = `text-gray-800 p-2 overflow-hidden ${state.operationType}-active`;

        document.getElementById('satis-totals').classList.toggle('hidden', isCari);
        document.getElementById('cari-totals').classList.toggle('hidden', !isCari);
        salesListButton.innerHTML = `<i class="fas fa-list mr-1.5"></i>${isCari ? 'Cari Liste' : 'Satış Listesi'}`;

        // === Fiş Başlığını Güncelle ===
        receiptTitle.textContent = isCari ? 'Cari Fişi' : 'Satış Fişi';
        // === Güncelleme Sonu ===

        currencySelect.classList.toggle('hidden', isCari);

        const customerOptions = originalCustomerOptions;
        if (isCari) {
            const cariCustomers = customerOptions.filter(opt => opt.text && !opt.text.toLowerCase().includes('peşin'));
            customerSlimSelect.setData(cariCustomers);
            customerSlimSelect.setSelected('');
            currencySelect.value = '';
        } else {
            const countryCurrency = allCurrencies.find(c => c.ulkeParabirimi === true);
            if (countryCurrency) currencySelect.value = countryCurrency.id;
            customerSlimSelect.setData(customerOptions);
            const pesinMusteriExists = customerOptions.some(opt => opt.value == '29');
            if (pesinMusteriExists) { customerSlimSelect.setSelected('29'); }
            else { customerSlimSelect.setSelected(''); }
        }
        updateActiveCurrency();
        updateButtonLabels();
        resetTransaction(); // Bu fonksiyon zaten başlığı, fişi vs. sıfırlar
        // fetchAndRenderCariBakiye(); // resetTransaction içinde çağrılıyor
        window.salespersonSlimSelect = salespersonSlimSelect;
        window.customerSlimSelect = customerSlimSelect;
        updateActionButtonsVisibility();
    };
    const handlePanelChange = (panelType, itemToEdit = null) => {
        console.log("handlePanelChange çağrıldı:", panelType, itemToEdit);

        updateHeaderLockState(true);
        isFormDirty = false;
        middlePanel.classList.remove('hat-green', 'hat-red');

        // İşlem modu kontrolü
        const isSatisMode = state.operationType === 'satis';

        // MOD KISITLAMALARI

        // 1. Çeviri SADECE CARİ modda kullanılabilir
        if (panelType === 'ceviri' && isSatisMode) {
            showToast('Çeviri işlemi sadece CARİ modda kullanılabilir.', 'warning');
            showDefaultMessage();
            if (window.switchMobileTab) window.switchMobileTab('fis');
            return;
        }

        // 2. AÇIK HESAP SADECE SATIŞ modunda kullanılabilir
        if (panelType === 'acik-hesap' && !isSatisMode) {
            showToast('Açık Hesap işlemi sadece SATIŞ modunda kullanılabilir.', 'warning');
            showDefaultMessage();
            if (window.switchMobileTab) window.switchMobileTab('fis');
            return;
        }

        // 3 ve 4. İskonto ve Virman her iki modda da kullanılabilir (kontrol gerekmez)

        // Panel renklerini ayarla
        const isIncome = panelType.includes('tahsilat') ||
            panelType.includes('alis') ||
            panelType.includes('virman') ||
            panelType.includes('acik-hesap') ||
            panelType.includes('ceviri');

        // Renk ayarı (render... fonksiyonları kendi renklerini ayarlar)
        if (panelType !== 'iskonto' && panelType !== 'virman' && panelType !== 'ceviri') {
            middlePanel.classList.add(isIncome ? 'hat-green' : 'hat-red');
        } else if (panelType === 'virman' || panelType === 'ceviri') {
            // Virman ve Çeviri nötr, renk yok
        } // İskonto rengi renderIskontoForm içinde ayarlanacak

        // FORM YÖNLENDİRMELERİ
        switch (panelType) {
            case 'iskonto':
                console.log("İskonto formu açılıyor");
                renderIskontoForm(itemToEdit);
                break;

            case 'virman':
                console.log("Virman formu açılıyor");
                renderVirmanForm(itemToEdit);
                break;

            case 'ceviri':
                console.log("Çeviri formu açılıyor");
                renderCeviriForm(itemToEdit);
                break;

            case 'acik-hesap':
                console.log("Açık hesap formu açılıyor");
                renderAcikHesapForm(itemToEdit);
                break;

            default:
                if (panelType.startsWith('urun')) {
                    console.log("Ürün panel değişikliği yapılıyor");
                    handleProductPanelChange(
                        panelType === 'urun-alis' || panelType === 'urun-giris',
                        itemToEdit
                    );
                } else if (panelType.startsWith('nakit')) {
                    const button = document.getElementById(`btn-${panelType}`);
                    const title = button ? button.querySelector('span').textContent :
                        panelType.charAt(0).toUpperCase() + panelType.slice(1);

                    console.log("Nakit form açılıyor");
                    renderNakitForm(title,
                        panelType.includes('tahsilat') || panelType.includes('giris'),
                        itemToEdit
                    );
                } else {
                    console.warn("Tanımsız panelType:", panelType);
                    showDefaultMessage();
                    if (window.switchMobileTab) window.switchMobileTab('fis');
                }
        }
    };
    const renderAcikHesapForm = (itemToEdit = null) => {
        // Sadece Satış modunda çalışır
        if (state.operationType !== 'satis') {
            showToast('Açık Hesap işlemi sadece "Satış" modunda kullanılabilir.', 'warning');
            showDefaultMessage();
            if (window.switchMobileTab) window.switchMobileTab('fis');
            return;
        }

        const isEditing = itemToEdit !== null;
        const farkTutar = parseFormattedNumber(farkToplamSpan.textContent);

        // Düzenleme modu değilse ve fark 0 ise uyarı ver
        if (!isEditing && farkTutar === 0) {
            showToast(`Açık Hesaba atılacak fark bulunamadı (0 ${state.activeCurrency})`, 'warning');
            showDefaultMessage();
            if (window.switchMobileTab) window.switchMobileTab('fis');
            return;
        }

        const title = 'Açık Hesap İşlemi';
        const otomatikTutar = isEditing ? itemToEdit.total : Math.abs(farkTutar);
        // Fark negatifse ALACAĞINA, pozitifse BORCUNA
        const defaultActiveType = isEditing ?
            (itemToEdit.isIncome ? 'alacagina' : 'borcuna') :
            (farkTutar < 0 ? 'alacagina' : 'borcuna');
        const option1 = { label: 'HESABIN BORCUNA (-)', value: 'borcuna' };
        const option2 = { label: 'HESABIN ALACAĞINA (+)', value: 'alacagina' };

        const formHTML = `
                <h3 class="font-bold text-lg mb-4">${title}</h3>
                <div class="space-y-4">
                    <div>
                        <div id="acikhesap-tipi-toggle" class="tri-toggle-container" data-selected="${defaultActiveType}">
                            <div class="tri-toggle-slider" style="width: calc((100% - 6px) / 2);"></div>
                            <div class="tri-toggle-options">
                                <div class="tri-toggle-option active" data-value="${option1.value}">${option1.label}</div>
                                <div class="tri-toggle-option" data-value="${option2.value}">${option2.label}</div>
                            </div>
                        </div>
                    </div>

                    <div id="acikhesap-form-content">
                        <div class="grid grid-cols-12 gap-x-1 gap-y-1 items-end">
                            <div class="float-label-container col-span-2">
                                <select id="form-acikhesap-currency" class="float-label-input float-label-select" disabled>
                                    <option value="${state.activeCurrencyId}">${state.activeCurrency}</option>
                                </select>
                                <label for="form-acikhesap-currency" class="float-label">Birim</label>
                            </div>
                            <div class="float-label-container col-span-7">
                                <input type="text" id="form-acikhesap-amount" class="float-label-input text-right font-mono px-3" placeholder=" " value="0,00">
                                <label for="form-acikhesap-amount" class="float-label">Miktar</label>
                            </div>
                            <div class="float-label-container col-span-3">
                                <input type="text" id="form-acikhesap-rate" class="float-label-input text-right font-mono px-3" placeholder=" " value="1,0000">
                                <label for="form-acikhesap-rate" class="float-label">Kur</label>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        dynamicContentArea.innerHTML = formHTML;
        dynamicContentArea.dataset.activeTab = defaultActiveType;

        // Form elemanlarını seç
        const mainAmountInput = document.getElementById('form-acikhesap-amount');
        const mainRateInput = document.getElementById('form-acikhesap-rate');
        const currencySelectEl = document.getElementById('form-acikhesap-currency');

        // Başlangıç değerlerini ayarla
        mainAmountInput.value = formatCurrency(otomatikTutar);

        // Panel rengini ayarla
        middlePanel.classList.remove('hat-green', 'hat-red');
        middlePanel.classList.add(defaultActiveType === 'alacagina' ? 'hat-green' : 'hat-red');

        // Toggle işlemleri
        const toggleContainer = document.getElementById('acikhesap-tipi-toggle');
        const toggleOptions = toggleContainer.querySelectorAll('.tri-toggle-option');

        toggleOptions.forEach(option => {
            if (option.dataset.value === defaultActiveType) {
                option.classList.add('active');
                // Aktif seçeneğin rengini ayarla
                option.style.color = defaultActiveType === 'alacagina' ? '#059669' : '#DC2626';
            } else {
                option.classList.remove('active');
                option.style.color = '';
            }

            option.addEventListener('click', () => {
                const selectedValue = option.dataset.value;
                toggleContainer.dataset.selected = selectedValue;
                dynamicContentArea.dataset.activeTab = selectedValue;

                // Tüm seçeneklerin rengini sıfırla ve active class'ı kaldır
                toggleOptions.forEach(opt => {
                    opt.classList.remove('active');
                    opt.style.color = '';
                });

                // Seçili seçeneği aktif yap ve rengini ayarla
                option.classList.add('active');
                option.style.color = selectedValue === 'alacagina' ? '#059669' : '#DC2626';

                // Panel rengini değiştir
                middlePanel.classList.remove('hat-green', 'hat-red');
                middlePanel.classList.add(selectedValue === 'alacagina' ? 'hat-green' : 'hat-red');

                isFormDirty = true;
            });
        });

        // Numeric input kontrolü
        if (typeof enforceNumericInput === 'function') {
            enforceNumericInput(mainAmountInput);
            enforceNumericInput(mainRateInput);

            // Kur inputları için 4 decimal (kullanıcı elle değiştirirse formatla)
            mainRateInput.addEventListener('blur', (e) => {
                e.target.value = formatCurrency(parseFormattedNumber(e.target.value), 4);
            });
        }

        // Yeni: Açık Hesap için doğru kuru getir (öncelik: currency-select / state.activeCurrencyId -> GetLastCure)
        const updateAcikHesapRate = async () => {
            try {
                // Öncelik: global state.activeCurrencyId, sonra sayfadaki select (nadir durum)
                let currencyId = state.activeCurrencyId;
                if (currencySelect && currencySelect.value) currencyId = currencySelect.value;
                // fallback to form select if present
                if (currencySelectEl && currencySelectEl.value) currencyId = currencySelectEl.value;

                let rate = null;
                if (currencyId) {
                    const live = await fetchLatestCure(currencyId).catch(() => null);
                    if (live !== null && !isNaN(live) && live > 0) rate = live;
                }

                // Fallback: allExchangeRates / allCurrencies / nationalCurrency
                if (rate === null) {
                    const currencyObj = allCurrencies.find(c => String(c.id) === String(currencyId));
                    if (currencyObj) {
                        rate = (currencyObj.dovizKodu === nationalCurrency.dovizKodu) ? 1.0 :
                            (allExchangeRates.find(r => r.dovizKodu === currencyObj.dovizKodu)?.alisKuru ??
                                allExchangeRates.find(r => r.dovizKodu === currencyObj.dovizKodu)?.satisKuru ??
                                currencyObj.alisKuru ?? currencyObj.satisKuru ?? 1);
                    } else {
                        rate = 1.0;
                    }
                }

                mainRateInput.value = formatRate(rate);
            } catch (err) {
                console.warn('updateAcikHesapRate hata:', err);
                mainRateInput.value = formatCurrency(1, 4);
            }
        };

        // Eğer ana sayfadaki currency-select değişirse kuru yenile (kullanıcı farklı para birimi seçtiğinde)
        if (currencySelect) {
            currencySelect.addEventListener('change', async () => {
                await updateAcikHesapRate();
                // güncellendiğini işaretle
                isFormDirty = true;
            });
        }

        // İlk yüklemede canlı kuru çek
        (async () => {
            await updateAcikHesapRate();
        })();

        // Düzenleme modu kontrolü ve buton ayarları
        if (isEditing && itemToEdit) {
            fillAcikHesapFormForEdit(itemToEdit);
            addButton.innerHTML = '<i class="fas fa-sync-alt mr-1.5"></i>Güncelle';
            addButton.onclick = () => updateItemInReceipt('acik-hesap');
            deleteButton.classList.remove('hidden');
        } else {
            addButton.innerHTML = '<i class="fas fa-check mr-1.5"></i>Ekle';
            addButton.onclick = () => addItemToReceipt('acik-hesap');
            deleteButton.classList.add('hidden');
        }

        // ÖNEMLİ: Butonları her durumda göster
        [addButton, cancelButton].forEach(btn => btn.classList.remove('hidden'));
        cancelButton.onclick = showDefaultMessage;
    };
    const renderCeviriForm = () => {
        middlePanel.classList.remove('hat-green', 'hat-red'); // Çeviri nötrdür, renk verme
        isFormDirty = true;

        const allCurrenciesOptionsHTML = allCurrencies.map(c => `<option value="${c.id}">${c.dovizKodu}</option>`).join('');

        // Toggle seçenekleri
        const option1 = { label: "BORCUNDAKİ", value: "borcundaki" };
        const option2 = { label: "ALACAĞINDAKİ", value: "alacagindaki" };
        const defaultActiveType = option1.value; // Varsayılan aktif tip

        // --- Form HTML'i ---
        let formHTML = `
                    <h3 class="font-bold text-lg mb-4">Çeviri İşlemi (Bakiye Döviz Değişimi)</h3>

                    <div>
                        <div id="ceviri-tipi-toggle" class="tri-toggle-container" data-selected="${defaultActiveType}">
                            <div class="tri-toggle-slider" style="width: calc((100% - 6px) / 2);"></div> <div class="tri-toggle-options">
                                <div class="tri-toggle-option active" data-value="${option1.value}">${option1.label}</div>
                                <div class="tri-toggle-option" data-value="${option2.value}">${option2.label}</div>
                            </div>
                        </div>
                    </div>

                    <div id="ceviri-form-borcundaki" class="space-y-4 mt-4"> <p class="text-xs text-gray-600">Müşterinin mevcut <strong>BORÇ</strong> bakiyesinden bir tutarı başka bir birime çevirir.</p>

                        <div>
                            <label class="text-sm font-medium text-gray-700">1. Kaynak Birim (Borçtan Düş)</label>
                            <div class="flex items-center mt-1 space-x-2">
                                <select id="form-ceviri-borc-source-currency" class="block w-28 px-3 border border-gray-300 bg-gray-50 rounded-md text-sm h-[38px]">
                                    <option value="">Birim</option>${allCurrenciesOptionsHTML}
                                </select>
                                <input type="text" id="form-ceviri-borc-source-amount" class="block w-full px-3 border border-gray-300 rounded-md text-right font-mono h-[38px]" value="0,00" placeholder="Tutar">
                                <input type="text" id="form-ceviri-borc-source-rate" class="block w-36 px-3 border border-gray-300 rounded-md text-right font-mono h-[38px]" value="0,0000" placeholder="Kur (${nationalCurrency.dovizKodu})">
                            </div>
                        </div>

                        <div class="flex justify-center items-center text-gray-400"><i class="fas fa-arrow-down fa-lg"></i></div>

                        <div>
                            <label class="text-sm font-medium text-gray-700">2. Hedef Birim (Borca Ekle)</label>
                            <div class="flex items-center mt-1 space-x-2">
                                <select id="form-ceviri-borc-target-currency" class="block w-28 px-3 border border-gray-300 bg-gray-50 rounded-md text-sm h-[38px]">
                                    <option value="">Birim</option>${allCurrenciesOptionsHTML}
                                </select>
                                <input type="text" id="form-ceviri-borc-target-amount" class="block w-full px-3 border border-gray-300 rounded-md text-right font-mono h-[38px]" value="0,00" placeholder="Tutar">
                                <input type="text" id="form-ceviri-borc-target-rate" class="block w-36 px-3 border border-gray-300 rounded-md text-right font-mono h-[38px]" value="0,0000" placeholder="Kur (${nationalCurrency.dovizKodu})">
                            </div>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700">Açıklama</label>
                            <textarea id="form-ceviri-borc-aciklama" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm" rows="2" placeholder="Çeviri açıklaması..."></textarea>
                        </div>
                    </div>

                    <div id="ceviri-form-alacagindaki" class="hidden space-y-4 mt-4"> <p class="text-xs text-gray-600">Müşterinin mevcut <strong>ALACAK</strong> bakiyesinden bir tutarı başka bir birime çevirir.</p>

                        <div>
                            <label class="text-sm font-medium text-gray-700">1. Kaynak Birim (Alacaktan Düş)</label>
                            <div class="flex items-center mt-1 space-x-2">
                                <select id="form-ceviri-alacak-source-currency" class="block w-28 px-3 border border-gray-300 bg-gray-50 rounded-md text-sm h-[38px]">
                                    <option value="">Birim</option>${allCurrenciesOptionsHTML}
                                </select>
                                <input type="text" id="form-ceviri-alacak-source-amount" class="block w-full px-3 border border-gray-300 rounded-md text-right font-mono h-[38px]" value="0,00" placeholder="Tutar">
                                <input type="text" id="form-ceviri-alacak-source-rate" class="block w-36 px-3 border border-gray-300 rounded-md text-right font-mono h-[38px]" value="0,0000" placeholder="Kur (${nationalCurrency.dovizKodu})">
                            </div>
                        </div>

                        <div class="flex justify-center items-center text-gray-400"><i class="fas fa-arrow-down fa-lg"></i></div>

                        <div>
                            <label class="text-sm font-medium text-gray-700">2. Hedef Birim (Alacağa Ekle)</label>
                            <div class="flex items-center mt-1 space-x-2">
                                <select id="form-ceviri-alacak-target-currency" class="block w-28 px-3 border border-gray-300 bg-gray-50 rounded-md text-sm h-[38px]">
                                    <option value="">Birim</option>${allCurrenciesOptionsHTML}
                                </select>
                                <input type="text" id="form-ceviri-alacak-target-amount" class="block w-full px-3 border border-gray-300 rounded-md text-right font-mono h-[38px]" value="0,00" placeholder="Tutar">
                                <input type="text" id="form-ceviri-alacak-target-rate" class="block w-36 px-3 border border-gray-300 rounded-md text-right font-mono h-[38px]" value="0,0000" placeholder="Kur (${nationalCurrency.dovizKodu})">
                            </div>
                        </div>
                        <div>
                            <label class="text-sm font-medium text-gray-700">Açıklama</label>
                            <textarea id="form-ceviri-alacak-aciklama" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm" rows="2" placeholder="Çeviri açıklaması..."></textarea>
                        </div>
                    </div>
                `;
        dynamicContentArea.innerHTML = formHTML;
        dynamicContentArea.dataset.activeTab = defaultActiveType; // Aktif sekmeyi ata

        // --- Form Mantığı ---
        const toggleContainer = document.getElementById('ceviri-tipi-toggle');
        const toggleOptions = toggleContainer.querySelectorAll('.tri-toggle-option');
        const formBorcundaki = document.getElementById('ceviri-form-borcundaki');
        const formAlacagindaki = document.getElementById('ceviri-form-alacagindaki');

        // Toggle click event
        toggleOptions.forEach(option => {
            option.addEventListener('click', () => {
                const selectedValue = option.dataset.value;

                toggleContainer.dataset.selected = selectedValue; // Slider pozisyonu
                dynamicContentArea.dataset.activeTab = selectedValue; // Aktif sekme

                toggleOptions.forEach(opt => opt.classList.remove('active')); // Yazı renkleri
                option.classList.add('active'); // Yazı renkleri

                // Formları göster/gizle
                formBorcundaki.classList.toggle('hidden', selectedValue !== 'borcundaki');
                formAlacagindaki.classList.toggle('hidden', selectedValue !== 'alacagindaki');

                isFormDirty = true; // Seçim değişti
            });
        });

        // Hesaplama Mantığı (Her iki form için ayrı ayrı kurulur)
        const setupCeviriCalculator = (typePrefix) => { // typePrefix = 'borc' veya 'alacak'
            const sourceCurrencySelect = document.getElementById(`form-ceviri-${typePrefix}-source-currency`);
            const sourceAmountInput = document.getElementById(`form-ceviri-${typePrefix}-source-amount`);
            const sourceRateInput = document.getElementById(`form-ceviri-${typePrefix}-source-rate`);
            const targetCurrencySelect = document.getElementById(`form-ceviri-${typePrefix}-target-currency`);
            const targetAmountInput = document.getElementById(`form-ceviri-${typePrefix}-target-amount`);
            const targetRateInput = document.getElementById(`form-ceviri-${typePrefix}-target-rate`);

            // Numeric input formatlamasını uygula
            [sourceAmountInput, sourceRateInput, targetAmountInput, targetRateInput].forEach(input => {
                if (input && typeof enforceNumericInput === 'function') enforceNumericInput(input);
            });

            let activeField = 'sourceAmount'; // Hangi alanın manuel girildiğini takip et

            // Yeni: async updateRate - önce canlı Cure/GetLastCure çağır, sonra fallback
            const updateRate = async (currencySelect, rateInput) => {
                if (!currencySelect || !rateInput) return;
                const currencyId = currencySelect.value;
                let rate = null;

                // Try live cure from server
                try {
                    if (currencyId) {
                        const live = await fetchLatestCure(currencyId); // global helper mevcut
                        if (live !== null && !isNaN(live) && live > 0) {
                            rate = live;
                        }
                    }
                } catch (err) {
                    console.warn('fetchLatestCure failed', err);
                    rate = null;
                }

                // Fallback: exchange rates veya currency meta
                if (rate === null) {
                    const currencyObj = allCurrencies.find(c => String(c.id) === String(currencyId));
                    if (currencyObj) {
                        if (currencyObj.dovizKodu === nationalCurrency.dovizKodu) {
                            rate = 1.0;
                        } else {
                            const rateData = allExchangeRates.find(r => r.dovizKodu === currencyObj.dovizKodu);
                            rate = rateData ? (rateData.alisKuru ?? rateData.satisKuru ?? currencyObj.alisKuru ?? currencyObj.satisKuru ?? 0) : (currencyObj.alisKuru ?? currencyObj.satisKuru ?? 0);
                        }
                    } else {
                        rate = 0;
                    }
                }

                rateInput.value = formatRate(rate);
                calculate();
            };

            // Tutar hesaplama fonksiyonu (aynı)
            const calculate = () => {
                const sourceAmount = parseFormattedNumber(sourceAmountInput.value);
                const sourceRate = parseFormattedNumber(sourceRateInput.value);
                const targetAmount = parseFormattedNumber(targetAmountInput.value);
                const targetRate = parseFormattedNumber(targetRateInput.value);

                if (activeField === 'sourceAmount' || activeField === 'sourceRate') {
                    const totalBaseEquivalent = sourceAmount * sourceRate; // Ülke para birimi karşılığı
                    const newTargetAmount = (targetRate > 0) ? totalBaseEquivalent / targetRate : 0;
                    targetAmountInput.value = formatCurrency(newTargetAmount);
                } else if (activeField === 'targetAmount' || activeField === 'targetRate') {
                    const totalBaseEquivalent = targetAmount * targetRate;
                    const newSourceAmount = (sourceRate > 0) ? totalBaseEquivalent / sourceRate : 0;
                    sourceAmountInput.value = formatCurrency(newSourceAmount);
                }
            };

            // Event Listeners
            sourceCurrencySelect.addEventListener('change', () => updateRate(sourceCurrencySelect, sourceRateInput));
            targetCurrencySelect.addEventListener('change', () => updateRate(targetCurrencySelect, targetRateInput));

            [sourceAmountInput, sourceRateInput, targetAmountInput, targetRateInput].forEach(input => {
                input.addEventListener('focus', (e) => {
                    const id = e.target.id;
                    if (id.includes('source-amount')) activeField = 'sourceAmount';
                    else if (id.includes('source-rate')) activeField = 'sourceRate';
                    else if (id.includes('target-amount')) activeField = 'targetAmount';
                    else if (id.includes('target-rate')) activeField = 'targetRate';
                });
                input.addEventListener('input', calculate);
                // Blur event'ı ile de formatlamayı garantileyelim
                input.addEventListener('blur', (e) => {
                    if (e.target.id.includes('-rate')) { // Sadece kur inputları için 4 hane
                        e.target.value = formatCurrency(parseFormattedNumber(e.target.value), 4);
                    } else { // Tutar inputları için 2 hane
                        e.target.value = formatCurrency(parseFormattedNumber(e.target.value), 2);
                    }
                    // Blur sonrası yeniden hesapla
                    calculate();
                });
            });

            // İlk kur değerlerini ata (eğer birim seçili ise) - async initialize
            (async () => {
                if (sourceCurrencySelect && sourceCurrencySelect.value) {
                    await updateRate(sourceCurrencySelect, sourceRateInput);
                }
                if (targetCurrencySelect && targetCurrencySelect.value) {
                    await updateRate(targetCurrencySelect, targetRateInput);
                }
            })();
        };

        // Her iki form bölümü için hesaplayıcıları kur
        setupCeviriCalculator('borc');
        setupCeviriCalculator('alacak');

        // --- Butonları Ayarla ---
        addButton.innerHTML = '<i class="fas fa-check mr-1.5"></i>Ekle';
        // Not: addItemToReceipt fonksiyonu aktif sekmeyi dataset.activeTab'dan okuyacak
        addButton.onclick = () => addItemToReceipt('ceviri');
        deleteButton.classList.add('hidden'); // Çeviri düzenlemesi şimdilik yok
        [addButton, cancelButton].forEach(btn => btn.classList.remove('hidden'));
        cancelButton.onclick = showDefaultMessage;

        // Düzenleme modu şimdilik desteklenmiyor
        // if (isEditing && itemToEdit) { ... }
    };
    const renderVirmanForm = (itemToEdit = null) => {
        const isEditing = itemToEdit !== null;
        const title = isEditing ? 'Virman Düzenle' : 'Virman İşlemi';
        const isCari = state.operationType === 'cari';
        const isSatisModu = !isCari;

        const selectedValue = customerSlimSelect.getSelected();
        const customerIdValue = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;
        const karsiHesapOptionsHTML = allAccounts
            .filter(acc => acc.hesapID != customerIdValue && acc.hesapTipiID != 5 && acc.hesapTipiID != 6 && acc.hesapTipiID != 7)
            .map(acc => `<option value="${acc.hesapID}">${acc.hesapAdi}</option>`)
            .join('');

        const currencyOptionsHTML = allCurrencies.map(c => `<option value="${c.id}">${c.dovizKodu}</option>`).join('');

        const option1 = isCari ? { label: 'HESABIN BORCUNA (-)', value: 'giris' } : { label: 'HESABIN BORCUNA (-)', value: 'borcuna' };
        const option2 = isCari ? { label: 'HESABIN ALACAĞINA (+)', value: 'cikis' } : { label: 'HESABIN ALACAĞINA (+)', value: 'alacagina' };
        const defaultActiveType = isCari ? 'cikis' : 'alacagina';

        const formHTML = `
                <h3 class="font-bold text-lg mb-4">${title}</h3>
                <div class="space-y-4">
                    <div>
                        <div id="virman-tipi-toggle" class="tri-toggle-container" data-selected="${defaultActiveType}">
                            <div class="tri-toggle-slider" style="width: calc((100% - 6px) / 2);"></div>
                            <div class="tri-toggle-options">
                                <div class="tri-toggle-option active" data-value="${option1.value}">${option1.label}</div>
                                <div class="tri-toggle-option" data-value="${option2.value}">${option2.label}</div>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-6 gap-x-2 gap-y-1 items-end">
                        <div class="float-label-container col-span-1">
                            <select id="form-virman-currency" class="float-label-input float-label-select" required ${isSatisModu ? 'disabled' : ''}>
                                <option value=""></option>
                                ${currencyOptionsHTML}
                            </select>
                            <label for="form-virman-currency" class="float-label">Birim</label>
                        </div>
                        <div class="float-label-container col-span-3">
                            <input type="text" id="form-virman-amount" class="float-label-input text-right font-mono" placeholder=" " value="0,00">
                            <label for="form-virman-amount" class="float-label">Miktar</label>
                        </div>
                        <div class="float-label-container col-span-2">
                            <input type="text" id="form-virman-rate" class="float-label-input text-right font-mono" placeholder=" " value="1,0000">
                            <label for="form-virman-rate" class="float-label">Kur</label>
                        </div>
                    </div>
                    <div class="float-label-container">
                        <select id="form-virman-karsi-hesap" class="float-label-input float-label-select" required>
                            <option value=""></option>
                            ${karsiHesapOptionsHTML}
                        </select>
                        <label for="form-virman-karsi-hesap" class="float-label">Karşı Hesap</label>
                    </div>
                    <div class="p-2 border border-gray-200 rounded-md bg-gray-50">
                        <div class="flex justify-between items-center">
                            <label for="virman-karsilik-toggle" class="text-sm font-medium text-gray-700 select-none">Farklı Birim Karşılığı</label>
                            <div class="karsilik-toggle-container">
                                <input type="checkbox" id="virman-karsilik-toggle" class="karsilik-toggle">
                                <label for="virman-karsilik-toggle" class="karsilik-toggle-label"></label>
                            </div>
                        </div>
                    </div>
                    <div id="virman-karsilik-details" class="hidden space-y-3 pt-3 border-t border-gray-200 mt-3">
                        <div class="grid grid-cols-6 gap-x-2 gap-y-1 items-end">
                            <div class="float-label-container col-span-1">
                                <select id="form-virman-karsilik-currency" class="float-label-input float-label-select" required>
                                    <option value=""></option>
                                    ${currencyOptionsHTML}
                                </select>
                                <label for="form-virman-karsilik-currency" class="float-label">Karşılık Birim</label>
                            </div>
                            <div class="float-label-container col-span-3">
                                <input type="text" id="form-virman-karsilik-amount" class="float-label-input text-right font-mono" placeholder=" " value="0,00">
                                <label for="form-virman-karsilik-amount" class="float-label">Karşılık Miktar</label>
                            </div>
                            <div class="float-label-container col-span-2">
                                <input type="text" id="form-virman-karsilik-rate" class="float-label-input text-right font-mono" placeholder=" " value="1,0000">
                                <label for="form-virman-karsilik-rate" class="float-label">Karşılık Kur</label>
                            </div>
                        </div>
                    </div>
                    <div class="float-label-container mt-6">
                        <textarea id="form-virman-aciklama" class="float-label-input pt-4" placeholder=" " rows="5"></textarea>
                        <label for="form-virman-aciklama" class="float-label">Açıklama</label>
                    </div>
                </div>
            `;
        dynamicContentArea.innerHTML = formHTML;
        dynamicContentArea.dataset.activeTab = defaultActiveType;

        const toggleContainer = document.getElementById('virman-tipi-toggle');
        const toggleOptions = toggleContainer.querySelectorAll('.tri-toggle-option');
        const currencySelect = document.getElementById('form-virman-currency');
        const amountInput = document.getElementById('form-virman-amount');
        const rateInput = document.getElementById('form-virman-rate');
        const karsiHesapSelect = document.getElementById('form-virman-karsi-hesap');
        const karsilikToggle = document.getElementById('virman-karsilik-toggle');
        const karsilikDetailsDiv = document.getElementById('virman-karsilik-details');
        const karsilikCurrencySelect = document.getElementById('form-virman-karsilik-currency');
        const karsilikAmountInput = document.getElementById('form-virman-karsilik-amount');
        const karsilikRateInput = document.getElementById('form-virman-karsilik-rate');
        const aciklamaTextarea = document.getElementById('form-virman-aciklama');

        dynamicContentArea.querySelectorAll('select.float-label-input').forEach(selectEl => {
            const container = selectEl.closest('.float-label-container');
            const checkValue = () => { container.classList.toggle('select-has-value', !!selectEl.value); };
            selectEl.addEventListener('change', checkValue);
            checkValue();
        });

        [amountInput, rateInput, karsilikAmountInput, karsilikRateInput].forEach(input => {
            if (input && typeof enforceNumericInput === 'function') enforceNumericInput(input);
        });

        dynamicContentArea.querySelectorAll('input:not([type="checkbox"]), select, textarea').forEach(el => {
            el.addEventListener('input', () => isFormDirty = true);
            el.addEventListener('change', () => isFormDirty = true);
        });
        if (karsilikToggle) karsilikToggle.addEventListener('change', () => isFormDirty = true);

        const syncEquivalentFields = () => {
            if (!karsilikToggle.checked) {
                karsilikCurrencySelect.value = currencySelect.value;
                karsilikAmountInput.value = amountInput.value;
                karsilikRateInput.value = rateInput.value;
                const container = karsilikCurrencySelect.closest('.float-label-container');
                if (container) {
                    container.classList.toggle('select-has-value', !!karsilikCurrencySelect.value);
                }
            }
        };

        let activeCalculatorField = 'amount';
        const calculateTotals = () => {
            const amount = parseFormattedNumber(amountInput.value);
            const miktarRate = parseFormattedNumber(rateInput.value);
            const equivalentAmount = parseFormattedNumber(karsilikAmountInput.value);
            const hesapRate = parseFormattedNumber(karsilikRateInput.value);
            const karsilikAktif = karsilikToggle.checked;

            if (!karsilikAktif) {
                syncEquivalentFields();
                return;
            }

            if (activeCalculatorField === 'amount' || activeCalculatorField === 'rateMiktar') {
                const totalBaseEquivalent = amount * miktarRate;
                const newEquivalentAmount = (hesapRate > 0) ? totalBaseEquivalent / hesapRate : 0;
                karsilikAmountInput.value = formatCurrency(newEquivalentAmount, 2);
            } else if (activeCalculatorField === 'equivalent') {
                const totalBaseEquivalent = amount * miktarRate;
                const newHesapRate = (equivalentAmount > 0) ? totalBaseEquivalent / equivalentAmount : 0;
                karsilikRateInput.value = formatRate(newHesapRate);
            } else if (activeCalculatorField === 'rateHesap') {
                const totalBaseEquivalent = amount * miktarRate;
                const newEquivalentAmount = (hesapRate > 0) ? totalBaseEquivalent / hesapRate : 0;
                karsilikAmountInput.value = formatCurrency(newEquivalentAmount, 2);
            }
        };

        // UPDATED: async updateRate uses fetchLatestCure first, then falls back to allExchangeRates / nationalCurrency
        const updateRate = async (currencySelectEl, rateInputEl, isIncomeSensitive = true) => {
            if (!currencySelectEl || !rateInputEl) return;
            const currencyId = currencySelectEl.value;
            let rate = null;

            // Try live cure from server
            try {
                if (currencyId) {
                    const live = await fetchLatestCure(currencyId);
                    if (live !== null && !isNaN(live) && live > 0) {
                        rate = live;
                    }
                }
            } catch (e) {
                console.warn('fetchLatestCure failed', e);
                rate = null;
            }

            // Fallback: exchange rates or national currency
            if (rate === null) {
                const currencyObj = allCurrencies.find(c => c.id == currencyId);
                if (currencyObj) {
                    if (currencyObj.dovizKodu === nationalCurrency.dovizKodu) {
                        rate = 1.0;
                    } else {
                        const rateData = allExchangeRates.find(r => r.dovizKodu === currencyObj.dovizKodu);
                        if (rateData) rate = isIncomeSensitive ? (rateData.alisKuru ?? rateData.satisKuru ?? 0) : (rateData.satisKuru ?? rateData.alisKuru ?? 0);
                        else rate = currencyObj.alisKuru ?? currencyObj.satisKuru ?? 0;
                    }
                } else {
                    rate = 0;
                }
            }

            rateInputEl.value = formatCurrency(rate, 4);
            calculateTotals();
        };

        // Event wiring uses async updateRate
        currencySelect.addEventListener('change', async () => {
            await updateRate(currencySelect, rateInput, true);
        });

        karsilikCurrencySelect.addEventListener('change', async () => {
            await updateRate(karsilikCurrencySelect, karsilikRateInput, true);
        });

        amountInput.addEventListener('input', calculateTotals);
        rateInput.addEventListener('input', calculateTotals);
        amountInput.addEventListener('focus', () => activeCalculatorField = 'amount');
        rateInput.addEventListener('focus', () => activeCalculatorField = 'rateMiktar');
        amountInput.addEventListener('blur', (e) => e.target.value = formatCurrency(parseFormattedNumber(e.target.value), 2));
        rateInput.addEventListener('blur', (e) => { e.target.value = formatCurrency(parseFormattedNumber(e.target.value), 4); calculateTotals(); });

        karsilikToggle.addEventListener('change', () => {
            const isChecked = karsilikToggle.checked;
            karsilikDetailsDiv.classList.toggle('hidden', !isChecked);
            if (isChecked) {
                karsilikCurrencySelect.value = nationalCurrency.id; karsilikAmountInput.value = formatCurrency(0);
                // fetch live rate for default karşılık birimi
                updateRate(karsilikCurrencySelect, karsilikRateInput, true);
                activeCalculatorField = 'amount';
            } else { syncEquivalentFields(); }
            isFormDirty = true;
        });

        // Initialize rates when form opens
        (async () => {
            // if a currency is already set (edit mode) try fetch & set
            if (currencySelect && currencySelect.value) {
                await updateRate(currencySelect, rateInput, true);
            }
            if (karsilikCurrencySelect && karsilikCurrencySelect.value && !karsilikDetailsDiv.classList.contains('hidden')) {
                await updateRate(karsilikCurrencySelect, karsilikRateInput, true);
            }
        })();

        toggleOptions.forEach(option => {
            const isActive = option.dataset.value === defaultActiveType;

            if (isActive) {
                option.classList.add('active');
                const isPositive = (defaultActiveType === 'alacagina' || defaultActiveType === 'cikis');
                option.style.color = isPositive ? '#059669' : '#DC2626';
            } else {
                option.classList.remove('active');
                option.style.color = '#6B7280';
            }

            option.addEventListener('click', () => {
                const selectedValue = option.dataset.value;
                toggleContainer.dataset.selected = selectedValue;
                dynamicContentArea.dataset.activeTab = selectedValue;

                toggleOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                const isPositive = (selectedValue === 'alacagina' || selectedValue === 'cikis');
                option.style.color = isPositive ? '#059669' : '#DC2626';

                middlePanel.classList.remove('hat-green', 'hat-red');
                middlePanel.classList.add(isPositive ? 'hat-green' : 'hat-red');

                // update main currency based rate if needed
                updateRate(currencySelect, rateInput, true);
                if (karsilikToggle.checked) {
                    updateRate(karsilikCurrencySelect, karsilikRateInput, true);
                }

                isFormDirty = true;
            });
        });

        const isDefaultPositive = (defaultActiveType === 'cikis' || defaultActiveType === 'alacagina');
        middlePanel.classList.remove('hat-green', 'hat-red');
        middlePanel.classList.add(isDefaultPositive ? 'hat-green' : 'hat-red');
        if (isSatisModu) {
            currencySelect.value = state.activeCurrencyId || nationalCurrency.id; currencySelect.disabled = true;
            currencySelect.closest('.float-label-container').classList.add('select-has-value'); updateRate(currencySelect, rateInput, true);
        } else {
            currencySelect.value = nationalCurrency.id; currencySelect.closest('.float-label-container').classList.add('select-has-value'); updateRate(currencySelect, rateInput, true);
        }
        syncEquivalentFields();

        addButton.innerHTML = isEditing ? '<i class="fas fa-sync-alt mr-1.5"></i>Güncelle' : '<i class="fas fa-check mr-1.5"></i>Ekle';
        addButton.onclick = () => isEditing ? updateItemInReceipt('virman') : addItemToReceipt('virman');
        deleteButton.classList.toggle('hidden', !isEditing);
        [addButton, cancelButton].forEach(btn => btn.classList.remove('hidden'));
        cancelButton.onclick = showDefaultMessage;

        if (isEditing && itemToEdit) {
            fillVirmanFormForEdit(itemToEdit, isCari, toggleContainer);
        }
    };
    const fillAcikHesapFormForEdit = (itemToEdit) => {
        if (!itemToEdit || itemToEdit.itemClass !== 'acik-hesap') return;

        // Ana tutar ve kur bilgilerini doldur
        const mainAmountInput = document.getElementById('form-acikhesap-amount');
        const mainRateInput = document.getElementById('form-acikhesap-rate');
        mainAmountInput.value = formatCurrency(itemToEdit.total);
        mainRateInput.value = formatCurrency(itemToEdit.miktarKuru, 4);

        // Toggle'ı doğru konuma getir
        const toggleContainer = document.getElementById('acikhesap-tipi-toggle');
        const activeType = itemToEdit.isIncome ? 'alacagina' : 'borcuna';
        toggleContainer.dataset.selected = activeType;

        // Toggle seçeneklerini güncelle
        const toggleOptions = toggleContainer.querySelectorAll('.tri-toggle-option');
        toggleOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.value === activeType);
        });
    };
    const fillVirmanFormForEdit = (itemToEdit, isCari, toggleContainer) => {
        console.log("fillVirmanFormForEdit çağrıldı.");
        const isSatisModu = !isCari;
        const editCurrency = allCurrencies.find(c => c.dovizKodu === itemToEdit.currency);
        const editCurrencySelect = document.getElementById('form-virman-currency');
        const amountInput = document.getElementById('form-virman-amount');
        const rateInput = document.getElementById('form-virman-rate');
        const karsiHesapSelect = document.getElementById('form-virman-karsi-hesap');
        const karsilikToggle = document.getElementById('virman-karsilik-toggle');
        const karsilikDetailsDiv = document.getElementById('virman-karsilik-details');
        const karsilikCurrencySelect = document.getElementById('form-virman-karsilik-currency');
        const karsilikAmountInput = document.getElementById('form-virman-karsilik-amount');
        const karsilikRateInput = document.getElementById('form-virman-karsilik-rate');
        const aciklamaTextarea = document.getElementById('form-virman-aciklama');

        // Ana para birimi ve tutarı ayarla
        if (editCurrencySelect && editCurrency) {
            editCurrencySelect.value = editCurrency.id;
            editCurrencySelect.closest('.float-label-container').classList.add('select-has-value');
            if (isSatisModu) { editCurrencySelect.disabled = true; }
        }
        if (amountInput) amountInput.value = formatCurrency(itemToEdit.total);
        if (rateInput) rateInput.value = formatCurrency(itemToEdit.miktarKuru, 4);

        // Karşı hesabı ayarla
        if (karsiHesapSelect && itemToEdit.details?.karsiHesapId) {
            karsiHesapSelect.value = itemToEdit.details.karsiHesapId;
            karsiHesapSelect.dispatchEvent(new Event('change'));
        }

        // Karşılık bilgilerini kontrol et
        const karsilikBirim = itemToEdit.details?.karsilikBirimi || itemToEdit.equivalentCurrency;
        const karsilikVar = karsilikBirim && karsilikBirim !== itemToEdit.currency;

        if (karsilikToggle) {
            karsilikToggle.checked = karsilikVar;
            // Toggle event'ini manuel tetikle
            karsilikDetailsDiv.classList.toggle('hidden', !karsilikVar);
        }

        // Karşılık detaylarını doldur (eğer varsa)
        if (karsilikVar) {
            // Öncelikle details'deki karşılık bilgilerini kontrol et, yoksa equivalent değerlerini kullan
            const karsilikDegeri = itemToEdit.details?.karsilikDegeri ?? itemToEdit.equivalentTotal;
            const karsilikKuru = itemToEdit.details?.karsilikKuru ?? itemToEdit.hesapKuru;
            const editKarsilikCurrency = allCurrencies.find(c => c.dovizKodu === karsilikBirim);

            if (karsilikCurrencySelect && editKarsilikCurrency) {
                karsilikCurrencySelect.value = editKarsilikCurrency.id;
                karsilikCurrencySelect.dispatchEvent(new Event('change'));
            }
            if (karsilikAmountInput) karsilikAmountInput.value = formatCurrency(karsilikDegeri);
            if (karsilikRateInput) karsilikRateInput.value = formatCurrency(karsilikKuru, 4);
        }

        // Açıklamayı ayarla
        if (aciklamaTextarea) aciklamaTextarea.value = itemToEdit.description || '';

        isFormDirty = false;
        console.log("Virman veri doldurma tamamlandı.");
    };
    const renderIskontoForm = (itemToEdit = null) => {
        // Sadece Satış modunda çalışır
        if (state.operationType !== 'satis') {
            showToast('İskonto işlemi sadece "Satış" modunda kullanılabilir.', 'warning');
            showDefaultMessage();
            if (window.switchMobileTab) window.switchMobileTab('fis');
            return;
        }

        const isEditing = itemToEdit !== null;
        const farkTutar = parseFormattedNumber(farkToplamSpan.textContent);

        // Düzenleme modu değilse ve fark 0 ise uyarı ver
        if (!isEditing && farkTutar === 0) {
            showToast(`İskonto için fark bulunamadı (0 ${state.activeCurrency})`, 'warning');
            showDefaultMessage();
            if (window.switchMobileTab) window.switchMobileTab('fis');
            return;
        }

        const title = 'İskonto İşlemi';
        const otomatikTutar = isEditing ? itemToEdit.total : Math.abs(farkTutar);
        const defaultActiveType = isEditing ?
            (itemToEdit.isIncome ? 'alacagina' : 'borcuna') :
            (farkTutar < 0 ? 'alacagina' : 'borcuna');

        const option1 = { label: 'HESABIN BORCUNA', value: 'borcuna' };
        const option2 = { label: 'HESABIN ALACAĞINA', value: 'alacagina' };

        const isCari = state.operationType === 'cari';
        const iskontoHesapId = isCari ? 55 : 54;
        const iskontoHesapAdi = isCari ? 'İSKONTO CARİDEN' : 'İSKONTO SATIŞTAN';

        const formHTML = `
            <h3 class="font-bold text-lg mb-4">${title}</h3>
            <div class="space-y-4">
                <div>
                    <div id="iskonto-tipi-toggle" class="tri-toggle-container" data-selected="${defaultActiveType}">
                        <div class="tri-toggle-slider" style="width: calc((100% - 6px) / 2);"></div>
                        <div class="tri-toggle-options">
                            <div class="tri-toggle-option" data-value="${option1.value}">${option1.label}</div>
                            <div class="tri-toggle-option" data-value="${option2.value}">${option2.label}</div>
                        </div>
                    </div>
                </div>

                <div id="iskonto-form-content">
                    <div class="grid grid-cols-12 gap-x-1 gap-y-1 items-end">
                        <div class="float-label-container col-span-2">
                            <select id="form-iskonto-currency" class="float-label-input float-label-select" disabled>
                                <option value="${state.activeCurrencyId}">${state.activeCurrency}</option>
                            </select>
                            <label for="form-iskonto-currency" class="float-label">Birim</label>
                        </div>
                        <div class="float-label-container col-span-7">
                            <input type="text" id="form-iskonto-amount" class="float-label-input text-right font-mono px-3" placeholder=" " value="${formatCurrency(otomatikTutar)}">
                            <label for="form-iskonto-amount" class="float-label">Miktar</label>
                        </div>
                        <div class="float-label-container col-span-3">
                            <input type="text" id="form-iskonto-rate" class="float-label-input text-right font-mono px-3" placeholder=" " value="1,0000">
                            <label for="form-iskonto-rate" class="float-label">Kur</label>
                        </div>
                    </div>
                </div>

                <div class="float-label-container">
                    <input type="text" id="form-iskonto-karsi-hesap" class="float-label-input" value="${iskontoHesapAdi}" readonly>
                    <label for="form-iskonto-karsi-hesap" class="float-label">Karşı Hesap</label>
                </div>

                <div id="iskonto-has-container">
                    <div class="grid grid-cols-12 gap-x-1 gap-y-1 items-end">
                        <div class="float-label-container col-span-2">
                            <select id="form-iskonto-equiv-currency" class="float-label-input float-label-select" disabled>
                                <option value="0">HAS</option>
                            </select>
                            <label for="form-iskonto-equiv-currency" class="float-label">Bilanço</label>
                        </div>
                        <div class="float-label-container col-span-7">
                            <input type="text" id="form-iskonto-equiv-amount" class="float-label-input text-right font-mono px-3" placeholder=" " value="0,00" readonly>
                            <label for="form-iskonto-equiv-amount" class="float-label">HAS Karşılığı</label>
                        </div>
                        <div class="float-label-container col-span-3">
                            <input type="text" id="form-iskonto-equiv-rate" class="float-label-input text-right font-mono px-3" placeholder=" " value="0,0000" readonly>
                            <label for="form-iskonto-equiv-rate" class="float-label">HAS Kuru</label>
                        </div>
                    </div>
                </div>

                <div class="float-label-container mt-4">
                    <textarea id="form-iskonto-aciklama" class="float-label-input" placeholder=" " rows="3"></textarea>
                    <label for="form-iskonto-aciklama" class="float-label">Açıklama</label>
                </div>
            </div>
        `;

        dynamicContentArea.innerHTML = formHTML;
        dynamicContentArea.dataset.activeTab = defaultActiveType;

        // Form elemanlarını seç
        const mainAmountInput = document.getElementById('form-iskonto-amount');
        const mainRateInput = document.getElementById('form-iskonto-rate');
        const hasAmountInput = document.getElementById('form-iskonto-equiv-amount');
        const hasRateInput = document.getElementById('form-iskonto-equiv-rate');
        const aciklamaTextarea = document.getElementById('form-iskonto-aciklama');
        const currencySelectEl = document.getElementById('form-iskonto-currency');

        // Panel rengini ayarla
        middlePanel.classList.remove('hat-green', 'hat-red');
        middlePanel.classList.add(defaultActiveType === 'alacagina' ? 'hat-green' : 'hat-red');

        // Toggle işlemleri
        const toggleContainer = document.getElementById('iskonto-tipi-toggle');
        const toggleOptions = toggleContainer.querySelectorAll('.tri-toggle-option');

        toggleOptions.forEach(option => {
            // Başlangıç durumu için renkleri ayarla
            if (option.dataset.value === defaultActiveType) {
                option.classList.add('active');
                option.style.color = defaultActiveType === 'alacagina' ? '#059669' : '#DC2626';
            } else {
                option.classList.remove('active');
                option.style.color = '';
            }

            option.addEventListener('click', () => {
                const selectedValue = option.dataset.value;
                toggleContainer.dataset.selected = selectedValue;
                dynamicContentArea.dataset.activeTab = selectedValue;

                // Tüm seçeneklerin rengini sıfırla ve active class'ı kaldır
                toggleOptions.forEach(opt => {
                    opt.classList.remove('active');
                    opt.style.color = '';
                });

                // Seçili seçeneği aktif yap ve rengini ayarla
                option.classList.add('active');
                option.style.color = selectedValue === 'alacagina' ? '#059669' : '#DC2626';

                // Panel rengini değiştir
                middlePanel.classList.remove('hat-green', 'hat-red');
                middlePanel.classList.add(selectedValue === 'alacagina' ? 'hat-green' : 'hat-red');

                isFormDirty = true;
            });
        });

        // HAS hesaplaması
        const calculateHasTotal = () => {
            const amount = parseFormattedNumber(mainAmountInput.value);
            const rate = parseFormattedNumber(mainRateInput.value);
            const hasKuru = parseFormattedNumber(hasRateInput.value);

            // Formül: HAS Karşılığı = (Tutar * Kur) / HAS_Kuru
            const hasAmount = (hasKuru > 0) ? ((amount * rate) / hasKuru) : 0;
            hasRateInput.value = formatCurrency(hasKuru, 4);
            hasAmountInput.value = formatCurrency(hasAmount, 2);
        };

        // Numeric input kontrolü
        if (typeof enforceNumericInput === 'function') {
            enforceNumericInput(mainAmountInput);
            enforceNumericInput(mainRateInput);

            // Kur inputları için 4 decimal
            mainRateInput.addEventListener('blur', (e) => {
                e.target.value = formatCurrency(parseFormattedNumber(e.target.value), 4);
                calculateHasTotal();
            });
        }

        // --- YENİ: İskonto için canlı kur getir ve HAS kuru al ---
        const updateIskontoRates = async () => {
            try {
                // 1) Ana iskonto kuru (seçili birim için)
                let currencyId = state.activeCurrencyId;
                // Eğer form select aktif ise ondan al
                try {
                    if (currencySelectEl && currencySelectEl.value) currencyId = currencySelectEl.value;
                } catch { /* ignore */ }

                let rate = null;
                if (currencyId) {
                    const live = await fetchLatestCure(currencyId).catch(() => null);
                    if (live !== null && !isNaN(live) && live > 0) rate = live;
                }

                // Fallback: allExchangeRates / allCurrencies
                if (rate === null) {
                    const currencyObj = allCurrencies.find(c => String(c.id) === String(currencyId));
                    if (currencyObj) {
                        rate = currencyObj.dovizKodu === nationalCurrency.dovizKodu ? 1.0 :
                            (allExchangeRates.find(r => r.dovizKodu === currencyObj.dovizKodu)?.alisKuru ?? allExchangeRates.find(r => r.dovizKodu === currencyObj.dovizKodu)?.satisKuru ?? currencyObj.alisKuru ?? currencyObj.satisKuru ?? 1);
                    } else {
                        rate = 1.0;
                    }
                }

                mainRateInput.value = formatCurrency(rate, 4);

                // 2) HAS kuru (bilanco için)
                const hasCur = allCurrencies.find(c => c.dovizKodu === 'HAS');
                const hasId = hasCur ? hasCur.id : (nationalCurrency ? nationalCurrency.id : 1);

                let hasRate = null;
                if (hasId) {
                    const liveHas = await fetchLatestCure(hasId).catch(() => null);
                    if (liveHas !== null && !isNaN(liveHas) && liveHas > 0) hasRate = liveHas;
                }

                if (hasRate === null) {
                    const hasRateEntry = allExchangeRates.find(r => r.dovizKodu === 'HAS');
                    hasRate = hasRateEntry ? (hasRateEntry.alisKuru ?? hasRateEntry.satisKuru ?? 1) : 1;
                }

                	hasRateInput.value = formatRate(hasRate)

                // 3) HAS karşılığını hesapla ve yaz
                calculateHasTotal();
            } catch (err) {
                console.warn('updateIskontoRates hata:', err);
            }
        };

        // Event wiring
        mainAmountInput.addEventListener('input', calculateHasTotal);

        // Eğer formdaki para birimi değişiyorsa (nadiren aktif), kuru güncelle
        if (currencySelectEl) {
            currencySelectEl.addEventListener('change', async () => {
                await updateIskontoRates();
                isFormDirty = true;
            });
        }

        // İlk yüklemede canlı kuru çek
        (async () => {
            await updateIskontoRates();
        })();

        // Düzenleme modu
        if (isEditing && itemToEdit) {
            fillIskontoFormForEdit(itemToEdit);
            addButton.innerHTML = '<i class="fas fa-sync-alt mr-1.5"></i>Güncelle';
            addButton.onclick = () => updateItemInReceipt('iskonto');
            deleteButton.classList.remove('hidden');
        } else {
            addButton.innerHTML = '<i class="fas fa-check mr-1.5"></i>Ekle';
            addButton.onclick = () => addItemToReceipt('iskonto');
            deleteButton.classList.add('hidden');
        }

        [addButton, cancelButton].forEach(btn => btn.classList.remove('hidden'));
        cancelButton.onclick = showDefaultMessage;
    };
    const fillIskontoFormForEdit = (itemToEdit, isCari, aciklamaTextarea) => {
        console.log("fillIskontoFormForEdit çağrıldı.");
        const isSatisModu = !isCari;
        const editCurrency = allCurrencies.find(c => c.dovizKodu === itemToEdit.currency);
        const editCurrencySelect = document.getElementById('form-iskonto-currency');
        const editAmountInput = document.getElementById('form-iskonto-amount');
        const editRateInput = document.getElementById('form-iskonto-rate');
        const editEquivAmountInput = document.getElementById('form-iskonto-equiv-amount');
        const editEquivRateInput = document.getElementById('form-iskonto-equiv-rate');

        // 1. Birimi Ayarla
        if (editCurrencySelect && editCurrency) {
            editCurrencySelect.value = editCurrency.id;
            editCurrencySelect.closest('.float-label-container').classList.add('select-has-value');
            if (isSatisModu) { editCurrencySelect.disabled = true; }
            console.log("Birim ayarlandı:", editCurrency.id);
        } else { console.error("Birim (select veya data) bulunamadı!"); }

        // 2. Miktarı Ayarla
        if (editAmountInput) {
            editAmountInput.value = formatCurrency(itemToEdit.total);
            console.log("Miktar ayarlandı:", editAmountInput.value);
        } else { console.error("Miktar input bulunamadı!"); }

        // 3. Miktar Kurunu Ayarla
        if (editRateInput) {
          editRateInput.value = formatRate(itemToEdit.miktarKuru);
            console.log("Miktar Kuru ayarlandı:", editRateInput.value);
        } else { console.error("Miktar Kuru input bulunamadı!"); }

        // 4. Bilanço (HAS) Miktarını Ayarla
        let bilancoDegeri = itemToEdit.details?.bilancoDegeri ?? itemToEdit.equivalentTotal;
        if (editEquivAmountInput) {
            editEquivAmountInput.value = formatCurrency(bilancoDegeri, 2);
            console.log("Bilanço Miktarı ayarlandı:", editEquivAmountInput.value);
        } else { console.error("Bilanço Miktarı input bulunamadı!"); }

        // 5. Bilanço (HAS) Kurunu Ayarla
        let bilancoKuru = itemToEdit.details?.bilancoKuru ?? itemToEdit.hesapKuru;
        if (editEquivRateInput) {
            editEquivRateInput.value = formatCurrency(bilancoKuru, 4);
            console.log("Bilanço Kuru ayarlandı:", editEquivRateInput.value);
        } else { console.error("Bilanço Kuru input bulunamadı!"); }

        // 6. YENİ: Açıklamayı Ayarla
        if (aciklamaTextarea) {
            // Açıklamayı itemToEdit'ten al, yoksa varsayılanı kullanma (boş bırak)
            const defaultAciklamaPlus = 'Hesabın Alacağına (+)';
            const defaultAciklamaMinus = 'Hesabın Borcuna (-)';
            aciklamaTextarea.value = (itemToEdit.description !== defaultAciklamaPlus && itemToEdit.description !== defaultAciklamaMinus) ? itemToEdit.description : '';
            console.log("Açıklama ayarlandı:", aciklamaTextarea.value);
        } else { console.error("Açıklama textarea bulunamadı!"); }


        isFormDirty = false;
        console.log("Veri doldurma tamamlandı (fillIskontoFormForEdit).");
    }
    const getIskontoItemDataFromForm = () => {
        const miktarInput = document.getElementById('form-iskonto-miktar');
        const amount = parseFormattedNumber(miktarInput.value);

        if (amount <= 0) {
            showToast('Lütfen geçerli bir iskonto tutarı girin.', 'warning');
            return null;
        }

        // ===== YENİ: Çalışma moduna göre doğru iskonto hesabını seç =====
        const isSatisModu = state.operationType === 'satis';
        const iskontoHesapId = isSatisModu ? 54 : 55;
        const defaultHesapAdi = isSatisModu ? 'SATIŞTAN İSKONTO' : 'CARİDEN İSKONTO';
        const iskontoHesap = allAccounts.find(a => a.hesapID == iskontoHesapId) || { hesapAdi: defaultHesapAdi, hesapID: iskontoHesapId };
        // =================================================================

        const isBorcuna = document.getElementById('iskonto-borcuna-tab').classList.contains('border-blue-600');
        const isIncome = isBorcuna;
        const description = isIncome ? 'Hesabın Borcuna İskonto' : 'Hesabın Alacağına İskonto';

        let currency = '';
        let currencyId = null;
        if (isSatisModu) {
            currency = state.activeCurrency;
            currencyId = state.activeCurrencyId;
        } else { // cari modu
            const currencySelect = document.getElementById('form-iskonto-currency');
            if (!currencySelect || !currencySelect.value) {
                showToast('Lütfen bir para birimi seçin.', 'warning');
                return null;
            }
            currencyId = currencySelect.value;
            currency = currencySelect.options[currencySelect.selectedIndex].text;
        }

        return {
            itemClass: 'iskonto',
            type: 'iskonto',
            total: amount,
            isIncome: isIncome,
            description: description,
            currency: currency,
            equivalentTotal: amount,
            equivalentCurrency: currency,
            equivalentCurrencyId: currencyId,
            miktarKuru: 1,
            hesapKuru: 1,
            details: {
                accountId: iskontoHesap.hesapID,
                accountName: iskontoHesap.hesapAdi
            }
        };
    };
    const initializeProductFormLogic = (formRoot, isGiris) => {
        const stokHiyerarsiInput = formRoot.querySelector('#stokHiyerarsi');
        const stokAramaInput = formRoot.querySelector('#stokArama');
        const stokKartiListesiDiv = formRoot.querySelector('#stokKartiListesi');
        const aramaKonteyneri = formRoot.querySelector('#aramaKonteyneri');
        const initialPrompt = formRoot.querySelector('#initial-prompt');
        const defaultLayout = formRoot.querySelector('#defaultLayout');
        const altinLayout = formRoot.querySelector('#altinLayout');
        const hurdaLayout = formRoot.querySelector('#hurdaLayout');
        const digerMiktarInput = formRoot.querySelector('#diger-miktar');
        const digerBirimFiyatInput = formRoot.querySelector('#diger-birim-fiyat');
        const digerToplamTutarInput = formRoot.querySelector('#diger-toplam-tutar');
        const digerTutarBirimiInput = formRoot.querySelector('#diger-tutar-birimi');
        const digerMiktarLabel = formRoot.querySelector('#diger-miktar-label');
        const digerBirimFiyatLabel = formRoot.querySelector('#diger-birim-fiyat-label');
        const altinMiktarInput = formRoot.querySelector('#altin-miktar');
        const altinMilyemInput = formRoot.querySelector('#altin-milyem');
        const altinHasInput = formRoot.querySelector('#altin-has');
        const iscilikDahilToggle = formRoot.querySelector('#iscilik-dahil-toggle');
        const iscilikDahilWrapper = iscilikDahilToggle.closest('.flex');
        const iscilikDahilDegerInput = formRoot.querySelector('#iscilik-dahil-deger');
        const altinBirimIscilikInput = formRoot.querySelector('#altin-birim-iscilik');
        const altinBirimInput = formRoot.querySelector('#altin-birim');
        const altinIscilikTutariInput = formRoot.querySelector('#altin-iscilik-tutari');
        const altinToplamHasInput = formRoot.querySelector('#altin-toplam-has');
        const altinAdetInput = formRoot.querySelector('#altin-adet');
        const gramBtn = formRoot.querySelector('#gram-btn');
        const adetBtn = formRoot.querySelector('#adet-btn');
        const gramAdetContainer = formRoot.querySelector('#gram-adet-container');

        // ===== YENİDEN EKLENDİ: Hataya neden olan eksik tanımlamalar =====
        const hurdaMiktarInput = formRoot.querySelector('#hurda-miktar');
        const hurdaMilyemInput = formRoot.querySelector('#hurda-milyem');
        const hurdaToplamHasInput = formRoot.querySelector('#hurda-toplam-has');
        // ===============================================================

        let selectedStok = null;
        let isAdetMode = false;
        const numericProductInputs = [
            digerMiktarInput,
            digerBirimFiyatInput,
            altinMiktarInput,
            altinBirimIscilikInput,
            altinAdetInput,
            iscilikDahilDegerInput,
            hurdaMiktarInput,
            hurdaMilyemInput
        ];
        numericProductInputs.forEach(enforceNumericInput);

        function calculateDefaultTotals() { const miktar = parseFormattedNumber(digerMiktarInput.value); const birimFiyat = parseFormattedNumber(digerBirimFiyatInput.value); digerToplamTutarInput.value = formatCurrency(miktar * birimFiyat, 2); }
        function calculateAltinTotals() { const miktar = parseFormattedNumber(altinMiktarInput.value); const milyem = parseFormattedNumber(altinMilyemInput.value); const birimIscilik = parseFormattedNumber(altinBirimIscilikInput.value); const has = miktar * milyem; let iscilikTutari = 0; if (isAdetMode) { const adet = parseInt(altinAdetInput.value) || 0; iscilikTutari = adet * birimIscilik; } else { iscilikTutari = miktar * birimIscilik; } const toplamHas = has + iscilikTutari; altinHasInput.value = formatCurrency(has, 2); altinIscilikTutariInput.value = formatCurrency(iscilikTutari, 2); altinToplamHasInput.value = formatCurrency(toplamHas, 2); }
        function calculateHurdaTotals() { const miktar = parseFormattedNumber(hurdaMiktarInput.value); const milyem = parseFormattedNumber(hurdaMilyemInput.value); const toplamHas = miktar * milyem; hurdaToplamHasInput.value = formatCurrency(toplamHas, 2); }
        function renderStokListesi(stoklar) { stokKartiListesiDiv.innerHTML = ''; stoklar.forEach(stok => { const item = document.createElement('div'); item.className = 'p-2 hover:bg-gray-100 cursor-pointer'; item.textContent = stok.stokAdi; item.dataset.id = stok.stokID; stokKartiListesiDiv.appendChild(item); }); }
        function resetProductForm() { selectedStok = null; stokAramaInput.value = ''; stokAramaInput.disabled = false; stokAramaInput.classList.remove('bg-gray-100'); stokHiyerarsiInput.value = ''; stokHiyerarsiInput.placeholder = 'Stok Kartı Seçiniz';[altinLayout, defaultLayout, hurdaLayout].forEach(l => l.classList.add('hidden', 'opacity-0')); initialPrompt.classList.remove('hidden', 'opacity-0');[digerMiktarInput, digerBirimFiyatInput, altinMiktarInput, hurdaMiktarInput].forEach(el => el.value = formatCurrency(0, 2));[altinBirimIscilikInput, hurdaMilyemInput].forEach(el => el.value = formatCurrency(0, 3)); altinAdetInput.value = '1'; digerTutarBirimiInput.value = ''; digerMiktarLabel.textContent = 'Miktar'; digerBirimFiyatLabel.textContent = 'Birim Fiyatı'; iscilikDahilToggle.checked = false; iscilikDahilToggle.disabled = false; iscilikDahilWrapper.classList.remove('opacity-50', 'cursor-not-allowed'); iscilikDahilDegerInput.classList.add('hidden'); altinBirimIscilikInput.readOnly = false; gramAdetContainer.style.opacity = '1'; gramAdetContainer.style.pointerEvents = 'auto'; setIscilikMode(false); calculateDefaultTotals(); calculateAltinTotals(); calculateHurdaTotals(); }

        function setIscilikMode(isAdet) {
            if (gramAdetContainer.style.pointerEvents === 'none') return;
            isAdetMode = isAdet;
            const currentValue = parseFormattedNumber(altinBirimIscilikInput.value);

            if (isAdet) { // Adet modu
                altinAdetInput.classList.remove('hidden');
                adetBtn.classList.add('toggle-btn-active');
                adetBtn.classList.remove('toggle-btn-inactive');
                gramBtn.classList.remove('toggle-btn-active');
                gramBtn.classList.add('toggle-btn-inactive');
                altinBirimIscilikInput.value = formatCurrency(currentValue, 2);

                if (iscilikDahilToggle.checked) {
                    iscilikDahilToggle.checked = false;
                    iscilikDahilToggle.dispatchEvent(new Event('change'));
                }
                iscilikDahilToggle.disabled = true;
                iscilikDahilWrapper.classList.add('opacity-50', 'cursor-not-allowed');

            } else { // Gram modu
                altinAdetInput.classList.add('hidden');
                gramBtn.classList.add('toggle-btn-active');
                gramBtn.classList.remove('toggle-btn-inactive');
                adetBtn.classList.remove('toggle-btn-active');
                adetBtn.classList.add('toggle-btn-inactive');
                altinBirimIscilikInput.value = formatCurrency(currentValue, 3);

                iscilikDahilToggle.disabled = false;
                iscilikDahilWrapper.classList.remove('opacity-50', 'cursor-not-allowed');
            }
            calculateAltinTotals();
        }

        function handleStokSelection(stokId) { selectedStok = allStoklar.find(s => s.stokID == stokId); if (!selectedStok) return; stokAramaInput.value = selectedStok.stokAdi; stokAramaInput.disabled = true; stokAramaInput.classList.add('bg-gray-100'); stokHiyerarsiInput.value = `${selectedStok.stokGrupAdi} / ${selectedStok.stokTipAdi}`; stokKartiListesiDiv.classList.add('hidden'); initialPrompt.classList.add('opacity-0'); setTimeout(() => initialPrompt.classList.add('hidden'), 300);[defaultLayout, altinLayout, hurdaLayout].forEach(l => l.classList.add('hidden', 'opacity-0')); if (selectedStok.stokGrupAdi === 'MADEN GRUBU' && (selectedStok.stokTipAdi === 'ALTIN' || selectedStok.stokTipAdi === 'SARRAFİYE')) { altinLayout.classList.remove('hidden'); setTimeout(() => altinLayout.classList.remove('opacity-0'), 50); iscilikDahilToggle.checked = false; iscilikDahilDegerInput.classList.add('hidden'); iscilikDahilDegerInput.value = formatCurrency(0, 3); altinBirimIscilikInput.readOnly = false; altinBirimIscilikInput.value = formatCurrency(0, 3); gramAdetContainer.style.opacity = '1'; gramAdetContainer.style.pointerEvents = 'auto'; setIscilikMode(false); altinMilyemInput.value = formatCurrency(selectedStok.milyem, 3); altinBirimInput.value = selectedStok.iscilikBirimiKodu || 'N/A'; calculateAltinTotals(); } else if (selectedStok.stokGrupAdi === 'HURDA GRUBU') { hurdaLayout.classList.remove('hidden'); setTimeout(() => hurdaLayout.classList.remove('opacity-0'), 50); hurdaMilyemInput.value = formatCurrency(selectedStok.milyem, 3); calculateHurdaTotals(); } else { defaultLayout.classList.remove('hidden'); setTimeout(() => defaultLayout.classList.remove('opacity-0'), 50); digerMiktarLabel.textContent = `Miktar (${selectedStok.birim || ''})`; digerBirimFiyatLabel.textContent = `Birim Fiyatı (${selectedStok.iscilikBirimiKodu || 'TRY'})`; digerTutarBirimiInput.value = selectedStok.iscilikBirimiKodu || 'TRY'; calculateDefaultTotals(); } }

        stokAramaInput.addEventListener('input', () => { const searchTerm = stokAramaInput.value.toLowerCase(); renderStokListesi(allStoklar.filter(stok => stok.stokAdi.toLowerCase().includes(searchTerm))); stokKartiListesiDiv.classList.remove('hidden'); });
        stokAramaInput.addEventListener('focus', () => { renderStokListesi(allStoklar); stokKartiListesiDiv.classList.remove('hidden'); });
        document.addEventListener('click', (e) => { if (!aramaKonteyneri.contains(e.target)) stokKartiListesiDiv.classList.add('hidden'); });
        stokKartiListesiDiv.addEventListener('click', (e) => { if (e.target.dataset.id) handleStokSelection(e.target.dataset.id); });
        gramBtn.addEventListener('click', () => setIscilikMode(false));
        adetBtn.addEventListener('click', () => setIscilikMode(true));
        iscilikDahilToggle.addEventListener('change', (event) => { const isChecked = event.target.checked; iscilikDahilDegerInput.classList.toggle('hidden', !isChecked); altinBirimIscilikInput.readOnly = isChecked; gramAdetContainer.style.opacity = isChecked ? '0.5' : '1'; gramAdetContainer.style.pointerEvents = isChecked ? 'none' : 'auto'; if (isChecked) { setIscilikMode(false); iscilikDahilDegerInput.value = formatCurrency(0, 3); } else { altinBirimIscilikInput.value = formatCurrency(0, 3); } calculateAltinTotals(); });

        if (iscilikDahilWrapper) {
            iscilikDahilWrapper.addEventListener('click', (event) => {
                if (iscilikDahilToggle.disabled) {
                    event.preventDefault();
                    showToast('Adet işçilikte "İşçilik Dahil" özelliğini kullanamazsınız.', 'warning');
                }
            });
        }

        iscilikDahilDegerInput.addEventListener('blur', (event) => { const input = event.target; let value = input.value; if (!value) return; let number = 0; if (!value.includes(',') && !value.includes('.')) { number = parseInt(value, 10); if (!isNaN(number) && number > 0) number /= 1000.0; } else { number = parseFormattedNumber(value); } input.value = formatCurrency(number, 3); const milyem = parseFormattedNumber(altinMilyemInput.value); const birimIscilik = number - milyem; altinBirimIscilikInput.value = formatCurrency(Math.max(0, birimIscilik), 3); calculateAltinTotals(); });
        [digerMiktarInput, digerBirimFiyatInput].forEach(el => el.addEventListener('input', calculateDefaultTotals));
        [altinMiktarInput, altinBirimIscilikInput, altinAdetInput].forEach(el => el.addEventListener('input', calculateAltinTotals));
        [hurdaMiktarInput, hurdaMilyemInput].forEach(el => el.addEventListener('input', calculateHurdaTotals));
        altinBirimIscilikInput.addEventListener('blur', (event) => { const input = event.target; let value = input.value; if (!value) return; if (isAdetMode) { input.value = formatCurrency(parseFormattedNumber(value), 2); } else { if (!value.includes(',') && !value.includes('.')) { let number = parseInt(value, 10); if (!isNaN(number)) { input.value = formatCurrency(number / 1000.0, 3); } } else { input.value = formatCurrency(parseFormattedNumber(value), 3); } } calculateAltinTotals(); });
        hurdaMilyemInput.addEventListener('blur', (event) => { const input = event.target; let value = input.value; if (!value) return; if (!value.includes(',') && !value.includes('.')) { let number = parseInt(value, 10); if (!isNaN(number) && number > 0) input.value = formatCurrency(number / 1000.0, 3); } else { input.value = formatCurrency(parseFormattedNumber(value), 3); } calculateHurdaTotals(); });
        return {
            selectedStok: () => selectedStok,
            getValues: () => { if (!selectedStok) return null; const visibleLayout = [defaultLayout, altinLayout, hurdaLayout].find(l => !l.classList.contains('hidden')); const descriptionInput = visibleLayout ? visibleLayout.querySelector('.product-description-input') : null; const description = descriptionInput ? descriptionInput.value.trim() : ''; if (selectedStok.stokGrupAdi === 'MADEN GRUBU' && (selectedStok.stokTipAdi === 'ALTIN' || selectedStok.stokTipAdi === 'SARRAFİYE')) { return { stok: selectedStok, miktar: parseFormattedNumber(altinMiktarInput.value), milyem: parseFormattedNumber(altinMilyemInput.value), birim: selectedStok.birim, toplamHas: parseFormattedNumber(altinToplamHasInput.value), currency: 'HAS', type: 'altin', birimIscilik: parseFormattedNumber(altinBirimIscilikInput.value), iscilikTipi: isAdetMode ? 'Adet' : 'Gram', toplamIscilik: parseFormattedNumber(altinIscilikTutariInput.value), iscilikBirimi: altinBirimInput.value, adet: isAdetMode ? (parseInt(altinAdetInput.value) || 0) : 0, iscilikDahil: iscilikDahilToggle.checked, description: description }; } else if (selectedStok.stokGrupAdi === 'HURDA GRUBU') { return { stok: selectedStok, miktar: parseFormattedNumber(hurdaMiktarInput.value), birim: 'GR', toplamHas: parseFormattedNumber(hurdaToplamHasInput.value), currency: 'HAS', type: 'hurda', milyem: parseFormattedNumber(hurdaMilyemInput.value), birimIscilik: 0, iscilikTipi: 'Gram', toplamIscilik: 0, iscilikBirimi: 'HAS', adet: null, iscilikDahil: false, description: description }; } else { return { stok: selectedStok, miktar: parseFormattedNumber(digerMiktarInput.value), birim: selectedStok.birim, toplamTutar: parseFormattedNumber(digerToplamTutarInput.value), currency: digerTutarBirimiInput.value, type: 'diger', description: description }; } },
            setValues: (details) => { if (!details || !details.stokId) return; handleStokSelection(details.stokId); const visibleLayout = [defaultLayout, altinLayout, hurdaLayout].find(l => !l.classList.contains('hidden')); if (visibleLayout) { const descriptionInput = visibleLayout.querySelector('.product-description-input'); if (descriptionInput) descriptionInput.value = details.description || ''; } if (altinLayout.classList.contains('hidden') === false) { altinMiktarInput.value = formatCurrency(details.miktar); const isAdet = details.iscilikTipi === 'Adet'; if (isAdet) { altinAdetInput.value = details.adet || 1; } setIscilikMode(isAdet); altinBirimIscilikInput.value = formatCurrency(details.birimIscilik, isAdet ? 2 : 3); iscilikDahilToggle.checked = details.iscilikDahil; iscilikDahilToggle.dispatchEvent(new Event('change')); calculateAltinTotals(); } else if (hurdaLayout.classList.contains('hidden') === false) { hurdaMiktarInput.value = formatCurrency(details.miktar); hurdaMilyemInput.value = formatCurrency(details.milyem, 3); calculateHurdaTotals(); } },
            reset: resetProductForm
        };
    };
    const updateProductInReceipt = (productForm) => {
        const values = productForm.getValues();
        if (!values) {
            showToast('Lütfen bir stok kartı seçip bilgileri doldurun.', 'warning');
            return;
        }
        if (values.miktar <= 0) {
            showToast('Lütfen geçerli bir miktar girin.', 'warning');
            return;
        }

        const originalItem = state.receiptItems[state.selectedItemIndex];

        const updatedItem = {
            ...originalItem,
            total: values.toplamHas || values.toplamTutar,
            equivalentTotal: values.toplamHas || values.toplamTutar,
            description: values.description || values.stok.stokAdi,
            currency: values.currency,
            equivalentCurrency: values.currency,
            details: {
                ...values
            }
        };

        state.receiptItems[state.selectedItemIndex] = updatedItem;
        renderReceipt();
        showDefaultMessage();
        if (window.switchMobileTab) window.switchMobileTab('fis');
    };
    const handleProductPanelChange = (isGiris, itemToEdit = null) => {
        updateHeaderLockState(true);
        isFormDirty = false;
        middlePanel.classList.remove('hat-green', 'hat-red');
        middlePanel.classList.add(isGiris ? 'hat-green' : 'hat-red');

        const productFormTemplate = document.getElementById('product-form-template');
        const clone = productFormTemplate.content.cloneNode(true);
        dynamicContentArea.innerHTML = '';
        dynamicContentArea.appendChild(clone);

        const productForm = initializeProductFormLogic(dynamicContentArea, isGiris);
        productForm.reset();

        const isEditing = itemToEdit !== null;

        if (isEditing) {
            dynamicContentArea.querySelector('#product-form-title').textContent = isGiris ? 'Ürün Giriş Düzenle' : 'Ürün Çıkış Düzenle';
            productForm.setValues(itemToEdit.details);

            addButton.innerHTML = '<i class="fas fa-sync-alt mr-1.5"></i>Güncelle';
            addButton.onclick = () => updateProductInReceipt(productForm);

            // ===== YENİ KONTROL BURADA =====
            // Sadece fişte birden fazla kalem varsa "Sil" butonunu göster.
            if (state.receiptItems.length > 1) {
                deleteButton.classList.remove('hidden');
            } else {
                deleteButton.classList.add('hidden');
            }
        } else {
            dynamicContentArea.querySelector('#product-form-title').textContent = isGiris ? 'Ürün Giriş' : 'Ürün Çıkış';
            addButton.innerHTML = '<i class="fas fa-check mr-1.5"></i>Ekle';
            addButton.onclick = () => {
                const values = productForm.getValues();
                if (!values) { showToast('Lütfen bir stok kartı seçip bilgileri doldurun.', 'warning'); return; }
                if (values.miktar <= 0) { showToast('Lütfen geçerli bir miktar girin.', 'warning'); return; }

                const newItem = {
                    itemClass: 'product',
                    type: isGiris ? 'urun-giris' : 'urun-cikis',
                    total: values.toplamHas || values.toplamTutar,
                    equivalentTotal: values.toplamHas || values.toplamTutar,
                    isIncome: isGiris,
                    description: values.description || values.stok.stokAdi,
                    currency: values.currency,
                    equivalentCurrency: values.currency,
                    details: { ...values }
                };
                state.receiptItems.push(newItem);
                renderReceipt();
                showDefaultMessage();
                if (window.switchMobileTab) window.switchMobileTab('fis');
            };
            deleteButton.classList.add('hidden');
        }

        [addButton, cancelButton].forEach(btn => btn.classList.remove('hidden'));
        cancelButton.onclick = showDefaultMessage;
    };
    const addItemToReceipt = (type, isIncomeParam) => {
        if (type === 'acik-hesap') {
            // Form değerlerini al
            const activeTab = dynamicContentArea.dataset.activeTab;
            const isIncome = activeTab === 'alacagina';
            const mainAmount = parseFormattedNumber(document.getElementById('form-acikhesap-amount').value);
            const mainRate = parseFormattedNumber(document.getElementById('form-acikhesap-rate').value);

            // Zorunlu alan kontrolü
            if (mainAmount <= 0) {
                showToast('Lütfen geçerli bir miktar girin.', 'warning');
                return;
            }

            // Yeni açık hesap kaydı oluştur
            const newItem = {
                itemClass: 'acik-hesap',
                type: 'acik-hesap',
                total: mainAmount,
                isIncome: isIncome,
                description: isIncome ? 'Hesabın Alacağına' : 'Hesabın Borcuna',
                currency: state.activeCurrency,
                miktarKuru: mainRate,
                equivalentCurrency: state.activeCurrency,
                equivalentCurrencyId: state.activeCurrencyId,
                equivalentTotal: mainAmount,
                hesapKuru: mainRate
            };

            // Listeye ekle
            state.receiptItems.push(newItem);
            renderReceipt();
            showDefaultMessage();
            if (window.switchMobileTab) window.switchMobileTab('fis');
            return;
        }



        if (type === 'iskonto') {
            // --- İSKONTO EKLEME MANTIĞI ---
            const activeTab = dynamicContentArea.dataset.activeTab;
            const isAlacagina = activeTab === 'alacagina';
            const isIncome = isAlacagina;

            const miktarInput = document.getElementById('form-iskonto-amount');
            const amount = parseFormattedNumber(miktarInput.value);
            if (amount <= 0) return showToast('Lütfen geçerli bir iskonto tutarı girin.', 'warning');

            const currencySelect = document.getElementById('form-iskonto-currency');
            const currencyId = currencySelect.value;
            const currencyCode = currencySelect.options[currencySelect.selectedIndex].text;
            if (!currencyId) return showToast('Lütfen bir para birimi seçin.', 'warning');

            const rate = parseFormattedNumber(document.getElementById('form-iskonto-rate').value);

            const equivalentAmount_HAS = parseFormattedNumber(document.getElementById('form-iskonto-equiv-amount').value);
            const bilanchoCurrency = allCurrencies.find(c => c.dovizKodu === 'HAS') || nationalCurrency;
            const hasKuru = parseFormattedNumber(document.getElementById('form-iskonto-equiv-rate').value);

            const isCari = state.operationType === 'cari';
            const iskontoHesapId = isCari ? 55 : 54;
            const iskontoHesapAdi = isCari ? 'İSKONTO CARİDEN' : 'İSKONTO SATIŞTAN';
            const iskontoHesap = allAccounts.find(a => a.hesapID == iskontoHesapId) || { hesapAdi: iskontoHesapAdi, hesapID: iskontoHesapId };

            const userDescription = document.getElementById('form-iskonto-aciklama')?.value.trim() || '';
            const defaultDescription = isIncome ? 'Hesabın Alacağına (+)' : 'Hesabın Borcuna (-)';

            const newItem = {
                itemClass: 'iskonto', type: 'iskonto', total: amount, isIncome: isIncome,
                description: userDescription || defaultDescription, currency: currencyCode, miktarKuru: rate,
                details: {
                    accountId: iskontoHesap.hesapID, accountName: iskontoHesap.hesapAdi,
                    bilancoDegeri: equivalentAmount_HAS, bilancoBirimi: bilanchoCurrency.dovizKodu, bilancoKuru: hasKuru
                }
            };

            if (isCari) {
                newItem.equivalentTotal = equivalentAmount_HAS; newItem.hesapKuru = hasKuru;
                newItem.equivalentCurrency = bilanchoCurrency.dovizKodu; newItem.equivalentCurrencyId = bilanchoCurrency.id;
            } else {
                newItem.equivalentTotal = amount * rate; newItem.hesapKuru = rate;
                newItem.equivalentCurrency = state.activeCurrency; newItem.equivalentCurrencyId = state.activeCurrencyId;
            }

            state.receiptItems.push(newItem);
            renderReceipt();
            showDefaultMessage();
            if (window.switchMobileTab) window.switchMobileTab('fis');
            return;
        }

        // === VİRMAN EKLEME MANTIĞI (SATIS Modu Toplam Düzeltmesi ile) ===
        if (type === 'virman') {
            const activeTab = dynamicContentArea.dataset.activeTab;
            const isCari = state.operationType === 'cari';

            // ✅ DÜZELTİLDİ: CARİ modda 'cikis' = ALACAĞINA (+) = GİRİŞ
            const isIncome = isCari ? (activeTab === 'cikis') : (activeTab === 'alacagina');

            console.log("=== VİRMAN KAYIT DEBUG ===");
            console.log("Mod:", isCari ? "CARİ" : "SATIŞ");
            console.log("activeTab:", activeTab);
            console.log("isIncome:", isIncome, isIncome ? "(GİRİŞ - 14)" : "(ÇIKIŞ - 15)");

            const amountInput = document.getElementById('form-virman-amount');
            const amount = parseFormattedNumber(amountInput.value);
            if (amount <= 0) return showToast('Lütfen geçerli bir tutar girin.', 'warning');

            const currencySelect = document.getElementById('form-virman-currency');
            const currencyId = currencySelect.value;
            const currencyCode = currencySelect.options[currencySelect.selectedIndex].text;
            if (!currencyId) return showToast('Lütfen ana işlem için bir para birimi seçin.', 'warning');

            const rateInput = document.getElementById('form-virman-rate');
            const rate = parseFormattedNumber(rateInput.value);

            const karsiHesapSelect = document.getElementById('form-virman-karsi-hesap');
            const karsiHesapId = karsiHesapSelect.value;
            const karsiHesapAdi = karsiHesapSelect.options[karsiHesapSelect.selectedIndex]?.text;
            if (!karsiHesapId) return showToast('Lütfen bir Karşı Hesap seçin.', 'warning');

            const userDescription = document.getElementById('form-virman-aciklama')?.value.trim() || (isIncome ? 'Virman Girişi' : 'Virman Çıkışı');

            const newItem = {
                itemClass: 'virman', type: 'virman', total: amount, isIncome: isIncome,
                description: userDescription, currency: currencyCode, miktarKuru: rate,
                details: {
                    karsiHesapId: parseInt(karsiHesapId, 10),
                    karsiHesapAdi: karsiHesapAdi
                }
            };

            const karsilikToggle = document.getElementById('virman-karsilik-toggle');
            const karsilikAktif = karsilikToggle && karsilikToggle.checked;

            // declare here so available outside inner block
            let karsilikCurrencySelect = null;
            let karsilikAmountInput = null;
            let karsilikRateInput = null;

            let karsilikDegeri = amount;
            let karsilikBirimi = currencyCode;
            let karsilikKuru = rate;

            if (karsilikAktif) {
                karsilikCurrencySelect = document.getElementById('form-virman-karsilik-currency');
                const karsilikCurrencyId = karsilikCurrencySelect ? karsilikCurrencySelect.value : '';
                const karsilikCurrencyCode = karsilikCurrencySelect ? (karsilikCurrencySelect.options[karsilikCurrencySelect.selectedIndex]?.text) : '';
                if (!karsilikCurrencyId) return showToast('Lütfen "Karşılık" için bir para birimi seçin.', 'warning');

                karsilikAmountInput = document.getElementById('form-virman-karsilik-amount');
                const karsilikAmount = parseFormattedNumber(karsilikAmountInput.value);
                if (karsilikAmount <= 0) return showToast('"Karşılık Tutarı" sıfırdan büyük olmalıdır.', 'warning');

                karsilikRateInput = document.getElementById('form-virman-karsilik-rate');
                const karsilikRate = parseFormattedNumber(karsilikRateInput.value);

                karsilikDegeri = karsilikAmount;
                karsilikBirimi = karsilikCurrencyCode || karsilikBirimi;
                karsilikKuru = karsilikRate;

                newItem.details.karsilikDegeri = karsilikDegeri;
                newItem.details.karsilikBirimi = karsilikBirimi;
                newItem.details.karsilikKuru = karsilikKuru;
            }

            if (isCari) {
                newItem.equivalentTotal = karsilikDegeri;
                newItem.equivalentCurrency = karsilikBirimi;
                newItem.equivalentCurrencyId = (karsilikAktif && karsilikCurrencySelect) ? karsilikCurrencySelect.value : currencyId;
                newItem.hesapKuru = karsilikKuru;
            } else {
                newItem.equivalentTotal = amount * rate;
                newItem.equivalentCurrency = state.activeCurrency;
                newItem.equivalentCurrencyId = state.activeCurrencyId;
                newItem.hesapKuru = rate;
            }

            state.receiptItems.push(newItem);
            console.log("✅ Virman eklendi:", newItem);
            renderReceipt();
            showDefaultMessage();
            if (window.switchMobileTab) window.switchMobileTab('fis');
            return;
        }


        if (type === 'acik-hesap') { /* ... */ return; }
        if (type === 'ceviri') { /* ... */ return; }

        // itemClass'ı belirle
        const itemClass = type.startsWith('urun') ? 'product' : 'cash';

        if (itemClass === 'product') {
            // ... (Ürün ekleme kodu) ...
            state.receiptItems.push(newItem);

        } else if (itemClass === 'cash') {
            addCashItemToReceipt(type, isIncomeParam);
            return;
        }

        renderReceipt();
        showDefaultMessage();
        if (window.switchMobileTab) window.switchMobileTab('fis');
    };
    const updateItemInReceipt = async (type, isIncomeParam) => {
        // Güncelleme fonksiyonu — tek yerde replace yapıp direkt kopyala/yapıştır kullanabilirsiniz.
        // İmza esnek: ikinci parametre opsiyonel (nakit için isIncome geçiriliyor), diğer çağrılar da çalışır.

        // ACİL DURUMLAR: acik-hesap, iskonto, virman için özel mantık
        if (type === 'acik-hesap') {
            console.log("Açık hesap güncelleme başladı");
            const activeTab = dynamicContentArea.dataset.activeTab;
            const isIncome = activeTab === 'alacagina';
            const mainAmount = parseFormattedNumber(document.getElementById('form-acikhesap-amount').value);
            const mainRate = parseFormattedNumber(document.getElementById('form-acikhesap-rate').value);

            if (mainAmount <= 0) { showToast('Lütfen geçerli bir miktar girin.', 'warning'); return; }

            const originalItem = state.receiptItems[state.selectedItemIndex];
            if (!originalItem) { showToast('Güncellenecek kayıt bulunamadı!', 'error'); return; }

            const updatedItem = {
                ...originalItem,
                total: mainAmount,
                isIncome: isIncome,
                description: isIncome ? 'Hesabın Alacağına' : 'Hesabın Borcuna',
                currency: state.activeCurrency,
                miktarKuru: mainRate,
                equivalentCurrency: state.activeCurrency,
                equivalentCurrencyId: state.activeCurrencyId,
                equivalentTotal: mainAmount,
                hesapKuru: mainRate
            };

            state.receiptItems[state.selectedItemIndex] = updatedItem;
            renderReceipt(); showDefaultMessage(); if (window.switchMobileTab) window.switchMobileTab('fis');
            return;
        }

        if (type === 'iskonto') {
            const activeTab = dynamicContentArea.dataset.activeTab;
            const isIncome = activeTab === 'alacagina';
            const amount = parseFormattedNumber(document.getElementById('form-iskonto-amount').value);
            if (amount <= 0) return showToast('Lütfen geçerli bir iskonto tutarı girin.', 'warning');

            const currencySelect = document.getElementById('form-iskonto-currency');
            const currencyId = currencySelect ? currencySelect.value : null;
            const currencyCode = currencySelect ? currencySelect.options[currencySelect.selectedIndex].text : state.activeCurrency;
            const rate = parseFormattedNumber(document.getElementById('form-iskonto-rate').value);

            const equivalentAmount_HAS = parseFormattedNumber(document.getElementById('form-iskonto-equiv-amount').value);
            const bilanchoCurrency = allCurrencies.find(c => c.dovizKodu === 'HAS') || nationalCurrency;
            const hasKuru = parseFormattedNumber(document.getElementById('form-iskonto-equiv-rate').value);

            const isCari = state.operationType === 'cari';
            const iskontoHesapId = isCari ? 55 : 54;
            const iskontoHesapAdi = isCari ? 'İSKONTO CARİDEN' : 'İSKONTO SATIŞTAN';
            const iskontoHesap = allAccounts.find(a => a.hesapID == iskontoHesapId) || { hesapAdi: iskontoHesapAdi, hesapID: iskontoHesapId };

            const userDescription = document.getElementById('form-iskonto-aciklama')?.value.trim() || '';
            const defaultDescription = isIncome ? 'Hesabın Alacağına (+)' : 'Hesabın Borcuna (-)';

            const updatedItemData = {
                itemClass: 'iskonto',
                type: 'iskonto',
                total: amount,
                isIncome: isIncome,
                description: userDescription || defaultDescription,
                currency: currencyCode,
                miktarKuru: rate,
                details: {
                    accountId: iskontoHesap.hesapID,
                    accountName: iskontoHesap.hesapAdi,
                    bilancoDegeri: equivalentAmount_HAS,
                    bilancoBirimi: bilanchoCurrency.dovizKodu,
                    bilancoKuru: hasKuru
                }
            };

            if (isCari) {
                updatedItemData.equivalentTotal = equivalentAmount_HAS;
                updatedItemData.hesapKuru = hasKuru;
                updatedItemData.equivalentCurrency = bilanchoCurrency.dovizKodu;
                updatedItemData.equivalentCurrencyId = bilanchoCurrency.id;
            } else {
                updatedItemData.equivalentTotal = amount * rate;
                updatedItemData.hesapKuru = rate;
                updatedItemData.equivalentCurrency = state.activeCurrency;
                updatedItemData.equivalentCurrencyId = state.activeCurrencyId;
            }

            const originalItem = state.receiptItems[state.selectedItemIndex];
            state.receiptItems[state.selectedItemIndex] = { ...originalItem, ...updatedItemData };
            renderReceipt(); showDefaultMessage(); if (window.switchMobileTab) window.switchMobileTab('fis');
            return;
        }

        if (type === 'virman') {
            const activeTab = dynamicContentArea.dataset.activeTab;
            const isCari = state.operationType === 'cari';
            // cari modunda toggle isimlendirmeleri farklı olabilir; burada üstteki render ile uyumlu çözüm kullanıldı
            const isIncome = (typeof isIncomeParam === 'boolean') ? isIncomeParam : (isCari ? (activeTab === 'cikis') : (activeTab === 'alacagina'));

            const amount = parseFormattedNumber(document.getElementById('form-virman-amount').value);
            if (amount <= 0) return showToast('Lütfen geçerli bir tutar girin.', 'warning');

            const currencySelect = document.getElementById('form-virman-currency');
            const currencyId = currencySelect ? currencySelect.value : null;
            const currencyCode = currencySelect ? currencySelect.options[currencySelect.selectedIndex].text : state.activeCurrency;
            if (!currencyId && state.operationType === 'cari') return showToast('Lütfen ana işlem için bir para birimi seçin.', 'warning');

            const rate = parseFormattedNumber(document.getElementById('form-virman-rate').value);
            const karsiHesapSelect = document.getElementById('form-virman-karsi-hesap');
            const karsiHesapId = karsiHesapSelect ? karsiHesapSelect.value : null;
            const karsiHesapAdi = karsiHesapSelect ? karsiHesapSelect.options[karsiHesapSelect.selectedIndex]?.text : '';
            if (!karsiHesapId) return showToast('Lütfen bir Karşı Hesap seçin.', 'warning');

            const userDescription = document.getElementById('form-virman-aciklama')?.value.trim() || (isIncome ? 'Virman Girişi' : 'Virman Çıkışı');

            const updatedItemData = {
                itemClass: 'virman',
                type: 'virman',
                total: amount,
                isIncome: isIncome,
                description: userDescription,
                currency: currencyCode,
                miktarKuru: rate,
                details: {
                    karsiHesapId: parseInt(karsiHesapId, 10),
                    karsiHesapAdi: karsiHesapAdi
                }
            };

            const karsilikToggle = document.getElementById('virman-karsilik-toggle');
            const karsilikAktif = karsilikToggle && karsilikToggle.checked;

            let karsilikDegeri = amount;
            let karsilikBirimi = currencyCode;
            let karsilikKuru = rate;

            if (karsilikAktif) {
                const karsilikCurrencySelect = document.getElementById('form-virman-karsilik-currency');
                const karsilikCurrencyId = karsilikCurrencySelect ? karsilikCurrencySelect.value : null;
                const karsilikCurrencyCode = karsilikCurrencySelect ? karsilikCurrencySelect.options[karsilikCurrencySelect.selectedIndex]?.text : '';
                if (!karsilikCurrencyId) return showToast('Lütfen "Karşılık" için bir para birimi seçin.', 'warning');

                const karsilikAmount = parseFormattedNumber(document.getElementById('form-virman-karsilik-amount').value);
                if (karsilikAmount <= 0) return showToast('"Karşılık Tutarı" sıfırdan büyük olmalıdır.', 'warning');

                const karsilikRate = parseFormattedNumber(document.getElementById('form-virman-karsilik-rate').value);
                karsilikDegeri = karsilikAmount;
                karsilikBirimi = karsilikCurrencyCode || karsilikBirimi;
                karsilikKuru = karsilikRate;

                updatedItemData.details.karsilikDegeri = karsilikDegeri;
                updatedItemData.details.karsilikBirimi = karsilikBirimi;
                updatedItemData.details.karsilikKuru = karsilikKuru;
            }

            if (isCari) {
                updatedItemData.equivalentTotal = karsilikDegeri;
                updatedItemData.equivalentCurrency = karsilikBirimi;
                updatedItemData.equivalentCurrencyId = (karsilikAktif && document.getElementById('form-virman-karsilik-currency')) ? document.getElementById('form-virman-karsilik-currency').value : currencyId;
                updatedItemData.hesapKuru = karsilikKuru;
            } else {
                updatedItemData.equivalentTotal = amount * rate;
                updatedItemData.equivalentCurrency = state.activeCurrency;
                updatedItemData.equivalentCurrencyId = state.activeCurrencyId;
                updatedItemData.hesapKuru = rate;
            }

            const originalItem = state.receiptItems[state.selectedItemIndex];
            state.receiptItems[state.selectedItemIndex] = { ...originalItem, ...updatedItemData };
            renderReceipt(); showDefaultMessage(); if (window.switchMobileTab) window.switchMobileTab('fis');
            return;
        }

        // Aşağısı: nakit / cash kalemlerinin genel güncellemesi
        const amount = parseFormattedNumber(document.getElementById('form-amount').value);
        if (amount <= 0) return showToast('Lütfen geçerli bir tutar girin.', 'warning');

        const accountId = document.getElementById('form-account-name').value;
        const account = allFinancialAccounts.find(a => a.hesapID == accountId);
        if (!account) return showToast('Lütfen geçerli bir hesap seçin.', 'warning');

        const userDescription = document.getElementById('form-description').value;
        const currencyId = document.getElementById('form-currency-tutar').value;
        const currency = allCurrencies.find(c => c.id == currencyId)?.dovizKodu;
        if (!currency) return showToast('Lütfen geçerli bir para birimi seçin.', 'warning');

        const originalItem = state.receiptItems[state.selectedItemIndex];
        const updatedItem = {
            ...originalItem,
            total: amount,
            description: userDescription || originalItem.description,
            currency: currency,
            details: {
                accountId: account.hesapID,
                accountName: account.hesapAdi
            }
        };

        if (state.operationType === 'cari') {
            const karsilikToggle = document.getElementById('karsilik-toggle');
            const karsilikAktif = karsilikToggle && karsilikToggle.checked;

            if (karsilikAktif) {
                const equivalentCurrencySelect = document.getElementById('form-currency-equivalent');
                if (!equivalentCurrencySelect.value) return showToast('Lütfen hesaba geçecek birimin türünü seçin.', 'warning');

                updatedItem.equivalentTotal = parseFormattedNumber(document.getElementById('form-amount-equivalent').value);
                const miktarRate = parseFormattedNumber(document.getElementById('form-exchange-rate-miktar').value);
                const hesapRate = parseFormattedNumber(document.getElementById('form-exchange-rate-hesap').value);
                updatedItem.exchangeRate = hesapRate > 0 ? (miktarRate / hesapRate) : 0;
                updatedItem.miktarKuru = miktarRate;
                updatedItem.hesapKuru = hesapRate;
                updatedItem.equivalentCurrencyId = equivalentCurrencySelect.value;
                updatedItem.equivalentCurrency = allCurrencies.find(c => c.id == updatedItem.equivalentCurrencyId)?.dovizKodu;
            } else {
                // Yeni mantık: (Tutar * KaynakKur) / HedefKur
                try {
                    const miktarRate = parseFormattedNumber(document.getElementById('form-exchange-rate-miktar').value);
                    const equivalentCurrencySelect = document.getElementById('form-currency-equivalent');
                    const targetCurrencyId = equivalentCurrencySelect && equivalentCurrencySelect.value ? equivalentCurrencySelect.value : (nationalCurrency ? nationalCurrency.id : null);

                    // Öncelik: formdaki dataset/visible değerleri, sonra sunucudan GetLastCure
                    const sourceRateLive = await fetchLatestCure(currencyId);
                    const targetRateLive = targetCurrencyId ? await fetchLatestCure(targetCurrencyId) : (nationalCurrency ? await fetchLatestCure(nationalCurrency.id) : null);

                    const safeSource = (typeof sourceRateLive === 'number' && sourceRateLive > 0) ? sourceRateLive : (miktarRate || 1);
                    const safeTarget = (typeof targetRateLive === 'number' && targetRateLive > 0) ? targetRateLive : 1;

                    updatedItem.equivalentTotal = (amount * safeSource) / safeTarget;
                    const targetCurrencyObj = allCurrencies.find(c => String(c.id) === String(targetCurrencyId)) || allCurrencies.find(c => c.dovizKodu === (nationalCurrency && nationalCurrency.dovizKodu));
                    updatedItem.equivalentCurrency = targetCurrencyObj ? targetCurrencyObj.dovizKodu : (nationalCurrency ? nationalCurrency.dovizKodu : currency);
                    updatedItem.equivalentCurrencyId = targetCurrencyObj ? targetCurrencyObj.id : currencyId;
                    updatedItem.miktarKuru = safeSource;
                    updatedItem.hesapKuru = safeTarget;

                    // UI'ya yaz
                    const amountEquivalentInput = document.getElementById('form-amount-equivalent');
                    if (amountEquivalentInput) amountEquivalentInput.value = formatCurrency(parseFloat(updatedItem.equivalentTotal.toFixed(2)), 2);
                } catch (err) {
                    console.error('Güncelleme sırasında karşılık hesaplama hatası:', err);
                    updatedItem.equivalentTotal = updatedItem.total;
                    updatedItem.equivalentCurrency = updatedItem.currency;
                    updatedItem.equivalentCurrencyId = currencyId;
                    updatedItem.miktarKuru = parseFormattedNumber(document.getElementById('form-exchange-rate-miktar').value);
                    updatedItem.hesapKuru = updatedItem.miktarKuru;
                }
            }
        } else {
            // SATIŞ modu: kesinlikle (Tutar * KaynakKur) / HedefKur kullanılacak
            try {
                const sourceCurrencyId = currencyId;
                const targetCurrencyId = state.activeCurrencyId || (nationalCurrency ? nationalCurrency.id : null);

                // isEntry flag: öncelik fonksiyon parametresi, değilse mevcut item'in yönü
                const originalItem = state.receiptItems[state.selectedItemIndex];
                const isEntryFlag = (typeof isIncomeParam === 'boolean') ? isIncomeParam : (originalItem ? !!originalItem.isIncome : false);

                const { equivalent, sourceRate, targetRate, displayedRate } = await computeEquivalentForCurrencies(amount, sourceCurrencyId, targetCurrencyId, isEntryFlag);

                const exchangeRateInput = document.getElementById('form-exchange-rate');
                if (exchangeRateInput) {
                    exchangeRateInput.dataset.sourceRate = String(sourceRate);
                    exchangeRateInput.dataset.targetRate = String(targetRate);
                    exchangeRateInput.value = formatRate(displayedRate);
                }

                updatedItem.total = amount;
                updatedItem.currency = currency;
                updatedItem.exchangeRate = displayedRate;
                updatedItem.miktarKuru = sourceRate;
                updatedItem.hesapKuru = targetRate;
                updatedItem.equivalentTotal = parseFloat((equivalent || 0).toFixed(2));
                const targetCurrencyObj = allCurrencies.find(c => String(c.id) === String(targetCurrencyId)) || allCurrencies.find(c => c.dovizKodu === state.activeCurrency);
                updatedItem.equivalentCurrency = targetCurrencyObj ? targetCurrencyObj.dovizKodu : state.activeCurrency;
                updatedItem.equivalentCurrencyId = targetCurrencyObj ? targetCurrencyObj.id : state.activeCurrencyId;

                const amountEquivalentInput = document.getElementById('form-amount-equivalent');
                if (amountEquivalentInput) amountEquivalentInput.value = formatCurrency(updatedItem.equivalentTotal, 2);
            } catch (err) {
                console.error('Satış karşılık hesaplama hatası (güncelleme):', err);

                const exchangeRateInput = document.getElementById('form-exchange-rate');
                const rate = exchangeRateInput ? parseFormattedNumber(exchangeRateInput.value) : 1;
                updatedItem.equivalentTotal = parseFormattedNumber(document.getElementById('form-amount-equivalent').value);
                updatedItem.exchangeRate = rate;
                updatedItem.miktarKuru = rate;
                updatedItem.hesapKuru = 1.0;
                updatedItem.equivalentCurrencyId = state.activeCurrencyId;
                updatedItem.equivalentCurrency = state.activeCurrency;
            }
        }

        // Listeyi güncelle ve UI'ya dön
        state.receiptItems[state.selectedItemIndex] = updatedItem;
        renderReceipt();
        showDefaultMessage();
        if (window.switchMobileTab) window.switchMobileTab('fis');
    };
    const resetTransaction = () => {
        state.receiptItems = [];
        state.selectedItemIndex = -1;
        state.loadedFis = null;
        state.isEditModeActive = false;

        cariDevirBakiyeler = {};
        renderCariTotals();

        // === YENİ: Fiş Başlığını Sıfırla ===
        const isCari = state.operationType === 'cari';
        receiptTitle.textContent = isCari ? 'Cari Fişi' : 'Satış Fişi';
        // === YENİ SONU ===

        renderReceipt();
        showDefaultMessage();
        if (window.switchMobileTab) window.switchMobileTab('fis');
        updateMainButtons();
        startTimer(); // Zamanlayıcıyı yeniden başlat (ve tarihi güncelle)
        updateHeaderLockState(); // Başlığı kilitleme durumunu sıfırla
    };
    const updateMutabakatStatus = async (hareketId, isMutabik) => {
        try {
            const response = await fetch(`${API_BASE_URL}/Fisler/hareketler/${hareketId}/mutabakat`, {
                method: 'PUT',
                headers: {
                    ...getAuthHeaders(),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mutabakat: isMutabik,
                    kullanici: 'kuyumhesap-ops', // Mevcut kullanıcı
                    tarih: '2025-10-26 21:56:50' // UTC formatında sistem tarihi
                })
            });

            if (!response.ok) {
                throw new Error('Mutabakat durumu güncellenemedi.');
            }
            showToast('Mutabakat durumu güncellendi.', 'success');

        } catch (error) {
            showToast(error.message, 'danger');
            // Hata durumunda anahtarı eski konumuna geri al
            const anahtar = document.getElementById(`mutabakat-${hareketId}`);
            if (anahtar) anahtar.checked = !isMutabik;
        }
    };
    // (renderBakiyeOzeti) — HAS kuru yoksa API'den id=1 ile alır, pozisyonu HAS cinsinden hesaplar ve UI'yi günceller
    const renderBakiyeOzeti = (bakiyeDurumu) => {
        let bakiyeHTML = '';
        let toplamHas = 0;
        // Öncelikle allExchangeRates içinden HAS'i al
        const hasKuruEntry = Array.isArray(allExchangeRates) ? allExchangeRates.find(k => k.dovizKodu === 'HAS') : null;
        const localHasKuru = hasKuruEntry ? (hasKuruEntry.alisKuru ?? hasKuruEntry.satisKuru ?? 1) : null;
        let hasRows = false;

        // Hesaplama ve UI güncelleme işlevi (tekrar kullanılacak)
        const computeAndRender = (usedHasKuru) => {
            let html = '';
            let accHas = 0;
            let hasFound = false;

            for (const dovizKodu in bakiyeDurumu) {
                const bakiye = bakiyeDurumu[dovizKodu];
                if (Math.abs(bakiye) < 0.001) continue;
                hasFound = true;

                const durumClass = bakiye >= 0 ? 'alacak' : 'borc';
                const durumText = bakiye >= 0 ? 'Alacak' : 'Borç';

                // Döviz kuru bilgisi (allExchangeRates'de varsa al)
                const dovizKurData = Array.isArray(allExchangeRates) ? allExchangeRates.find(k => k.dovizKodu === dovizKodu) : null;
                const dovizKur = dovizKurData ? (dovizKurData.alisKuru ?? dovizKurData.satisKuru ?? 1) : 1;

                // Pozisyona katkı: eğer döviz HAS ise direkt ekle, değilse dövizi önce kendi kura çarp ve HAS kuruna böl
                if (dovizKodu === 'HAS') {
                    accHas += bakiye;
                } else {
                    // usedHasKuru kesinlikle > 0 olmalı; değilse 1 kullan
                    const effectiveHasKuru = (usedHasKuru && usedHasKuru > 0) ? usedHasKuru : 1;
                    accHas += (bakiye * dovizKur) / effectiveHasKuru;
                }

                html += `
                <div class="bakiye-item">
                    <span class="birim">${dovizKodu}</span>
                    <span class="tutar ${durumClass}">${formatCurrency(Math.abs(bakiye))} ${durumText}</span>
                </div>
            `;
            }

            if (!hasFound) {
                html = '<div class="text-center text-gray-500 py-2 text-sm">Bakiye bulunmuyor.</div>';
            }

            ekstreBakiyeOzeti.innerHTML = html;
            const pozisyonRenk = accHas >= 0 ? 'text-green-700' : 'text-red-700';
            ekstreHasPozisyon.innerHTML = `Pozisyon: <span class="${pozisyonRenk} font-mono">${formatCurrency(accHas, 2)} HAS</span>`;
        };

        // İlk render: eğer HAS kuru varsa hemen hesapla
        if (localHasKuru !== null) {
            computeAndRender(localHasKuru);
        } else {
            // Geçici render (varsayılan HAS kuru = 1) — sonra gerçek kuru ile yeniden hesaplayacağız
            computeAndRender(1);

            // Arka planda Cure/GetLastCure?id=1 çağır ve gelirse tekrar hesapla
            fetchLatestCure(1).then(rate => {
                if (rate && !isNaN(rate) && rate > 0) {
                    computeAndRender(rate);
                } else {
                    console.warn('HAS kuru alınamadı veya geçersiz:', rate);
                }
            }).catch(err => {
                console.warn('HAS kuru fetch hatası:', err);
            });
        }
    };
    // --- Güncellendi: hesaplama helper'ı artık isEntry parametresini kabul eder ve fetchLatestCure çağrılarına iletir ---
    const computeEquivalentForCurrencies = async (amount, sourceCurrencyId, targetCurrencyId, isEntry = null) => {
        // Öncelik: form üzerindeki dataset (canlı getirilen değerler)
        const exchangeRateInput = document.getElementById('form-exchange-rate');
        let dataSource = exchangeRateInput?.dataset?.sourceRate ? parseFloat(exchangeRateInput.dataset.sourceRate) : null;
        let dataTarget = exchangeRateInput?.dataset?.targetRate ? parseFloat(exchangeRateInput.dataset.targetRate) : null;

        let sourceRate = (typeof dataSource === 'number' && isFinite(dataSource) && dataSource > 0) ? dataSource : null;
        let targetRate = (typeof dataTarget === 'number' && isFinite(dataTarget) && dataTarget > 0) ? dataTarget : null;

        // Sunucudan canlı kuru dene (artık isEntry parametresi ile)
        try {
            if ((!sourceRate || sourceRate <= 0) && sourceCurrencyId) {
                const live = await fetchLatestCure(sourceCurrencyId, isEntry);
                if (live !== null && !isNaN(live) && live > 0) sourceRate = live;
            }
        } catch (e) { /* ignore */ }

        try {
            if ((!targetRate || targetRate <= 0) && targetCurrencyId) {
                const liveT = await fetchLatestCure(targetCurrencyId, isEntry);
                if (liveT !== null && !isNaN(liveT) && liveT > 0) targetRate = liveT;
            }
        } catch (e) { /* ignore */ }

        // Fallback'lar: allExchangeRates / allCurrencies / displayed value
        if ((!sourceRate || sourceRate <= 0) && sourceCurrencyId) {
            const srcCur = allCurrencies.find(c => String(c.id) === String(sourceCurrencyId));
            if (srcCur) {
                sourceRate = srcCur.dovizKodu === nationalCurrency.dovizKodu ? 1.0 :
                    (allExchangeRates.find(r => r.dovizKodu === srcCur.dovizKodu)?.alisKuru ?? allExchangeRates.find(r => r.dovizKodu === srcCur.dovizKodu)?.satisKuru ?? srcCur.alisKuru ?? srcCur.satisKuru ?? sourceRate ?? 0);
            }
        }
        if ((!targetRate || targetRate <= 0) && targetCurrencyId) {
            const tgtCur = allCurrencies.find(c => String(c.id) === String(targetCurrencyId));
            if (tgtCur) {
                targetRate = tgtCur.dovizKodu === nationalCurrency.dovizKodu ? 1.0 :
                    (allExchangeRates.find(r => r.dovizKodu === tgtCur.dovizKodu)?.alisKuru ?? allExchangeRates.find(r => r.dovizKodu === tgtCur.dovizKodu)?.satisKuru ?? tgtCur.alisKuru ?? tgtCur.satisKuru ?? targetRate ?? 1);
            }
        }

        // En son çare: kullanıcı tarafından gösterilen "Kur" değeri (form üzerindeki displayed rate = source/target)
        if ((!sourceRate || sourceRate <= 0) && exchangeRateInput) {
            const displayed = parseFormattedNumber(exchangeRateInput.value);
            if (displayed && displayed > 0 && (!targetRate || targetRate <= 0)) {
                sourceRate = displayed;
                targetRate = 1;
            }
        }

        const safeSource = (typeof sourceRate === 'number' && isFinite(sourceRate) && sourceRate > 0) ? sourceRate : 0;
        const safeTarget = (typeof targetRate === 'number' && isFinite(targetRate) && targetRate > 0) ? targetRate : 1;

        const equivalent = (safeSource > 0) ? ((amount * safeSource) / safeTarget) : 0;

        return {
            equivalent,
            sourceRate: safeSource,
            targetRate: safeTarget,
            displayedRate: (safeTarget > 0) ? (safeSource / safeTarget) : safeSource
        };
    };
    // --- GÜNCELLENMİŞ: addCashItemToReceipt ---
    const addCashItemToReceipt = async (panelType, isIncome) => {
        const isCari = state.operationType === 'cari';
        const accountId = document.getElementById('form-account-name').value;
        const account = allFinancialAccounts.find(a => a.hesapID == accountId);

        if (!account) {
            return showToast('Lütfen geçerli bir hesap adı seçin.', 'warning');
        }
        const total = parseFormattedNumber(document.getElementById('form-amount').value);
        if (total <= 0) {
            return showToast('Tutar sıfıdan büyük olmalıdır.', 'warning');
        }
        const currencySelect = document.getElementById('form-currency-tutar');
        const currencyId = currencySelect.value;
        const currency = currencySelect.options[currencySelect.selectedIndex].text;
        if (!currencyId) {
            return showToast('Lütfen miktar için bir para birimi seçin.', 'warning');
        }

        const newItem = {
            itemClass: 'cash',
            type: isIncome ? 'nakit-tahsilat' : 'nakit-odeme',
            isIncome: isIncome,
            description: document.getElementById('form-description').value || (isIncome ? 'Nakit Giriş' : 'Nakit Çıkış'),
            details: {
                accountId: account.hesapID,
                accountName: account.hesapAdi
            }
        };

        if (isCari) {
            const miktarKuru = parseFormattedNumber(document.getElementById('form-exchange-rate-miktar').value);
            const karsilikToggle = document.getElementById('karsilik-toggle');

            newItem.total = total;
            newItem.currency = currency;
            newItem.miktarKuru = miktarKuru;

            if (karsilikToggle && karsilikToggle.checked) {
                // "Farklı Birim Karşılığı" AÇIK ise mevcut mantık çalışır
                const equivalentTotal = parseFormattedNumber(document.getElementById('form-amount-equivalent').value);
                const hesapKuru = parseFormattedNumber(document.getElementById('form-exchange-rate-hesap').value);
                const equivalentCurrencySelect = document.getElementById('form-currency-equivalent');
                const equivalentCurrencyId = equivalentCurrencySelect ? equivalentCurrencySelect.value : '';
                const equivalentCurrency = equivalentCurrencySelect ? equivalentCurrencySelect.options[equivalentCurrencySelect.selectedIndex].text : '';

                if (!equivalentCurrencyId) {
                    return showToast('Lütfen "Karşılık" için bir para birimi seçin.', 'warning');
                }
                if (equivalentTotal <= 0) {
                    return showToast('"Karşılık Tutarı" sıfırdan büyük olmalıdır.', 'warning');
                }

                newItem.equivalentTotal = parseFloat(equivalentTotal.toFixed(2));
                newItem.equivalentCurrency = equivalentCurrency;
                newItem.equivalentCurrencyId = equivalentCurrencyId;
                newItem.hesapKuru = hesapKuru;
            } else {
                // Yeni: (Tutar * KaynakKur) / HedefKur
                try {
                    const equivalentCurrencySelect = document.getElementById('form-currency-equivalent');
                    const targetCurrencyId = equivalentCurrencySelect && equivalentCurrencySelect.value ? equivalentCurrencySelect.value : (nationalCurrency ? nationalCurrency.id : null);

                    const { equivalent, sourceRate, targetRate } = await computeEquivalentForCurrencies(total, currencyId, targetCurrencyId);

                    const targetCurrencyObj = allCurrencies.find(c => String(c.id) === String(targetCurrencyId)) || allCurrencies.find(c => c.dovizKodu === (nationalCurrency && nationalCurrency.dovizKodu));
                    const targetCurrencyCode = targetCurrencyObj ? targetCurrencyObj.dovizKodu : (nationalCurrency ? nationalCurrency.dovizKodu : currency);

                    newItem.equivalentTotal = parseFloat((equivalent || 0).toFixed(2));
                    newItem.equivalentCurrency = targetCurrencyCode || currency;
                    newItem.equivalentCurrencyId = targetCurrencyObj ? targetCurrencyObj.id : currencyId;
                    newItem.hesapKuru = targetRate || 1;
                    newItem.miktarKuru = sourceRate || 1;

                    // UI'ya da yaz (eğer form üzerindeyse)
                    const amountEquivalentInput = document.getElementById('form-amount-equivalent');
                    if (amountEquivalentInput) amountEquivalentInput.value = formatCurrency(newItem.equivalentTotal, 2);
                } catch (err) {
                    console.error('Karşılık hesaplama hatası (CARİ):', err);
                    newItem.equivalentTotal = total;
                    newItem.equivalentCurrency = currency;
                    newItem.equivalentCurrencyId = currencyId;
                    newItem.hesapKuru = miktarKuru;
                }
            }
        } else {
            // --- SATIŞ MODU: kesinlikle (Tutar * KaynakKur) / HedefKur kullan ---
            try {
                const sourceCurrencyId = currencyId;
                const targetCurrencyId = state.activeCurrencyId || (nationalCurrency ? nationalCurrency.id : null);

                // Burada isEntry parametresi olarak 'isIncome' gönderiyoruz.
                const { equivalent, sourceRate, targetRate, displayedRate } = await computeEquivalentForCurrencies(total, sourceCurrencyId, targetCurrencyId, isIncome);

                // exchangeRate input shows displayedRate (source/target) for user
                const exchangeRateInput = document.getElementById('form-exchange-rate');
                if (exchangeRateInput) {
                    exchangeRateInput.dataset.sourceRate = String(sourceRate);
                    exchangeRateInput.dataset.targetRate = String(targetRate);
                    exchangeRateInput.value = formatCurrency(displayedRate, 4);
                }

                newItem.total = total;
                newItem.currency = currency;
                newItem.exchangeRate = displayedRate; // gösterilen kur (source/target)
                newItem.miktarKuru = sourceRate;
                newItem.hesapKuru = targetRate;
                newItem.equivalentTotal = parseFloat((equivalent || 0).toFixed(2));
                const targetCurrencyObj = allCurrencies.find(c => String(c.id) === String(targetCurrencyId)) || allCurrencies.find(c => c.dovizKodu === state.activeCurrency);
                newItem.equivalentCurrency = targetCurrencyObj ? targetCurrencyObj.dovizKodu : state.activeCurrency;
                newItem.equivalentCurrencyId = targetCurrencyObj ? targetCurrencyObj.id : state.activeCurrencyId;

                // UI'ya da yaz (eğer form üzerindeyse)
                const amountEquivalentInput = document.getElementById('form-amount-equivalent');
                if (amountEquivalentInput) amountEquivalentInput.value = formatCurrency(newItem.equivalentTotal, 2);
            } catch (err) {
                console.error('Satış karşılık hesaplama hatası:', err);
                // Fallback: eskiden olduğu gibi gösterilmiş değeri kullan
                const exchangeRate = parseFormattedNumber(document.getElementById('form-exchange-rate').value);
                const equivalentTotal = parseFormattedNumber(document.getElementById('form-amount-equivalent').value);
                newItem.total = total;
                newItem.currency = currency;
                newItem.exchangeRate = exchangeRate;
                newItem.equivalentTotal = parseFloat(equivalentTotal.toFixed ? equivalentTotal.toFixed(2) : equivalentTotal) || equivalentTotal;
                newItem.equivalentCurrency = state.activeCurrency;
                newItem.equivalentCurrencyId = state.activeCurrencyId;
                newItem.miktarKuru = exchangeRate;
                newItem.hesapKuru = 1.0;
            }
        }

        state.receiptItems.push(newItem);
        renderReceipt();
        showDefaultMessage();
        if (window.switchMobileTab) window.switchMobileTab('fis');
    };
    // --- REPLACE: full renderNakitForm function (mutated to add reverse calculation in SATIŞ mode) ---
    const renderNakitForm = (title, isIncome, itemToEdit = null) => {
        const isEditing = itemToEdit !== null;
        if (!allFinancialAccounts || allFinancialAccounts.length === 0) {
            showToast('Finansal hesaplar henüz yüklenmedi, lütfen bekleyin.', 'warning');
            showDefaultMessage();
            if (window.switchMobileTab) window.switchMobileTab('fis');
            return;
        }

        const accountTypes = [
            { label: "KASALAR", value: "KASALAR", selectLabel: "Kasa Seçiniz" },
            { label: "BANKALAR", value: "BANKALAR", selectLabel: "Banka Seçiniz" },
            { label: "POSLAR", value: "POSLAR", selectLabel: "Pos Seçiniz" }
        ];
        const accountTypeIdMap = { KASALAR: 7, BANKALAR: 5, POSLAR: 6 };
        const allCurrenciesOptionsHTML = allCurrencies.map(c => `<option value="${c.id}">${c.dovizKodu}</option>`).join('');
        const isCari = state.operationType === 'cari';
        const defaultActiveType = accountTypes[0].value;

        let formHTML = `
    <h3 class="font-bold text-lg mb-4">${isEditing ? `Düzenle: ${itemToEdit.description}` : title}</h3>
    <div class="space-y-4">
        <div>
            <div id="nakit-hesap-tipi-toggle" class="tri-toggle-container" data-selected="${defaultActiveType}">
                <div class="tri-toggle-slider"></div>
                <div class="tri-toggle-options">
                    <div class="tri-toggle-option active" data-value="${accountTypes[0].value}">${accountTypes[0].label}</div>
                    <div class="tri-toggle-option" data-value="${accountTypes[1].value}">${accountTypes[1].label}</div>
                    <div class="tri-toggle-option" data-value="${accountTypes[2].value}">${accountTypes[2].label}</div>
                </div>
            </div>
        </div>

        <div class="float-label-container">
            <select id="form-account-name" class="float-label-input float-label-select" required></select>
            <label id="account-name-label" for="form-account-name" class="float-label">${accountTypes[0].selectLabel}</label>
        </div>
`;

        if (isCari) {
            formHTML += `
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div class="float-label-container md:col-span-1">
                <select id="form-currency-tutar" class="float-label-input float-label-select" required>
                    <option value=""></option>${allCurrenciesOptionsHTML}
                </select>
                <label for="form-currency-tutar" class="float-label">Birim</label>
            </div>
            <div class="float-label-container md:col-span-2">
                <input type="text" id="form-amount" class="float-label-input text-right font-mono" value="0,00">
                <label for="form-amount" class="float-label">Miktar</label>
            </div>
            <div class="float-label-container md:col-span-2">
                <input type="text" id="form-exchange-rate-miktar" class="float-label-input text-right font-mono" value="1,0000">
                <label for="form-exchange-rate-miktar" class="float-label">Kur</label>
            </div>
        </div>
        <div class="p-2 border border-gray-200 rounded-md bg-gray-50">
            <div class="flex justify-between items-center">
                <label for="karsilik-toggle" class="text-sm font-medium text-gray-700 select-none">Karşılığı</label>
                <div class="karsilik-toggle-container">
                    <input type="checkbox" id="karsilik-toggle" class="karsilik-toggle">
                    <label for="karsilik-toggle" class="karsilik-toggle-label"></label>
                </div>
            </div>
        </div>
        <div id="karsilik-details-container" class="hidden pt-3 border-t border-gray-200 mt-3">
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div class="float-label-container md:col-span-1">
                    <select id="form-currency-equivalent" class="float-label-input float-label-select" required>
                        <option value=""></option>${allCurrenciesOptionsHTML}
                    </select>
                    <label for="form-currency-equivalent" class="float-label">Birim</label>
                </div>
                <div class="float-label-container md:col-span-2">
                    <input type="text" id="form-amount-equivalent" class="float-label-input text-right font-mono" value="0,00">
                    <label for="form-amount-equivalent" class="float-label">Miktar</label>
                </div>
                <div class="float-label-container md:col-span-2">
                    <input type="text" id="form-exchange-rate-hesap" class="float-label-input text-right font-mono" value="1,0000">
                    <label for="form-exchange-rate-hesap" class="float-label">Kur</label>
                </div>
            </div>
        </div>
    `;
        } else {
            formHTML += `
        <div class="grid grid-cols-6 gap-x-2 gap-y-1 items-end">
            <div class="float-label-container col-span-1">
                <select id="form-currency-tutar" class="float-label-input float-label-select" required>
                    <option value=""></option>${allCurrenciesOptionsHTML}
                </select>
                <label for="form-currency-tutar" class="float-label">Birim</label>
            </div>
            <div class="float-label-container col-span-3">
                <input type="text" id="form-amount" class="float-label-input text-right font-mono" value="0,00">
                <label for="form-amount" class="float-label">Tutar</label>
            </div>
            <div id="form-exchange-rate-container" class="float-label-container col-span-2">
                <input type="text" id="form-exchange-rate" class="float-label-input text-right font-mono" value="1,0000">
                <label for="form-exchange-rate" class="float-label">Kur</label>
            </div>
        </div>

        <div id="karsilik-container" class="float-label-container relative mt-4">
            <input type="text" id="form-amount-equivalent" class="float-label-input text-right font-mono pr-16" value="0,00">
            <label for="form-amount-equivalent" class="float-label">Karşılığı</label>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 text-sm">
                ${state.activeCurrency}
            </div>
        </div>

        <div class="mt-4">
            <button id="btn-fill-remainder" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded-md text-sm">
                <i class="fas fa-calculator mr-1.5"></i>Kalanı Ekle (${formatCurrency(Math.abs(parseFormattedNumber(farkToplamSpan.textContent)))})
            </button>
        </div>
    `;
        }

        formHTML += `
    <div class="float-label-container mt-6">
        <textarea id="form-description" class="float-label-input pt-4" rows="5"></textarea>
        <label for="form-description" class="float-label">Açıklama</label>
    </div>
    </div>
    `;

        dynamicContentArea.innerHTML = formHTML;

        // --- Element references ---
        const nameSelect = document.getElementById('form-account-name');
        const amountInput = document.getElementById('form-amount');
        const formCurrencySelect = document.getElementById('form-currency-tutar');
        const exchangeRateInput = document.getElementById('form-exchange-rate');
        const amountEquivalentInput = document.getElementById('form-amount-equivalent');
        const btnFillRemainder = document.getElementById('btn-fill-remainder');
        const karsilikToggle = document.getElementById('karsilik-toggle');
        const karsilikDetails = document.getElementById('karsilik-details-container');
        const exchangeRateMiktarInput = document.getElementById('form-exchange-rate-miktar');
        const exchangeRateHesapInput = document.getElementById('form-exchange-rate-hesap');
        const equivalentCurrencySelect = document.getElementById('form-currency-equivalent');

        // Floating label wiring
        dynamicContentArea.querySelectorAll('select.float-label-input').forEach(selectEl => {
            const container = selectEl.closest('.float-label-container');
            const checkValue = () => container.classList.toggle('select-has-value', !!selectEl.value);
            selectEl.addEventListener('change', checkValue);
            checkValue();
        });

        // Populate account list helper
        const updateNakitHesapList = (selectedType) => {
            const selectedTypeId = accountTypeIdMap[selectedType] ?? null;
            const filteredAccounts = selectedTypeId ? allFinancialAccounts.filter(a => a.hesapTipiID === selectedTypeId) : [];
            nameSelect.innerHTML = '';
            const selectedTypeInfo = accountTypes.find(t => t.value === selectedType);
            const placeholderOption = document.createElement('option');
            placeholderOption.value = "";
            placeholderOption.textContent = selectedTypeInfo ? selectedTypeInfo.selectLabel : "Hesap Seçiniz...";
            placeholderOption.selected = true;
            placeholderOption.disabled = true;
            nameSelect.appendChild(placeholderOption);
            if (filteredAccounts.length === 0) nameSelect.disabled = true;
            else {
                filteredAccounts.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.hesapID;
                    option.textContent = item.hesapAdi;
                    nameSelect.appendChild(option);
                });
                nameSelect.disabled = false;
            }
            nameSelect.dispatchEvent(new Event('change'));
        };

        // Toggle options
        const toggleContainer = document.getElementById('nakit-hesap-tipi-toggle');
        const toggleOptions = toggleContainer.querySelectorAll('.tri-toggle-option');
        toggleOptions.forEach(option => {
            option.addEventListener('click', () => {
                const selectedValue = option.dataset.value;
                toggleContainer.dataset.selected = selectedValue;
                toggleOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                updateNakitHesapList(selectedValue);
                isFormDirty = true;
            });
        });

        // IMPORTANT: populate accounts immediately so "Kasalar" görünür
        updateNakitHesapList(defaultActiveType);

        // Numeric enforcement
        if (typeof enforceNumericInput === 'function') {
            [amountInput, exchangeRateInput, amountEquivalentInput, exchangeRateMiktarInput, exchangeRateHesapInput].forEach(el => { if (el) enforceNumericInput(el); });
        }

        // --- CARİ specific: wire bi-directional calculation between Tutar <-> Karşılığı ---
        if (isCari) {
            // Calculation helpers
            const calculateEquivalentFromAmount = () => {
                // equivalent = (amount * sourceRate) / targetRate
                const amount = parseFormattedNumber(amountInput.value);
                const sourceRate = parseFormattedNumber(exchangeRateMiktarInput.value) || 1;
                const targetRate = parseFormattedNumber(exchangeRateHesapInput.value) || 1;
                const equivalent = sourceRate > 0 ? (amount * sourceRate) / targetRate : 0;
                if (amountEquivalentInput) amountEquivalentInput.value = formatCurrency(equivalent, 2);
            };

            const calculateAmountFromEquivalent = () => {
                // amount = (equivalent * targetRate) / sourceRate
                const equivalent = parseFormattedNumber(amountEquivalentInput.value);
                const sourceRate = parseFormattedNumber(exchangeRateMiktarInput.value) || 1;
                const targetRate = parseFormattedNumber(exchangeRateHesapInput.value) || 1;
                const amount = sourceRate > 0 ? (equivalent * targetRate) / sourceRate : 0;
                if (amountInput) amountInput.value = formatCurrency(amount, 2);
            };

            // Wire events (bi-directional)
            if (amountInput) {
                amountInput.addEventListener('input', () => {
                    isFormDirty = true;
                    if (!karsilikToggle || !karsilikToggle.checked) calculateEquivalentFromAmount();
                });
                amountInput.addEventListener('blur', (e) => {
                    e.target.value = formatCurrency(parseFormattedNumber(e.target.value), 2);
                    if (!karsilikToggle || !karsilikToggle.checked) calculateEquivalentFromAmount();
                });
            }

            if (exchangeRateMiktarInput) {
                exchangeRateMiktarInput.addEventListener('input', () => {
                    isFormDirty = true;
                    // rate change affects both directions
                    if (!karsilikToggle || !karsilikToggle.checked) calculateEquivalentFromAmount();
                    else calculateAmountFromEquivalent();
                });
                exchangeRateMiktarInput.addEventListener('blur', (e) => {
                    e.target.value = formatCurrency(parseFormattedNumber(e.target.value), 4);
                    if (!karsilikToggle || !karsilikToggle.checked) calculateEquivalentFromAmount();
                    else calculateAmountFromEquivalent();
                });
            }

            if (amountEquivalentInput) {
                amountEquivalentInput.addEventListener('input', () => {
                    isFormDirty = true;
                    if (karsilikToggle && karsilikToggle.checked) calculateAmountFromEquivalent();
                });
                amountEquivalentInput.addEventListener('blur', (e) => {
                    e.target.value = formatCurrency(parseFormattedNumber(e.target.value), 2);
                    if (karsilikToggle && karsilikToggle.checked) calculateAmountFromEquivalent();
                });
            }

            if (exchangeRateHesapInput) {
                exchangeRateHesapInput.addEventListener('input', () => {
                    isFormDirty = true;
                    // target rate change affects both directions
                    if (karsilikToggle && karsilikToggle.checked) calculateAmountFromEquivalent();
                    else calculateEquivalentFromAmount();
                });
                exchangeRateHesapInput.addEventListener('blur', (e) => {
                    e.target.value = formatCurrency(parseFormattedNumber(e.target.value), 4);
                    if (karsilikToggle && karsilikToggle.checked) calculateAmountFromEquivalent();
                    else calculateEquivalentFromAmount();
                });
            }

            if (karsilikToggle) {
                karsilikToggle.addEventListener('change', () => {
                    karsilikDetails.classList.toggle('hidden', !karsilikToggle.checked);
                    isFormDirty = true;
                    // when opened, prefer to calculate amount from existing equivalent if equivalent > 0
                    const eq = parseFormattedNumber(amountEquivalentInput?.value);
                    if (karsilikToggle.checked) {
                        if (eq > 0) calculateAmountFromEquivalent();
                        else calculateAmountFromEquivalent(); // ensures sync even if eq 0
                    } else {
                        // when closed, keep primary calculation (amount -> equivalent)
                        calculateEquivalentFromAmount();
                    }
                });
            }

            // when currency selects change, update rates and recalc
            if (formCurrencySelect) formCurrencySelect.addEventListener('change', () => {
                if (typeof updateRate === 'function') updateRate(formCurrencySelect, exchangeRateMiktarInput);
                isFormDirty = true;
            });
            if (equivalentCurrencySelect) equivalentCurrencySelect.addEventListener('change', () => {
                if (typeof updateRate === 'function') updateRate(equivalentCurrencySelect, exchangeRateHesapInput);
                isFormDirty = true;
            });

            // Ensure initial sync
            setTimeout(() => {
                // If karşılık açık, compute amount from equivalent, else compute equivalent from amount
                if (karsilikToggle && karsilikToggle.checked) calculateAmountFromEquivalent();
                else calculateEquivalentFromAmount();
            }, 30);
        }
        // --- Satis specifics kept as before (no change) ---
        else {
            const resolveRateByCurrencyId = (currencyId) => {
                try {
                    if (!currencyId) return 1;
                    const cur = allCurrencies.find(c => String(c.id) === String(currencyId));
                    if (cur && nationalCurrency && cur.dovizKodu === nationalCurrency.dovizKodu) return 1;
                    const rateData = Array.isArray(allExchangeRates) ? allExchangeRates.find(r => r.dovizKodu === (cur?.dovizKodu)) : null;
                    const rate = parseFloat(rateData?.alisKuru ?? rateData?.satisKuru ?? cur?.alisKuru ?? cur?.satisKuru ?? 0) || 0;
                    return rate;
                } catch (e) { return 0; }
            };

            const calculateSatisTotals = () => {
                const amount = parseFormattedNumber(amountInput.value);
                const sourceCurrencyId = formCurrencySelect ? formCurrencySelect.value : null;
                const targetCurrencyId = state.activeCurrencyId || (nationalCurrency ? nationalCurrency.id : null);

                const dsSource = exchangeRateInput?.dataset?.sourceRate ? parseFloat(exchangeRateInput.dataset.sourceRate) : null;
                const dsTarget = exchangeRateInput?.dataset?.targetRate ? parseFloat(exchangeRateInput.dataset.targetRate) : null;

                const sourceRate = (typeof dsSource === 'number' && dsSource > 0) ? dsSource : resolveRateByCurrencyId(sourceCurrencyId);
                const targetRate = (typeof dsTarget === 'number' && dsTarget > 0) ? dsTarget : resolveRateByCurrencyId(targetCurrencyId);

                const safeSource = (typeof sourceRate === 'number' && isFinite(sourceRate) && sourceRate > 0) ? sourceRate : 0;
                const safeTarget = (typeof targetRate === 'number' && isFinite(targetRate) && targetRate > 0) ? targetRate : 1;

                if (safeSource > 0) {
                    const calculatedEquivalent = (parseFormattedNumber(amountInput.value) * safeSource) / safeTarget;
                    amountEquivalentInput.value = formatCurrency(calculatedEquivalent, 2);
                } else {
                    amountEquivalentInput.value = formatCurrency(0, 2);
                }
            };

            // NEW: reverse calculation for SATIŞ mode: when user edits Karşılığı, update Tutar
            // REPLACE: calculateAmountFromEquivalentSatis — don't overwrite visible "Kur" when user types Karşılığı
            // REPLACE: calculateAmountFromEquivalentSatis — önce Tutar doluysa Kur = Karşılık / Tutar yazsın; değilse eski ters hesaplama çalışsın
            const calculateAmountFromEquivalentSatis = async () => {
                try {
                    const equivalent = parseFormattedNumber(amountEquivalentInput.value);
                    const amountVal = parseFormattedNumber(amountInput.value);

                    // Eğer hem Tutar hem Karşılığı doluysa:
                    // Kur = Karşılık / Tutar -> ekranda görünen "Kur" alanına yaz (3 ondalık)
                    if (amountVal > 0 && equivalent > 0) {
                        const calculatedRate = equivalent / amountVal;

                        if (exchangeRateInput) {
                            // İç kullanım için dataset değerlerini güncelle
                            exchangeRateInput.dataset.sourceRate = String(calculatedRate);
                            exchangeRateInput.dataset.targetRate = String(1);

                            // Ekranda görünen kuru 3 ondalık (formatRate varsa kullan)
                            exchangeRateInput.value = (typeof formatRate === 'function')
                                ? formatRate(calculatedRate)
                                : formatCurrency(calculatedRate, 3);
                        }

                        // Tutarı değiştirme — kullanıcı Tutarı girmiş, Karşılığı değiştirildiğinde sadece Kur güncellensin
                        return;
                    }

                    // Eğer Tutar boşsa (veya 0) — eski mantık: Karşılıktan Tutar hesaplanacak
                    const sourceCurrencyId = formCurrencySelect ? formCurrencySelect.value : null;
                    const targetCurrencyId = state.activeCurrencyId || (nationalCurrency ? nationalCurrency.id : null);

                    // dataset içinden varsa al
                    const dsSource = exchangeRateInput?.dataset?.sourceRate ? parseFloat(exchangeRateInput.dataset.sourceRate) : null;
                    const dsTarget = exchangeRateInput?.dataset?.targetRate ? parseFloat(exchangeRateInput.dataset.targetRate) : null;

                    let sourceRate = (typeof dsSource === 'number' && dsSource > 0) ? dsSource : null;
                    let targetRate = (typeof dsTarget === 'number' && dsTarget > 0) ? dsTarget : null;

                    // Sunucudan canlı kuru dene
                    if ((!sourceRate || sourceRate <= 0) && sourceCurrencyId) {
                        const live = await fetchLatestCure(sourceCurrencyId).catch(() => null);
                        if (live !== null && !isNaN(live) && live > 0) sourceRate = live;
                    }
                    if ((!targetRate || targetRate <= 0) && targetCurrencyId) {
                        const liveT = await fetchLatestCure(targetCurrencyId).catch(() => null);
                        if (liveT !== null && !isNaN(liveT) && liveT > 0) targetRate = liveT;
                    }

                    // Fallback: yerel kaynaklar
                    if ((!sourceRate || sourceRate <= 0) && sourceCurrencyId) {
                        sourceRate = resolveRateByCurrencyId(sourceCurrencyId);
                    }
                    if ((!targetRate || targetRate <= 0) && targetCurrencyId) {
                        targetRate = resolveRateByCurrencyId(targetCurrencyId);
                    }

                    const safeSource = (typeof sourceRate === 'number' && isFinite(sourceRate) && sourceRate > 0) ? sourceRate : 1;
                    const safeTarget = (typeof targetRate === 'number' && isFinite(targetRate) && targetRate > 0) ? targetRate : 1;

                    // Karşılıktan Tutar hesapla (eski davranış)
                    const amount = safeSource > 0 ? (equivalent * safeTarget) / safeSource : 0;
                    if (amountInput) amountInput.value = formatCurrency(amount, 2);

                    // İçsel dataset'leri doldur (görünür Kur güncellenmesin çünkü Tutar hesaplandı)
                    if (exchangeRateInput) {
                        if (!exchangeRateInput.dataset.sourceRate || exchangeRateInput.dataset.sourceRate === '') {
                            exchangeRateInput.dataset.sourceRate = String(safeSource);
                        }
                        if (!exchangeRateInput.dataset.targetRate || exchangeRateInput.dataset.targetRate === '') {
                            exchangeRateInput.dataset.targetRate = String(safeTarget);
                        }
                        // Not: ekranda gösterilen exchangeRateInput.value burada değiştirilmiyor
                    }
                } catch (err) {
                    console.warn('calculateAmountFromEquivalentSatis hata:', err);
                }
            };
            const updateRateUI = async (useIsEntry = false) => {
                try {
                    const selectedCurrencyId = formCurrencySelect ? String(formCurrencySelect.value) : '';
                    const targetCurrencyId = String(state.activeCurrencyId ?? (nationalCurrency ? nationalCurrency.id : ''));

                    if (!selectedCurrencyId) {
                        exchangeRateInput.dataset.sourceRate = '';
                        exchangeRateInput.dataset.targetRate = '';
                        exchangeRateInput.value = formatCurrency(1, 4);
                        calculateSatisTotals();
                        return;
                    }

                    if (selectedCurrencyId && targetCurrencyId && selectedCurrencyId === targetCurrencyId) {
                        const rate = 1.0;
                        exchangeRateInput.dataset.sourceRate = String(rate);
                        exchangeRateInput.dataset.targetRate = String(rate);
                        exchangeRateInput.value = formatCurrency(rate, 4);
                        calculateSatisTotals();
                        return;
                    }

                    let sourceRate = null;
                    let targetRate = null;

                    if (useIsEntry) {
                        try {
                            const live = await fetchLatestCure(formCurrencySelect.value, isIncome).catch(() => null);
                            if (live !== null && !isNaN(live) && live > 0) sourceRate = live;
                        } catch { /* ignore */ }

                        try {
                            if (targetCurrencyId) {
                                const liveT = await fetchLatestCure(targetCurrencyId, isIncome).catch(() => null);
                                if (liveT !== null && !isNaN(liveT) && liveT > 0) targetRate = liveT;
                            }
                        } catch { /* ignore */ }
                    }

                    if ((!sourceRate || sourceRate <= 0) && formCurrencySelect && formCurrencySelect.value) {
                        sourceRate = resolveRateByCurrencyId(formCurrencySelect.value);
                    }
                    if ((!targetRate || targetRate <= 0) && targetCurrencyId) {
                        targetRate = resolveRateByCurrencyId(targetCurrencyId);
                    }

                    exchangeRateInput.dataset.sourceRate = (sourceRate !== null && sourceRate !== undefined) ? String(sourceRate) : '';
                    exchangeRateInput.dataset.targetRate = (targetRate !== null && targetRate !== undefined) ? String(targetRate) : '';
                  exchangeRateInput.value = formatRate(sourceRate ?? 0);

                    // Calculate default direction (amount -> equivalent)
                    calculateSatisTotals();

                    // If user has entered a non-zero karşılık, prefer reverse sync (karşılık -> tutar)
                    const eqVal = amountEquivalentInput ? parseFormattedNumber(amountEquivalentInput.value) : 0;
                    if (eqVal > 0) {
                        await calculateAmountFromEquivalentSatis();
                    }
                } catch (err) {
                    console.warn('updateRateUI genel hata:', err);
                    const fallback = 1.0;
                    exchangeRateInput.dataset.sourceRate = String(fallback);
                    exchangeRateInput.dataset.targetRate = String(fallback);
                    exchangeRateInput.value = formatCurrency(fallback, 4);
                    calculateSatisTotals();
                }
            };

            if (formCurrencySelect) {
                formCurrencySelect.addEventListener('change', (e) => {
                    const userTriggered = !!(e && e.isTrusted);
                    updateRateUI(userTriggered);
                });
            }

            if (btnFillRemainder) {
                btnFillRemainder.addEventListener('click', () => {
                    const fark = parseFormattedNumber(farkToplamSpan.textContent);
                    amountInput.value = formatCurrency(Math.abs(fark), 2);

                    if (formCurrencySelect) {
                        formCurrencySelect.value = '';
                        const container = formCurrencySelect.closest('.float-label-container');
                        if (container) container.classList.toggle('select-has-value', !!formCurrencySelect.value);
                        updateRateUI(false);
                    }

                    isFormDirty = true;
                });
            }

            amountInput.addEventListener('input', () => { isFormDirty = true; calculateSatisTotals(); });
            exchangeRateInput.addEventListener('input', () => {
                const manual = parseFormattedNumber(exchangeRateInput.value);
                if (!isNaN(manual) && manual > 0) {
                    // Treat manual as user-entered visible kur (source rate)
                    exchangeRateInput.dataset.sourceRate = String(manual);
                    // If no explicit targetRate, keep target = 1 (visible kur = source/target)
                    if (!exchangeRateInput.dataset.targetRate) exchangeRateInput.dataset.targetRate = '1';
                }

                const amountVal = parseFormattedNumber(amountInput.value);
                const eqVal = amountEquivalentInput ? parseFormattedNumber(amountEquivalentInput.value) : 0;

                // If user typed a manual kur and we have a Tutar, prefer direct calculation:
                // Karşılığı = Tutar * girilen Kur
                if (!isNaN(manual) && manual > 0 && amountVal > 0) {
                    if (amountEquivalentInput) amountEquivalentInput.value = formatCurrency(amountVal * manual, 2);
                    return;
                }

                // Fallbacks: if karşılık var -> recalc tutar from karşılık; else recalc karşılık
                if (eqVal > 0) calculateAmountFromEquivalentSatis();
                else calculateSatisTotals();
            });

            exchangeRateInput.addEventListener('blur', (e) => {
                // Format visible kur with 3 decimals (formatRate) for user friendliness
                const entered = parseFormattedNumber(e.target.value);
                e.target.value = (typeof formatRate === 'function') ? formatRate(entered) : formatCurrency(entered, 3);

                // Store dataset values for internal usage
                const enteredRate = parseFormattedNumber(e.target.value);
                if (!isNaN(enteredRate) && enteredRate > 0) {
                    exchangeRateInput.dataset.sourceRate = String(enteredRate);
                    if (!exchangeRateInput.dataset.targetRate) {
                        const tId = state.activeCurrencyId || (nationalCurrency ? nationalCurrency.id : null);
                        const resolved = resolveRateByCurrencyId(tId);
                        exchangeRateInput.dataset.targetRate = String(resolved || 1);
                    }
                }

                // If user entered a kur and Tutar exists, update Karşılığı = Tutar * Kur
                const amountVal = parseFormattedNumber(amountInput.value);
                if (enteredRate > 0 && amountVal > 0) {
                    if (amountEquivalentInput) amountEquivalentInput.value = formatCurrency(amountVal * enteredRate, 2);
                    return;
                }

                // Otherwise prefer previous behavior
                const eqVal = amountEquivalentInput ? parseFormattedNumber(amountEquivalentInput.value) : 0;
                if (eqVal > 0) calculateAmountFromEquivalentSatis();
                else calculateSatisTotals();
            });

            if (formCurrencySelect) {
                formCurrencySelect.value = '';
                const container = formCurrencySelect.closest('.float-label-container');
                if (container) container.classList.toggle('select-has-value', !!formCurrencySelect.value);
                updateRateUI(false);
            }

            // Wire reverse calculation listeners for SATIŞ: Karşılığı -> Tutar
            if (amountEquivalentInput) {
                amountEquivalentInput.addEventListener('input', () => {
                    isFormDirty = true;
                    // If user types in karşılık, compute tutar from it
                    calculateAmountFromEquivalentSatis();
                });
                amountEquivalentInput.addEventListener('blur', (e) => {
                    e.target.value = formatCurrency(parseFormattedNumber(e.target.value), 2);
                    calculateAmountFromEquivalentSatis();
                });
            }
        }

        // Edit mode: set values directly without triggering change events / network calls
        if (isEditing && itemToEdit) {
            setTimeout(() => {
                try {
                    const accountType = allFinancialAccounts.find(a => a.hesapID == itemToEdit.details.accountId)?.hesapTipiAdi || accountTypes[0].value;
                    const targetOption = toggleContainer.querySelector(`.tri-toggle-option[data-value="${accountType}"]`);
                    if (targetOption) targetOption.click();

                    if (nameSelect) nameSelect.value = itemToEdit.details.accountId;
                    if (nameSelect) nameSelect.dispatchEvent(new Event('change'));

                    if (amountInput) amountInput.value = formatCurrency(itemToEdit.total);
                    const editCurrency = allCurrencies.find(c => c.dovizKodu === itemToEdit.currency);
                    if (formCurrencySelect && editCurrency) {
                        formCurrencySelect.value = editCurrency.id;
                        const container = formCurrencySelect.closest('.float-label-container');
                        if (container) container.classList.toggle('select-has-value', !!formCurrencySelect.value);
                    }

                    if (exchangeRateInput) exchangeRateInput.value = formatCurrency(itemToEdit.miktarKuru ?? itemToEdit.hesapKuru ?? 1, 4);
                    if (amountEquivalentInput) amountEquivalentInput.value = formatCurrency(itemToEdit.equivalentTotal ?? itemToEdit.total, 2);

                    if (document.getElementById('form-description')) document.getElementById('form-description').value = itemToEdit.description || '';

                    isFormDirty = false;
                } catch (err) {
                    console.warn('renderNakitForm edit doldurma hata:', err);
                }
            }, 80);
        }

        [addButton, cancelButton].forEach(btn => btn.classList.remove('hidden'));
        cancelButton.onclick = showDefaultMessage;
        addButton.innerHTML = isEditing ? '<i class="fas fa-sync-alt mr-1.5"></i>Güncelle' : '<i class="fas fa-check mr-1.5"></i>Ekle';
        addButton.onclick = () => isEditing ? updateItemInReceipt('cash', isIncome) : addCashItemToReceipt('cash', isIncome);
        deleteButton.classList.toggle('hidden', !isEditing);
    };
    // getHesapEkstresi — genel kullanım için Receipt POST endpoint'ine çeker
    const getHesapEkstresi = async (hesapId, baslangicTarihi, bitisTarihi) => {
        try {
            const payload = {
                CustomerId: parseInt(hesapId, 10),
                StartDate: baslangicTarihi,
                EndDate: bitisTarihi
            };

            const response = await fetch(`${API_BASE_URL}/Receipt/GetEkstreByCustomerIdAndDate`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Ekstre alınamadı: ${await response.text()}`);
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    };
    const createEkstreSatiri = (hareket, anlikBakiyeJson) => {
        // Güvenli property okuyucu: farklı isimlendirmeleri dener (PascalCase, camelCase, Türkçe)
        const get = (obj, ...keys) => {
            for (const k of keys) {
                if (!obj) continue;
                if (k.includes('.')) {
                    const parts = k.split('.');
                    let v = obj;
                    for (const p of parts) {
                        if (v == null) { v = undefined; break; }
                        v = v[p];
                    }
                    if (v !== undefined && v !== null) return v;
                } else {
                    if (Object.prototype.hasOwnProperty.call(obj, k) && obj[k] !== undefined && obj[k] !== null) return obj[k];
                    const lowerKey = k.toLowerCase();
                    const foundKey = Object.keys(obj).find(x => x.toLowerCase() === lowerKey);
                    if (foundKey) return obj[foundKey];
                }
            }
            return undefined;
        };

        // Tarih
        const rawDate = get(hareket, 'ReceiptDate', 'receiptDate', 'tarih', 'date');
        const date = rawDate ? new Date(rawDate) : null;
        const tarih = (date && !isNaN(date.getTime()))
            ? date.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            : 'Invalid Date';

        // Temel alanlar (gönderilebilecek tüm alternatif isimleri dene)
        const islem = (get(hareket, 'TransactionName', 'transactionName', 'islem', 'islemAdi') || '').toString();
        const description = get(hareket, 'Description', 'description', 'aciklama') || '';

        const miktar = parseFloat(get(hareket, 'Quantity', 'quantity', 'miktar') ?? 0) || 0;

        // RAW birim alanları (response içinde Unit / CounterUnit isimli alanlar isteniyordu)
        const rawUnit = get(hareket, 'Unit', 'unit', 'birim', 'birimKod') ?? get(hareket, 'CurrencyCode', 'currencyCode') ?? '';
        const rawCounterUnit = get(hareket, 'CounterUnit', 'counterUnit', 'karsilikBirim') ?? '';

        // Eğer API numeric id dönerse allCurrencies üzerinden döviz kodunu almaya çalış
        const mapUnit = (raw) => {
            if (raw === undefined || raw === null) return '';
            const s = String(raw);
            if (/^\d+$/.test(s)) {
                const mapped = allCurrencies.find(c => String(c.id) === s);
                if (mapped) return mapped.dovizKodu || mapped.currencyCode || s;
            }
            return s;
        };

        const birim = mapUnit(rawUnit) || '';
        const karsilikBirimi = mapUnit(rawCounterUnit) || '';

        const karsilikMiktar = parseFloat(get(hareket, 'CounterRate', 'counterRate', 'karsilikMiktar') ?? 0) || 0;

        const kur = parseFloat(get(hareket, 'ExchangeRate', 'exchangeRate', 'kur') ?? 0) || 0;
        const karsilikKuru = parseFloat(get(hareket, 'CounterExchangeRate', 'counterExchangeRate', 'karsilikKuru') ?? 0) || 0;

        // Baz/has karşılığı (ekranda ikinci satırda gösterilen değer)
        const baseAmount = parseFloat(get(hareket, 'BalanceEffectAmount', 'balanceEffectAmount', 'Tutar_BPBR', 'tutar_bpbr', 'baseAmount') ?? 0) || 0;

        // Bakiye göstergeleri
        const eskiBakiye = parseFloat(get(hareket, 'OldBalance', 'oldBalance', 'eskiBakiye') ?? 0) || 0;
        const sonBakiye = parseFloat(get(hareket, 'FinalBalance', 'finalBalance', 'sonBakiye') ?? 0) || 0;

        const hareketId = get(hareket, 'MovementId', 'movementId', 'hareketID', 'hareketId') ?? '';
        const fisId = get(hareket, 'ReceiptId', 'receiptId', 'fisID', 'fisId') ?? '';

        // Giriş/Çıkış belirleme
        let isGiris = get(hareket, 'IsEntry', 'isEntry', 'girisMi');
        if (isGiris === undefined) {
            const tType = get(hareket, 'TransactionTypeId', 'transactionTypeId', 'hareketTipID', 'hareketTipId');
            if (tType !== undefined && tType !== null) {
                isGiris = (tType === 1 || tType === 3 || tType === 7 || tType === 9);
            } else {
                isGiris = true;
            }
        }

        const borderClass = isGiris ? 'ekstre-item-giris' : 'ekstre-item-cikis';
        const colorClass = isGiris ? 'text-green-600' : 'text-red-600';
        const sign = isGiris ? '+' : '-';

        // Özel: Nakit için iki sütunlu gösterim — ürün mü kontrolü
        let detayHTML = '';
        if (get(hareket, 'StockName', 'stockName', 'stokAdi')) {
            // (ürün branch aynı kaldı)
            const stokAdi = get(hareket, 'StockName', 'stockName', 'stokAdi') || '';
            const milyem = parseFloat(get(hareket, 'MillRate', 'millRate', 'milyem') ?? 0) || 0;
            const iscilik = parseFloat(get(hareket, 'LaborCost', 'laborCost', 'iscilik') ?? 0) || 0;
            const urunHasDegeri = parseFloat(get(hareket, 'NetProductValue', 'netProductValue', 'urunHasDegeri') ?? 0) || 0;
            const toplamHas = urunHasDegeri + (parseFloat(get(hareket, 'TotalLaborCost', 'totalLaborCost', 'toplamIscilik') ?? 0) || 0);

            detayHTML = `
            <div class="ekstre-v3-sol">
                <span class="baslik ${colorClass}">${islem}</span>
                <span class="tarih">${tarih}</span>
            </div>
            <div class="ekstre-v3-orta">
                <div class="ekstre-v3-detay-grup">
                    <span class="font-semibold text-sm">${stokAdi} ${formatCurrency(miktar, 2)} ${birim} (${formatCurrency(milyem, 3)})</span>
                    <span class="text-xs text-gray-600">İşçilik: (${formatCurrency(get(hareket, 'LaborCost', 'laborCost', 'iscilik') || 0, 3)}) ${get(hareket, 'LaborUnit', 'laborUnit', 'iscilikBirimi') || ''} ${formatCurrency(iscilik, 2)} HAS</span>
                </div>
                <div class="ekstre-v3-detay-grup text-right">
                    <span class="text-sm font-semibold text-gray-700">${formatCurrency(urunHasDegeri, 2)} HAS</span>
                </div>
                <div class="ekstre-v3-detay-grup text-right">
                    <span class="font-bold text-base ${colorClass}">${formatCurrency(toplamHas, 2)} HAS</span>
                </div>
            </div>`;
        } else {
            // Nakit/Genel hareket: sol üst = işlem adı, sol alt = tarih
            // Sağ üst = Döviz miktar (örn. +1,00 USD)
            // Sağ orta = Base karşılığı (örn. 44,57 TRY)

            const foreignAmountText = `${sign}${formatCurrency(miktar, 2)} ${birim || ''}`.trim();
            const baseAmountText = `${formatCurrency(baseAmount, 2)} ${karsilikBirimi || ''}`.trim();

            const kurTextPrimary = (kur && kur > 0) ? `${birim || ''} Kuru: ${formatCurrency(kur, 4)}` : '';
            const kurTextCounter = (karsilikKuru && karsilikKuru > 0) ? `${karsilikBirimi || ''} Kuru: ${formatCurrency(karsilikKuru, 4)}` : '';

            detayHTML = `
            <div class="ekstre-v3-sol">
                <span class="baslik ${colorClass}">${islem || description}</span>
                <span class="tarih">${tarih}</span>
            </div>
            <div class="ekstre-v3-orta">
                <div class="ekstre-v3-detay-grup">
                    <span class="font-semibold text-sm">${foreignAmountText}</span>
                    <span class="text-xs text-gray-600">${kurTextPrimary}</span>
                </div>
                <div class="ekstre-v3-detay-grup">
                    <span class="font-mono font-semibold">${baseAmountText}</span>
                      <span class="text-xs text-gray-600">${kurTextCounter}</span>
                </div>
            </div>`;
        }

        const bakiyeBlok = `<div class="bakiye-grup">
                           <span class="eski-bakiye">EB: ${formatCurrency(eskiBakiye, 2)} ${karsilikBirimi || ''}</span>
                           <span class="son-bakiye">SB: ${formatCurrency(sonBakiye, 2)} ${karsilikBirimi || ''}</span>
                         </div>`;

        const mutabakatBlok = `<div class="flex flex-col items-center">
                              <span class="hareket-id">ID:${hareketId}</span>
                              <label class="mutabakat-switch">
                                  <input type="checkbox" id="mutabakat-${hareketId}" ${get(hareket, 'IsReconciled', 'isReconciled', 'mutabakat') ? 'checked' : ''}>
                                  <span class="mutabakat-slider"></span>
                              </label>
                           </div>`;

        const duzenleBlok = `<div class="ml-2">
                            <button class="edit-ekstre-fis-btn bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-md hover:bg-blue-200" data-fis-id="${fisId}">
                                <i class="fas fa-pencil-alt"></i>
                            </button>
                         </div>`;

        return `<div class="ekstre-item ${borderClass}" data-balances='${anlikBakiyeJson || '{}'}'>
                <div style="display: contents;">${detayHTML}</div>
                <div class="ekstre-blok-sag">${bakiyeBlok}${mutabakatBlok}${duzenleBlok}</div>
            </div>`;
    };
    const reconstructReceiptItems = (fisData) => {
        const items = [];
        const processedHareketIDs = new Set();
        const allMovements = fisData.hareketler;

        console.log("=== FİŞ YÜKLEME BAŞLIYOR ===");
        console.log("Fiş ID:", fisData.fisID);
        console.log("Cari Hesap ID:", fisData.cariHesapID);
        console.log("Toplam Hareket Sayısı:", allMovements.length);
        console.log("Açık Hesap Bilgisi:", { paraBirimi: fisData.paraBirimi, acikHesapTutar: fisData.acikHesapTutar });

        // ===== AÇIK HESAP KONTROLÜ =====
        if (fisData.acikHesapTutar != null && Math.abs(fisData.acikHesapTutar) > 0.001) {
            console.log("--> Açık hesap bulundu:", fisData.acikHesapTutar, fisData.paraBirimi);

            items.push({
                itemClass: 'acik-hesap',
                type: 'acik-hesap',
                total: Math.abs(fisData.acikHesapTutar),
                equivalentTotal: Math.abs(fisData.acikHesapTutar),
                isIncome: fisData.acikHesapTutar > 0,
                description: fisData.acikHesapTutar > 0 ? 'Açık Hesap - Alacağına' : 'Açık Hesap - Borcuna',
                currency: fisData.paraBirimi || 'TRY',
                equivalentCurrency: fisData.paraBirimi || 'TRY',
                miktarKuru: 1,
                hesapKuru: 1,
                details: {}
            });

            console.log("   ✅ Açık hesap eklendi");
        }

        // ===== TÜM HAREKETLERİ GRUPLA =====
        const hareketPairs = [];

        for (const hareket of allMovements) {
            if (processedHareketIDs.has(hareket.hareketID)) continue;

            const karsiHareket = allMovements.find(h => h.hareketID === hareket.karsiHareketID);

            if (!karsiHareket) {
                console.warn("⚠️ Karşı hareket bulunamadı:", hareket.hareketID);
                continue;
            }

            const musteriHareketi = hareket.hesapID === fisData.cariHesapID ? hareket : karsiHareket;
            const karsiTaraf = hareket.hesapID === fisData.cariHesapID ? karsiHareket : hareket;

            hareketPairs.push({ musteriHareketi, karsiTaraf });

            processedHareketIDs.add(hareket.hareketID);
            processedHareketIDs.add(karsiHareket.hareketID);
        }

        console.log("İşlenecek Hareket Çifti Sayısı:", hareketPairs.length);

        // ===== HER HAREKET ÇİFTİNİ İŞLE =====
        for (const { musteriHareketi, karsiTaraf } of hareketPairs) {
            const isProduct = musteriHareketi.stokID != null;
            const hareketTipID = musteriHareketi.hareketTipID;

            console.log(`--> İşleniyor: HareketID=${musteriHareketi.hareketID}, Tip=${hareketTipID}, girisMi=${musteriHareketi.girisMi}`);

            if (isProduct) {
                // ===== ÜRÜN HAREKETİ (10, 11) =====
                const stok = allStoklar.find(s => s.stokID == musteriHareketi.stokID) || {};

                const isIncome = musteriHareketi.girisMi;
                const miktar = musteriHareketi.miktar ?? 0;
                const milyem = musteriHareketi.milyem ?? 0;
                const birimIscilik = musteriHareketi.iscilik ?? 0;
                const toplamIscilik = musteriHareketi.toplamIscilik ?? 0;
                const iscilikBirimi = musteriHareketi.iscBrm || 'HAS';
                const iscilikTipi = (musteriHareketi.iscAdet && musteriHareketi.iscAdet > 0) ? 'Adet' : 'Gram';
                const adet = musteriHareketi.iscAdet || 0;
                const iscilikDahil = musteriHareketi.iscDahil || false;
                const urunHasDegeri = musteriHareketi.urunHasDegeri ?? 0;
                const toplamHas = urunHasDegeri + toplamIscilik;

                items.push({
                    itemClass: 'product',
                    type: isIncome ? 'urun-giris' : 'urun-cikis',
                    total: toplamHas,
                    equivalentTotal: toplamHas,
                    isIncome: isIncome,
                    description: musteriHareketi.aciklama || stok.stokAdi || 'Bilinmeyen Ürün',
                    currency: 'HAS',
                    equivalentCurrency: 'HAS',
                    details: {
                        stokId: stok.stokID,
                        stok: stok,
                        stokAdi: stok.stokAdi || 'Bilinmeyen',
                        stokTipAdi: stok.stokTipAdi || 'DİĞER',
                        stokGrupAdi: stok.stokGrupAdi || 'GENEL',
                        miktar: miktar,
                        milyem: milyem,
                        birim: stok.birim || 'GR',
                        toplamHas: toplamHas,
                        type: (stok.stokGrupAdi === 'HURDA GRUBU') ? 'hurda' :
                            ((stok.stokTipAdi === 'ALTIN' || stok.stokTipAdi === 'SARRAFİYE') ? 'altin' : 'diger'),
                        birimIscilik: birimIscilik,
                        iscilikTipi: iscilikTipi,
                        toplamIscilik: toplamIscilik,
                        iscilikBirimi: iscilikBirimi,
                        adet: adet,
                        iscilikDahil: iscilikDahil
                    }
                });

                console.log("   ✅ Ürün eklendi");

            } else if (hareketTipID === 14 || hareketTipID === 15) {
                // ===== VİRMAN HAREKETİ (14, 15) - DOĞRU MANTIK =====
                const karsiHesap = allAccounts.find(a => a.hesapID === karsiTaraf.hesapID);

                // ✅ DOĞRU: Hareket Tip ID'ye göre yönü belirle
                // 14 = VİRMAN GİRİŞ  → isIncome = true  (YEŞİL, ALACAK)
                // 15 = VİRMAN ÇIKIŞ  → isIncome = false (KIRMIZI, BORÇ)
                const isIncome = (hareketTipID === 14);

                console.log(`   --> Virman DEBUG:`);
                console.log(`       hareketTipID: ${hareketTipID} (${hareketTipID === 14 ? 'GİRİŞ' : 'ÇIKIŞ'})`);
                console.log(`       musteriHareketi.miktar: ${musteriHareketi.miktar} ${musteriHareketi.birim}`);
                console.log(`       karsiTaraf.miktar: ${karsiTaraf.miktar} ${karsiTaraf.birim}`);
                console.log(`       isIncome: ${isIncome} (${isIncome ? 'YEŞİL' : 'KIRMIZI'})`);

                items.push({
                    itemClass: 'virman',
                    type: isIncome ? 'virman-giris' : 'virman-cikis',
                    total: musteriHareketi.miktar,
                    equivalentTotal: musteriHareketi.miktar,  // ✅ Aynı birimde
                    isIncome: isIncome,  // ✅ Hareket tipine göre
                    description: musteriHareketi.aciklama.replace(/Virman - Karşı Hesap: .+ - /, ''),
                    currency: musteriHareketi.birim,
                    equivalentCurrency: musteriHareketi.birim,  // ✅ Aynı birim
                    miktarKuru: musteriHareketi.kur,
                    hesapKuru: musteriHareketi.kur,
                    details: {
                        karsiHesapId: karsiTaraf.hesapID,
                        karsiHesapAdi: karsiHesap?.hesapAdi || 'Bilinmeyen Hesap',
                        karsilikDegeri: karsiTaraf.miktar,
                        karsilikBirimi: karsiTaraf.birim,
                        karsilikKuru: karsiTaraf.kur
                    }
                });

                console.log(`   ✅ Virman eklendi: ${isIncome ? '+' : '-'}${musteriHareketi.miktar} ${musteriHareketi.birim}`);

            } else if (hareketTipID === 12 || hareketTipID === 13) {
                // ===== İSKONTO HAREKETİ (12, 13) =====
                const iskontoHesap = allFinancialAccounts.find(a => a.hesapID === karsiTaraf.hesapID);

                items.push({
                    itemClass: 'iskonto',
                    type: musteriHareketi.girisMi ? 'alacak-iskonto' : 'borc-iskonto',
                    total: musteriHareketi.miktar,
                    equivalentTotal: musteriHareketi.miktar,
                    isIncome: musteriHareketi.girisMi,
                    description: musteriHareketi.aciklama,
                    currency: musteriHareketi.birim,
                    equivalentCurrency: musteriHareketi.birim,
                    miktarKuru: musteriHareketi.kur,
                    hesapKuru: musteriHareketi.kur,
                    details: {
                        accountId: karsiTaraf.hesapID,
                        accountName: iskontoHesap?.hesapAdi || 'İskonto Hesabı',
                        bilancoDegeri: karsiTaraf.miktar,
                        bilancoKuru: karsiTaraf.kur
                    }
                });

                console.log("   ✅ İskonto eklendi");

            } else if (hareketTipID === 16 || hareketTipID === 17) {
                // ===== ÇEVİRME HAREKETİ (16, 17) =====
                items.push({
                    itemClass: 'ceviri',
                    type: musteriHareketi.girisMi ? 'ceviri-giris' : 'ceviri-cikis',
                    total: musteriHareketi.miktar,
                    equivalentTotal: karsiTaraf.miktar,
                    isIncome: musteriHareketi.girisMi,
                    description: musteriHareketi.aciklama,
                    currency: musteriHareketi.birim,
                    equivalentCurrency: karsiTaraf.birim,
                    miktarKuru: musteriHareketi.kur,
                    hesapKuru: karsiTaraf.kur,
                    details: {
                        ceviriTipi: musteriHareketi.girisMi ? 'borcundaki' : 'alacagindaki',
                        kaynakBirim: musteriHareketi.birim,
                        hedefBirim: karsiTaraf.birim,
                        kaynakMiktar: musteriHareketi.miktar,
                        hedefMiktar: karsiTaraf.miktar,
                        kaynakKur: musteriHareketi.kur,
                        hedefKur: karsiTaraf.kur
                    }
                });

                console.log("   ✅ Çevirme eklendi");

            } else {
                // ===== NAKİT HAREKETİ (7, 8) =====
                const finansalHesap = allFinancialAccounts.find(a => a.hesapID === karsiTaraf.hesapID);

                items.push({
                    itemClass: 'cash',
                    type: musteriHareketi.girisMi ? (fisData.cariMi ? 'nakit-giris' : 'nakit-tahsilat') : (fisData.cariMi ? 'nakit-cikis' : 'nakit-odeme'),
                    total: musteriHareketi.miktar,
                    equivalentTotal: musteriHareketi.karsilikMiktar || musteriHareketi.miktar,
                    isIncome: musteriHareketi.girisMi,
                    description: musteriHareketi.aciklama.replace(`Finansal Hesap: ${finansalHesap?.hesapAdi || ''} - `, ''),
                    currency: musteriHareketi.birim,
                    equivalentCurrency: musteriHareketi.karsilikBirim || musteriHareketi.birim,
                    miktarKuru: musteriHareketi.kur,
                    hesapKuru: musteriHareketi.karsilikKuru || musteriHareketi.kur,
                    equivalentCurrencyId: allCurrencies.find(c => c.dovizKodu === (musteriHareketi.karsilikBirim || musteriHareketi.birim))?.id,
                    details: {
                        accountId: karsiTaraf.hesapID,
                        accountName: finansalHesap?.hesapAdi || 'Bilinmeyen Hesap'
                    }
                });

                console.log("   ✅ Nakit eklendi");
            }
        }

        console.log("=== FİŞ YÜKLEME TAMAMLANDI ===");
        console.log("Toplam Yüklenen İşlem:", items.length);

        return items;
    };
    const loadFisToScreen = async (fisId, isEditMode = false) => {
        showLoadingOverlay();
        try {
            const base = String(Front_BASE_URL || API_BASE_URL).replace(/\/$/, '');
            const url = `${base}/Receipt/GetById?id=${encodeURIComponent(fisId)}`;
            console.log('Fetching receipt details from:', url);

            const response = await fetch(url, { headers: getAuthHeaders() });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Fiş detayları alınamadı: ${response.status} - ${errorText || 'Boş yanıt'}`);
            }

            const raw = await response.json();
            const payload = raw && raw.data ? raw.data : raw;

            // Helper: giriş transaction type id'leri (sağladığın liste)
            const ENTRY_TRANSACTION_IDS = new Set([1, 3, 5, 7, 9]);

            // Normalize movements and try to infer counterpart (karsiHareketID) when API doesn't provide it
            const srcMovs = Array.isArray(payload.movements ?? payload.Movements) ? (payload.movements ?? payload.Movements) : [];
            // shallow clone to avoid mutating original
            const srcClone = srcMovs.map(m => ({ ...m }));

            // Build quick lookup by id
            const byId = new Map(srcClone.map(m => [Number(m.id ?? m.Id ?? 0), m]));

            // Try to find counterpart for each movement when counterTransactionId missing
            const findCounterpart = (m) => {
                // Prefer explicit counterTransactionId if present and valid
                const explicit = m.counterTransactionId ?? m.counterTransactionId ?? m.karsiHareketID;
                if (explicit) return Number(explicit);

                // Otherwise match by reciprocal amounts and currency ids (best-effort)
                for (const other of srcClone) {
                    if (other === m) continue;
                    const mF = Number(m.foreignCurrencyAmount ?? m.foreignAmount ?? m.miktar ?? 0);
                    const mC = Number(m.counterCurrencyAmount ?? m.counterAmount ?? m.karsilikDegeri ?? 0);
                    const oF = Number(other.foreignCurrencyAmount ?? other.foreignAmount ?? other.miktar ?? 0);
                    const oC = Number(other.counterCurrencyAmount ?? other.counterAmount ?? other.karsilikDegeri ?? 0);

                    const mFcId = String(m.foreignCurrencyId ?? m.foreignCurrencyId ?? m.foreignCurrencyCode ?? '');
                    const mCcId = String(m.counterCurrencyId ?? m.counterCurrencyId ?? m.counterCurrencyCode ?? '');
                    const oFcId = String(other.foreignCurrencyId ?? other.foreignCurrencyId ?? other.foreignCurrencyCode ?? '');
                    const oCcId = String(other.counterCurrencyId ?? other.counterCurrencyId ?? other.counterCurrencyCode ?? '');

                    // reciprocal amounts match and currency ids make sense OR baseCurrencyAmount match
                    const reciprocalAmounts = (Math.abs(mF - oC) < 0.0001 && Math.abs(mC - oF) < 0.0001);
                    const currencyMatch = (mFcId && oCcId && mFcId === oCcId) || (mCcId && oFcId && mCcId === oFcId);
                    const baseMatch = (Math.abs(Number(m.baseCurrencyAmount ?? 0) - Number(other.baseCurrencyAmount ?? 0)) < 0.0001 && m.receiptId === other.receiptId);

                    if ((reciprocalAmounts && currencyMatch) || baseMatch) {
                        return Number(other.id ?? other.Id ?? 0);
                    }
                }
                return null;
            };

            // helper: numeric id veya code string gelirse döviz kodunu çöz
            const resolveCurrencyCode = (val) => {
                if (val === undefined || val === null) return '';
                const s = String(val).trim();
                if (s === '') return '';
                // Eğer numeric id gelmişse allCurrencies'ten dovizKodu'nu al
                if (/^\d+$/.test(s)) {
                    const found = allCurrencies.find(c => String(c.id) === s);
                    if (found) return found.dovizKodu || found.currencyCode || s;
                    return s;
                }
                // Muhtemelen zaten bir kod (TRY, USD vs.)
                return s;
            };

            const mappedMovements = srcClone.map(m => {
                const id = Number(m.id ?? m.Id ?? 0);
                const counterId = findCounterpart(m);

                // infer girisMi using explicit flag, then transactionTypeId set, then name
                const inferredGiris = (typeof m.girisMi !== 'undefined') ? Boolean(m.girisMi)
                    : (typeof m.transactionTypeId !== 'undefined') ? ENTRY_TRANSACTION_IDS.has(Number(m.transactionTypeId))
                        : (m.transactionName && String(m.transactionName).toUpperCase().includes('GİRİŞ'));

                // raw fields (may be code string or numeric id)
                const rawForeignCode = (m.foreignCurrencyCode ?? m.foreignCurrencyCode ?? (m.foreignCurrencyId ? String(m.foreignCurrencyId) : '') ?? m.birim ?? '');
                const rawCounterCode = (m.counterCurrencyCode ?? m.counterCurrencyCode ?? (m.counterCurrencyId ? String(m.counterCurrencyId) : '') ?? m.karsilikBirim ?? '');

                // resolve to currency code (e.g. "USD", "TRY")
                const foreignCurrencyCode = resolveCurrencyCode(rawForeignCode);
                const counterCurrencyCode = resolveCurrencyCode(rawCounterCode);

                return {
                    hareketID: id,
                    fisID: m.receiptId ?? m.fisID ?? m.receiptId,
                    hareketTipID: m.transactionTypeId ?? m.hareketTipID ?? m.TransactionTypeId,
                    islemKodu: m.transactionCode ?? m.transactionCode ?? m.transactionCode,
                    islemAdi: m.transactionName ?? m.transactionName ?? m.transactionName,
                    hesapID: m.accountId ?? m.hesapID ?? m.accountId,
                    hesapAdi: m.accountName ?? m.accountName ?? m.AccountName ?? '',
                    hesapTipID: m.accountTypeId ?? m.accountTypeId ?? m.hesapTipID ?? null,
                    stokID: m.stockId ?? m.stokID ?? null,
                    aciklama: m.description ?? m.aciklama ?? '',
                    miktar: Number(m.foreignCurrencyAmount ?? m.foreignAmount ?? m.miktar ?? 0),
                    birim: foreignCurrencyCode, // artık döviz kodu
                    kur: Number(m.foreignExchangeRate ?? m.kur ?? 0),
                    karsilikMiktar: Number(m.counterCurrencyAmount ?? m.counterAmount ?? m.karsilikDegeri ?? 0),
                    karsilikBirim: counterCurrencyCode, // artık döviz kodu
                    karsilikKuru: Number(m.counterExchangeRate ?? m.karsilikKuru ?? 0),
                    baseCurrencyAmount: Number(m.baseCurrencyAmount ?? m.BaseCurrencyAmount ?? 0),
                    karsiHareketID: counterId,
                    kur2: Number(m.counterExchangeRate ?? m.karsilikKuru ?? 0),
                    girisMi: inferredGiris
                };
            });

            const fisData = {
                fisID: payload.id ?? payload.FisId ?? payload.receiptId ?? payload.receiptID,
                fisNo: payload.receiptNumber ?? payload.fisNo ?? payload.ReceiptNumber ?? '',
                tarih: payload.receiptDate ?? payload.tarih ?? payload.ReceiptDate ?? '',
                cariHesapID: payload.accountId ?? payload.cariHesapID ?? payload.AccountId ?? null,
                paraBirimi: payload.currencyCode ?? payload.paraBirimi ?? payload.CurrencyCode ?? (payload.currency ?? ''),
                acikHesapTutar: payload.openBalanceAmount ?? payload.acikHesapTutar ?? payload.OpenBalanceAmount ?? 0,
                personelID: payload.employeeId ?? payload.personelID ?? payload.EmployeeId ?? null,
                cariMi: (payload.isCustomerReceipt ?? payload.cariMi) ? 1 : 0,
                hesapAdi: payload.accountName ?? payload.AccountName ?? '',
                hareketler: mappedMovements
            };

            const isCari = fisData.cariMi === 1 || (state.operationType === 'cari' && fisData.cariMi !== 0);
            state.loadedFis = fisData;
            state.isEditModeActive = isEditMode;

            receiptTitle.textContent = `${isCari ? 'Cari Fişi' : 'Satış Fişi'} ${fisData.fisID ? fisData.fisID : ''}`;

            try { fisTarihiInput.value = toLocalISOString(new Date(fisData.tarih)); } catch { }

            if (fisData.cariHesapID) customerSlimSelect.setSelected(String(fisData.cariHesapID));
            if (fisData.personelID) salespersonSlimSelect.setSelected(fisData.personelID);

            if (!isCari) {
                const mainCurrencyCode = fisData.paraBirimi || nationalCurrency.dovizKodu;
                const mainCurrency = allCurrencies.find(c => c.dovizKodu === mainCurrencyCode);
                if (mainCurrency) currencySelect.value = mainCurrency.id;
                else currencySelect.value = nationalCurrency.id;
            } else {
                currencySelect.value = '';
            }

            updateActiveCurrency();

            const fisDate = new Date(fisData.tarih);
            const dayBefore = new Date(fisDate);
            dayBefore.setDate(fisDate.getDate() - 1);
            await fetchAndRenderCariBakiye(getLocalDateString(dayBefore));

            state.receiptItems = reconstructReceiptItems(fisData);
            renderReceipt();
            updateHeaderLockState();
            updateMainButtons();

            if (isEditMode) {
                fisListModal.classList.add('hidden');
            } else {
                document.querySelectorAll('.fis-list-item').forEach(r => r.classList.remove('selected-row'));
                document.querySelector(`.fis-list-item[data-fis-id='${fisId}']`)?.classList.add('selected-row');
            }
        } catch (error) {
            showToast(error.message, 'error');
            console.error('loadFisToScreen error:', error);
        } finally {
            hideLoadingOverlay();
        }
    };
    const applyFisListFiltersAndRender = () => {
        // Robustly read selection from fis-list customer filter
        const rawSelected = getSlimSelectedValue(fisListCustomerFilterSlimSelect, 'fis-list-customer-filter');
        const selectedCustomerId = Array.isArray(rawSelected) ? (rawSelected.length ? rawSelected[0] : '') : (rawSelected || '');
        const startDate = fisListStartDate.value;
        const endDate = fisListEndDate.value;

        let filteredList = state.fisList;

        if (selectedCustomerId && String(selectedCustomerId).toLowerCase() !== 'all' && String(selectedCustomerId) !== '') {
            filteredList = filteredList.filter(fis => fis.cariHesapID == selectedCustomerId);
        }

        if (startDate) {
            const startDateTime = new Date(startDate).setHours(0, 0, 0, 0);
            filteredList = filteredList.filter(fis => new Date(fis.tarih) >= startDateTime);
        }

        if (endDate) {
            const endDateTime = new Date(endDate).setHours(23, 59, 59, 999);
            filteredList = filteredList.filter(fis => new Date(fis.tarih) <= endDateTime);
        }

        renderFisList(filteredList);
    };
    const renderFisList = (fislerToShow) => {
        fislerToShow.sort((a, b) => new Date(b.tarih) - new Date(a.tarih));

        let contentHTML = '';

        if (!fislerToShow || fislerToShow.length === 0) {
            contentHTML = '<div class="text-center text-gray-500 p-8">Filtreye uygun kayıt bulunamadı.</div>';
        } else {
            // Ana konteyneri, kartlar arasında boşluk bırakacak şekilde değiştiriyoruz.
            contentHTML += '<div class="ekstre-list-container p-2">';
            fislerToShow.forEach(fis => {
                const hesap = allAccounts.find(a => a.hesapID == fis.cariHesapID);
                const tarih = new Date(fis.tarih).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

                const duzenleButonu = `<button class="edit-fis-btn bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-md hover:bg-blue-200" data-fis-id="${fis.fisID}"><i class="fas fa-pencil-alt"></i></button>`;

                // Her bir satıra 'ekstre-item' class'ını ekleyerek çerçeveli görünümü kazandırıyoruz.
                contentHTML += `
                                    <div class="ekstre-item fis-list-item" data-fis-id="${fis.fisID}">
                                        <span class="font-mono text-gray-600 w-36 flex-shrink-0">${tarih}</span>
                                        <span class="font-mono text-gray-500 w-20 flex-shrink-0">#${fis.fisID}</span>
                                        <span class="font-semibold text-gray-800 flex-grow truncate" title="${hesap ? hesap.hesapAdi : ''}">${hesap ? hesap.hesapAdi : 'Bilinmeyen Hesap'}</span>
                                        <span class="font-mono text-gray-700 w-40 flex-shrink-0">${fis.fisNo}</span>
                                        <div class="ml-auto">
                                            ${duzenleButonu}
                                        </div>
                                    </div>
                                `;
            });
            contentHTML += '</div>';
        }
        fisListContent.innerHTML = contentHTML;
    };
    // Robust SlimSelect helper (ekle/replace yakınındaki benzer yardımcıyla çakışmasın diye)
    const getSlimSelectedValue = (slimInstance, selectorId) => {
        try {
            // If instance is missing -> fallback to native select
            if (!slimInstance) {
                const native = document.getElementById(selectorId);
                if (!native) return '';
                if (native.multiple) return Array.from(native.selectedOptions).map(o => o.value);
                return native.value;
            }

            // Common SlimSelect APIs (try in order)
            if (typeof slimInstance.getSelected === 'function') return slimInstance.getSelected();
            if (typeof slimInstance.selected === 'function') return slimInstance.selected();
            if (typeof slimInstance.get === 'function') {
                const v = slimInstance.get();
                if (v !== undefined && v !== null) return v;
            }
            // Some older/newer variants expose properties
            if (slimInstance.selected !== undefined) return slimInstance.selected;
            if (slimInstance.getSelectedOptions) return slimInstance.getSelectedOptions();

            // As a last resort, read native DOM
            const native = document.getElementById(selectorId);
            if (native) return native.value;
        } catch (err) {
            console.warn('getSlimSelectedValue error', err);
        }
        return '';
    };

    const setSlimSelectedValue = (slimInstance, selectorId, value) => {
        try {
            if (slimInstance) {
                if (typeof slimInstance.setSelected === 'function') { slimInstance.setSelected(value); return; }
                if (typeof slimInstance.set === 'function') { slimInstance.set(value); return; }
                if (typeof slimInstance.setData === 'function') {
                    // attempt to keep existing data and force selection
                    try { slimInstance.setSelected && slimInstance.setSelected(value); return; } catch { /* ignore */ }
                }
            }
            const native = document.getElementById(selectorId);
            if (native) {
                native.value = value;
                native.dispatchEvent(new Event('change'));
            }
        } catch (err) {
            console.warn('setSlimSelectedValue error', err);
        }
    };

    // Updated fetchAndShowFisList using helpers
    const fetchAndShowFisList = async () => {
        const isCari = state.operationType === 'cari';
        fisListModalTitle.textContent = isCari ? 'Cari Fiş Listesi' : 'Satış Fiş Listesi';

        // Tarihleri ayarla: başlangıç = ayın 1'i, bitiş = bugün
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        fisListStartDate.value = getLocalDateString(firstDayOfMonth);
        fisListEndDate.value = getLocalDateString(today);

        // Modal'ın hesap filtresini ana ekrandaki seçime göre ayarla
        let mainSelected = '';
        try {
            if (typeof customerSlimSelect !== 'undefined' && customerSlimSelect) {
                mainSelected = getSlimSelectedValue(customerSlimSelect, 'customer-select');
            } else if (customerSelect) {
                mainSelected = customerSelect.value;
            }
        } catch (err) {
            mainSelected = (customerSelect ? customerSelect.value : '');
        }
        if (Array.isArray(mainSelected)) mainSelected = mainSelected.length ? mainSelected[0] : '';

        const modalDefault = (mainSelected && String(mainSelected).trim() !== '') ? String(mainSelected) : 'all';
        try { setSlimSelectedValue(fisListCustomerFilterSlimSelect, 'fis-list-customer-filter', modalDefault); } catch (e) { console.warn(e); }

        fisListContent.innerHTML = '<div class="text-center p-8"><i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i></div>';
        fisListModal.classList.remove('hidden');

        try {
            let accountId = 0;
            if (modalDefault && String(modalDefault).toLowerCase() !== 'all') {
                const parsed = parseInt(modalDefault, 10);
                if (!isNaN(parsed)) accountId = parsed;
            }

            const payload = {
                IsCari: isCari,
                AccountId: accountId,
                StartDate: `${fisListStartDate.value}T00:00:00`,
                EndDate: `${fisListEndDate.value}T23:59:59`
            };

            const response = await fetch(`${API_BASE_URL}/Receipt/GetAll`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const txt = await response.text().catch(() => '');
                throw new Error(`Fiş listesi alınamadı (${response.status}) - ${txt}`);
            }

            const result = await response.json();
            const list = (result && result.data) ? result.data : [];

            state.fisList = list.map(r => ({
                fisID: r.id,
                fisNo: r.receiptNumber,
                tarih: r.receiptDate,
                cariHesapID: r.accountId,
                raw: r
            }));

            applyFisListFiltersAndRender();
        } catch (error) {
            fisListContent.innerHTML = `<p class="text-center text-red-500 p-8">${error.message}</p>`;
            console.error('fetchAndShowFisList error:', error);
        }
    };
    // Yeni: Save to Receipt/Create endpoint with CreateReceiptCommandRequest model
    const saveReceiptToServer = async (requestModel) => {
        showLoadingOverlay();
        try {
            const base = String(API_BASE_URL || Front_BASE_URL).replace(/\/$/, '');
            const url = `${base}/Receipt/Create`;
            console.log('SAVE -> POST', url);
            console.log('SAVE -> Request model', requestModel);

            if (!navigator.onLine) {
                throw new Error('Tarayıcı çevrimdışı (offline). İnternet bağlantınızı kontrol edin.');
            }

            // CORS geliştirici durumları için mode:'cors' belirtmek yardımcı olur
            const response = await fetch(url, {
                method: 'POST',
                headers: getAuthHeaders(),
                mode: 'cors',
                body: JSON.stringify(requestModel)
            });

            if (!response.ok) {
                const text = await response.text().catch(() => '');
                // Eğer response boşsa, network/CORS nedeniyle isteğe hiç ulaşılamamış olabilir
                throw new Error(`Sunucu hatası: ${response.status} - ${text || '(gövde yok veya alınamadı)'}`);
            }

            const result = await response.json().catch(() => null);
            showToast('Fiş başarıyla kaydedildi!', 'success');
            resetTransaction();
            if (state.operationType === 'cari') {
                await fetchAndRenderCariBakiye();
            }
            return result;
        } catch (error) {
            console.error('saveReceiptToServer hata detay:', error);
            // Ağ seviyesinde "Failed to fetch" alıyorsanız burada yakalanır
            if (error instanceof TypeError && error.message === 'Failed to fetch') {
                showToast('Ağ hatası: Sunucuya ulaşılamadı. CORS/SSL veya port yanlış olabilir. Network sekmesini kontrol edin.', 'danger');
            } else {
                showToast(`Kayıt sırasında bir hata oluştu: ${error.message}`, 'danger');
            }
            throw error; // üst fonksiyonda da yakalanabiliyor
        } finally {
            hideLoadingOverlay();
        }
    };
    const updateReceiptToServer = async (fisId, fisData) => {
        showLoadingOverlay();
        try {
            const response = await fetch(`${API_BASE_URL}/Fisler/${fisId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(fisData)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Sunucu hatası: ${response.status} - ${errorText}`);
            }
            showToast(`Fiş ID ${fisId} başarıyla güncellendi!`, 'success');
            resetTransaction();
            if (state.operationType === 'cari') {
                await fetchAndRenderCariBakiye();
            }
        } catch (error) {
            showToast(`Güncelleme sırasında bir hata oluştu: ${error.message}`, 'danger');
        } finally {
            hideLoadingOverlay();
        }
    };
    const performDelete = async (fisId) => {
        showLoadingOverlay();
        try {
            const response = await fetch(`${API_BASE_URL}/Fisler/${fisId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Sunucu hatası: ${response.status} - ${errorText}`);
            }
            showToast(`Fiş ID ${fisId} başarıyla silindi.`, 'success');
            resetTransaction();
        } catch (error) {
            showToast(`Silme işlemi sırasında bir hata oluştu: ${error.message}`, 'danger');
        } finally {
            hideLoadingOverlay();
        }
    };
    // performSave: artık CreateReceiptCommandRequest modelini oluşturup saveReceiptToServer'a gönderir
    const performSave = async (fisTarihi) => {
        console.log("performSave çağrıldı. Tarih:", fisTarihi);

        const selectedValue = customerSlimSelect.getSelected();
        const selectedCustomerId = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;
        const selectedSalesperson = salespersonSlimSelect.getSelected();

        if (!selectedCustomerId || selectedCustomerId === '') {
            showToast('HATA: Müşteri/Cari Hesap ID alınamadı veya boş!', 'danger');
            console.error("performSave HATA: selectedCustomerId boş veya tanımsız:", selectedCustomerId);
            return;
        }

        // SATIŞ modunda açık hesap kontrolü ve hesaplaması
        let openBalanceAmount = null;
        let currencyCode = null;

        if (state.operationType === 'satis') {
            const acikHesapItem = state.receiptItems.find(item => item.itemClass === 'acik-hesap');
            if (acikHesapItem) {
                openBalanceAmount = acikHesapItem.isIncome ? acikHesapItem.total : -acikHesapItem.total;
                currencyCode = acikHesapItem.currency;
            }
        } else {
            // Cari modda para birimi boş bırakılabilir; backend gerektiğinde yorumlar
            currencyCode = null;
        }

        const requestModel = {
            ReceiptNumber: state.loadedFis ? (state.loadedFis.fisNo || `WEB-${Date.now()}`) : `WEB-${Date.now()}`,
            ReceiptDate: fisTarihi,
            AccountId: parseInt(selectedCustomerId, 10),
            EmployeeId: (Array.isArray(selectedSalesperson) && selectedSalesperson.length > 0) ? parseInt(selectedSalesperson[0]) : (selectedSalesperson ? parseInt(selectedSalesperson) : null),
            Description: `Web arayüzünden oluşturulan ${state.operationType} işlemi.`,
            IsCustomerReceipt: state.operationType === 'cari',
            CurrencyCode: currencyCode || (state.operationType === 'satis' ? state.activeCurrency : null),
            OpenBalanceAmount: openBalanceAmount,
            CreateMovementReceiptRequestDtos: []
        };

        // Yeni TransactionTypeId eşlemeleri (verilen resim)
        const NAKIT_GIRIS_ID = 1;
        const NAKIT_CIKIS_ID = 2;
        const URUN_GIRIS_ID = 3;
        const URUN_CIKIS_ID = 4;
        const ALACAK_ISKONTO_ID = 5;
        const BORC_ISKONTO_ID = 6;
        const VIRMAN_GIRIS_ID = 7;
        const VIRMAN_CIKIS_ID = 8;
        const CEVIRME_GIRIS_ID = 9;
        const CEVIRME_CIKIS_ID = 10;

        const hasCurrency = allCurrencies.find(c => c.dovizKodu === 'HAS');
        const hasCurrencyId = hasCurrency ? parseInt(hasCurrency.id, 10) : null;
        const nationalCurrencyId = nationalCurrency ? parseInt(nationalCurrency.id, 10) : null;

        // Yardımcı: DTO oluşturup modele ekle
        const pushDTO = (dto) => {
            requestModel.CreateMovementReceiptRequestDtos.push(dto);
        };

        // State'teki kalemleri dolaş ve DTO'ları oluştur
        for (const item of state.receiptItems.filter(i => i.itemClass !== 'acik-hesap')) {
            if (item.itemClass === 'cash') {
                // Ana müşteri hareketi
                const itemCurrency = allCurrencies.find(c => c.dovizKodu === item.currency);
                const itemCurrencyId = itemCurrency ? parseInt(itemCurrency.id, 10) : (nationalCurrencyId || null);
                const counterCurrencyId = parseInt(item.equivalentCurrencyId || itemCurrencyId, 10);

                const customerTransactionType = item.isIncome ? NAKIT_GIRIS_ID : NAKIT_CIKIS_ID;
                const financialTransactionType = item.isIncome ? NAKIT_CIKIS_ID : NAKIT_GIRIS_ID;

                // müşteri hareketi
                pushDTO({
                    TransactionTypeId: customerTransactionType,
                    AccountId: parseInt(selectedCustomerId, 10),
                    StockId: null,
                    Description: item.description || (item.isIncome ? 'Nakit Giriş' : 'Nakit Çıkış'),
                    ForeignCurrencyAmount: item.total,
                    ForeignCurrencyId: itemCurrencyId,
                    ForeignExchangeRate: item.miktarKuru ?? 1,
                    CounterCurrencyAmount: item.equivalentTotal ?? item.total,
                    CounterCurrencyId: counterCurrencyId,
                    CounterExchangeRate: item.hesapKuru ?? item.miktarKuru ?? 1,
                    BaseCurrencyAmount: (item.equivalentTotal ?? item.total) * (item.hesapKuru ?? 1),
                    CostAmount: 0,
                    ProfitAmount: 0,
                    CounterTransactionId: null,
                    Quantity: 0,
                    MillRate: 0,
                    LaborCost: null,
                    LaborUnit: null,
                    LaborQuantity: null,
                    IsLaborIncluded: null,
                    IsReconciled: false,
                    NetProductValue: 0,
                    TotalLaborCost: 0
                });

                // karşı finansal hesap hareketi
                pushDTO({
                    TransactionTypeId: financialTransactionType,
                    AccountId: parseInt(item.details.accountId, 10),
                    StockId: null,
                    Description: `Karşı Hesap: ${selectedCustomerId} - ${item.description || ''}`,
                    ForeignCurrencyAmount: item.equivalentTotal ?? item.total,
                    ForeignCurrencyId: counterCurrencyId,
                    ForeignExchangeRate: item.hesapKuru ?? item.miktarKuru ?? 1,
                    CounterCurrencyAmount: item.total,
                    CounterCurrencyId: itemCurrencyId,
                    CounterExchangeRate: item.miktarKuru ?? 1,
                    BaseCurrencyAmount: (item.equivalentTotal ?? item.total) * (item.hesapKuru ?? 1),
                    CostAmount: 0,
                    ProfitAmount: 0,
                    CounterTransactionId: null,
                    Quantity: 0,
                    MillRate: 0,
                    LaborCost: null,
                    LaborUnit: null,
                    LaborQuantity: null,
                    IsLaborIncluded: null,
                    IsReconciled: false,
                    NetProductValue: 0,
                    TotalLaborCost: 0
                });
            }
            else if (item.itemClass === 'iskonto') {
                const itemCurrency = allCurrencies.find(c => c.dovizKodu === item.currency);
                const itemCurrencyId = itemCurrency ? parseInt(itemCurrency.id, 10) : (nationalCurrencyId || null);
                const bilancoCurrency = allCurrencies.find(c => c.dovizKodu === (item.details?.bilancoBirimi || 'HAS')) || nationalCurrency;
                const bilancoCurrencyId = bilancoCurrency ? parseInt(bilancoCurrency.id, 10) : (hasCurrencyId || null);

                const musteriType = item.isIncome ? ALACAK_ISKONTO_ID : BORC_ISKONTO_ID;
                const iskontoType = getOppositeHareketTipID(musteriType) || (item.isIncome ? BORC_ISKONTO_ID : ALACAK_ISKONTO_ID);

                pushDTO({
                    TransactionTypeId: musteriType,
                    AccountId: parseInt(selectedCustomerId, 10),
                    StockId: null,
                    Description: item.description || '',
                    ForeignCurrencyAmount: item.total,
                    ForeignCurrencyId: itemCurrencyId,
                    ForeignExchangeRate: item.miktarKuru ?? 1,
                    CounterCurrencyAmount: item.details?.bilancoDegeri ?? item.total,
                    CounterCurrencyId: bilancoCurrencyId,
                    CounterExchangeRate: item.details?.bilancoKuru ?? 1,
                    BaseCurrencyAmount: (item.details?.bilancoDegeri ?? (item.total * (item.miktarKuru ?? 1))),
                    CostAmount: 0,
                    ProfitAmount: 0,
                    CounterTransactionId: null,
                    Quantity: 0,
                    MillRate: 0,
                    LaborCost: null,
                    LaborUnit: null,
                    LaborQuantity: null,
                    IsLaborIncluded: false,
                    IsReconciled: false,
                    NetProductValue: 0,
                    TotalLaborCost: 0
                });

                pushDTO({
                    TransactionTypeId: iskontoType,
                    AccountId: parseInt(item.details.accountId, 10),
                    StockId: null,
                    Description: `Karşı Hesap: ${selectedCustomerId} - ${item.description || ''}`,
                    ForeignCurrencyAmount: item.details?.bilancoDegeri ?? 0,
                    ForeignCurrencyId: bilancoCurrencyId,
                    ForeignExchangeRate: item.details?.bilancoKuru ?? 1,
                    CounterCurrencyAmount: item.total,
                    CounterCurrencyId: itemCurrencyId,
                    CounterExchangeRate: item.miktarKuru ?? 1,
                    BaseCurrencyAmount: (item.details?.bilancoDegeri ?? 0),
                    CostAmount: 0,
                    ProfitAmount: 0,
                    CounterTransactionId: null,
                    Quantity: 0,
                    MillRate: 0,
                    LaborCost: null,
                    LaborUnit: null,
                    LaborQuantity: null,
                    IsLaborIncluded: false,
                    IsReconciled: false,
                    NetProductValue: 0,
                    TotalLaborCost: 0
                });
            }
            else if (item.itemClass === 'virman') {
                // Virman: iki hareket (müşteri ve karşı hesap) — aynı birimlerde genelde
                const itemCurrency = allCurrencies.find(c => c.dovizKodu === item.currency);
                const itemCurrencyId = itemCurrency ? parseInt(itemCurrency.id, 10) : (nationalCurrencyId || null);

                const karsilikBirimi = item.details?.karsilikBirimi ?? item.equivalentCurrency;
                const karsilikCurrency = allCurrencies.find(c => c.dovizKodu === karsilikBirimi);
                const karsilikCurrencyId = karsilikCurrency ? parseInt(karsilikCurrency.id, 10) : itemCurrencyId;

                const musteriType = item.isIncome ? VIRMAN_GIRIS_ID : VIRMAN_CIKIS_ID;
                const karsiType = getOppositeHareketTipID(musteriType) || (item.isIncome ? VIRMAN_CIKIS_ID : VIRMAN_GIRIS_ID);

                pushDTO({
                    TransactionTypeId: musteriType,
                    AccountId: parseInt(selectedCustomerId, 10),
                    StockId: null,
                    Description: `Virman - Karşı Hesap: ${item.details.karsiHesapAdi || ''} - ${item.description || ''}`,
                    ForeignCurrencyAmount: item.total,
                    ForeignCurrencyId: itemCurrencyId,
                    ForeignExchangeRate: item.miktarKuru ?? 1,
                    CounterCurrencyAmount: item.details?.karsilikDegeri ?? item.equivalentTotal ?? item.total,
                    CounterCurrencyId: karsilikCurrencyId,
                    CounterExchangeRate: item.details?.karsilikKuru ?? item.hesapKuru ?? 1,
                    BaseCurrencyAmount: (item.total * (item.miktarKuru ?? 1)),
                    CostAmount: 0,
                    ProfitAmount: 0,
                    CounterTransactionId: null,
                    Quantity: 0,
                    MillRate: 0,
                    LaborCost: null,
                    LaborUnit: null,
                    LaborQuantity: null,
                    IsLaborIncluded: false,
                    IsReconciled: false,
                    NetProductValue: 0,
                    TotalLaborCost: 0
                });

                pushDTO({
                    TransactionTypeId: karsiType,
                    AccountId: parseInt(item.details.karsiHesapId, 10),
                    StockId: null,
                    Description: `Virman - Karşı Hesap: ${selectedCustomerId} - ${item.description || ''}`,
                    ForeignCurrencyAmount: item.details?.karsilikDegeri ?? item.equivalentTotal ?? item.total,
                    ForeignCurrencyId: karsilikCurrencyId,
                    ForeignExchangeRate: item.details?.karsilikKuru ?? item.hesapKuru ?? 1,
                    CounterCurrencyAmount: item.total,
                    CounterCurrencyId: itemCurrencyId,
                    CounterExchangeRate: item.miktarKuru ?? 1,
                    BaseCurrencyAmount: (item.total * (item.miktarKuru ?? 1)),
                    CostAmount: 0,
                    ProfitAmount: 0,
                    CounterTransactionId: null,
                    Quantity: 0,
                    MillRate: 0,
                    LaborCost: null,
                    LaborUnit: null,
                    LaborQuantity: null,
                    IsLaborIncluded: false,
                    IsReconciled: false,
                    NetProductValue: 0,
                    TotalLaborCost: 0
                });
            }
            else if (item.itemClass === 'product') {
                // Ürün: müşteri + stok hesabı hareketi
                const stok = item.details?.stok || {};
                const stokId = item.details?.stokId || stok.stokID;
                if (!stokId) {
                    showToast('HATA: Ürün için stok ID bulunamadı, kayıt iptal edildi.', 'danger');
                    return;
                }

                const musteriType = item.isIncome ? URUN_GIRIS_ID : URUN_CIKIS_ID;
                const stokType = getOppositeHareketTipID(musteriType) || (item.isIncome ? URUN_CIKIS_ID : URUN_GIRIS_ID);

                pushDTO({
                    TransactionTypeId: musteriType,
                    AccountId: parseInt(selectedCustomerId, 10),
                    StockId: parseInt(stokId, 10),
                    Description: item.description || stok.stokAdi || '',
                    ForeignCurrencyAmount: 0,
                    ForeignCurrencyId: hasCurrencyId,
                    ForeignExchangeRate: 1,
                    CounterCurrencyAmount: item.details?.toplamHas ?? item.total ?? 0,
                    CounterCurrencyId: hasCurrencyId,
                    CounterExchangeRate: 1,
                    BaseCurrencyAmount: item.details?.toplamHas ?? item.total ?? 0,
                    CostAmount: 0,
                    ProfitAmount: 0,
                    CounterTransactionId: null,
                    Quantity: item.details?.miktar ?? 0,
                    MillRate: item.details?.milyem ?? 0,
                    LaborCost: item.details?.birimIscilik ?? 0,
                    LaborUnit: item.details?.iscilikBirimi ?? 'HAS',
                    LaborQuantity: item.details?.adet ?? 0,
                    IsLaborIncluded: item.details?.iscilikDahil ?? false,
                    IsReconciled: false,
                    NetProductValue: item.details?.urunHasDegeri ?? 0,
                    TotalLaborCost: item.details?.toplamIscilik ?? 0
                });

                // stok hesabı tarafı (stok hesabı id dinamik bulunuyor; burada önceki mantık korunur)
                const stokHesaplari = allAccounts.filter(a => a.hesapTipiID === 17);
                let dynamicStokHesapId = null;
                if (stokHesaplari.length > 0) {
                    const exactMatch = stokHesaplari.find(a => a.hesapAdi.includes((item.details?.stokGrupAdi || '').toUpperCase()));
                    dynamicStokHesapId = exactMatch ? exactMatch.hesapID : stokHesaplari[0].hesapID;
                } else {
                    const ismindeStokGecen = allAccounts.find(a => a.hesapAdi.toUpperCase().includes('STOK'));
                    if (ismindeStokGecen) dynamicStokHesapId = ismindeStokGecen.hesapID;
                }

                if (!dynamicStokHesapId) {
                    showToast(`HATA: Stok hesabı bulunamadı (${item.details?.stokGrupAdi}). Kayıt iptal edildi.`, 'danger');
                    return;
                }

                pushDTO({
                    TransactionTypeId: stokType,
                    AccountId: parseInt(dynamicStokHesapId, 10),
                    StockId: parseInt(stokId, 10),
                    Description: `Cari: ${selectedCustomerId} - ${item.description || stok.stokAdi || ''}`,
                    ForeignCurrencyAmount: 0,
                    ForeignCurrencyId: hasCurrencyId,
                    ForeignExchangeRate: 1,
                    CounterCurrencyAmount: item.details?.toplamHas ?? item.total ?? 0,
                    CounterCurrencyId: hasCurrencyId,
                    CounterExchangeRate: 1,
                    BaseCurrencyAmount: item.details?.toplamHas ?? item.total ?? 0,
                    CostAmount: 0,
                    ProfitAmount: 0,
                    CounterTransactionId: null,
                    Quantity: item.details?.miktar ?? 0,
                    MillRate: item.details?.milyem ?? 0,
                    LaborCost: item.details?.birimIscilik ?? 0,
                    LaborUnit: item.details?.iscilikBirimi ?? 'HAS',
                    LaborQuantity: item.details?.adet ?? 0,
                    IsLaborIncluded: item.details?.iscilikDahil ?? false,
                    IsReconciled: false,
                    NetProductValue: item.details?.urunHasDegeri ?? 0,
                    TotalLaborCost: item.details?.toplamIscilik ?? 0
                });
            }
            else if (item.itemClass === 'ceviri') {
                // Çeviri: iki hareket (kaynak ve hedef)
                const musteriType = item.isIncome ? CEVIRME_GIRIS_ID : CEVIRME_CIKIS_ID;
                const karsiType = getOppositeHareketTipID(musteriType) || (item.isIncome ? CEVIRME_CIKIS_ID : CEVIRME_GIRIS_ID);

                pushDTO({
                    TransactionTypeId: musteriType,
                    AccountId: parseInt(selectedCustomerId, 10),
                    StockId: null,
                    Description: item.description || '',
                    ForeignCurrencyAmount: item.total,
                    ForeignCurrencyId: allCurrencies.find(c => c.dovizKodu === item.currency)?.id ?? null,
                    ForeignExchangeRate: item.miktarKuru ?? 1,
                    CounterCurrencyAmount: item.equivalentTotal,
                    CounterCurrencyId: allCurrencies.find(c => c.dovizKodu === item.equivalentCurrency)?.id ?? null,
                    CounterExchangeRate: item.hesapKuru ?? 1,
                    BaseCurrencyAmount: (item.equivalentTotal ?? item.total) * (item.hesapKuru ?? 1),
                    CostAmount: 0,
                    ProfitAmount: 0,
                    CounterTransactionId: null,
                    Quantity: 0,
                    MillRate: 0,
                    LaborCost: null,
                    LaborUnit: null,
                    LaborQuantity: null,
                    IsLaborIncluded: false,
                    IsReconciled: false,
                    NetProductValue: 0,
                    TotalLaborCost: 0
                });

                pushDTO({
                    TransactionTypeId: karsiType,
                    AccountId: parseInt(selectedCustomerId, 10), // karşı taraf genellikle yine cari içinde ters kayıt
                    StockId: null,
                    Description: item.description || '',
                    ForeignCurrencyAmount: item.equivalentTotal,
                    ForeignCurrencyId: allCurrencies.find(c => c.dovizKodu === item.equivalentCurrency)?.id ?? null,
                    ForeignExchangeRate: item.hesapKuru ?? 1,
                    CounterCurrencyAmount: item.total,
                    CounterCurrencyId: allCurrencies.find(c => c.dovizKodu === item.currency)?.id ?? null,
                    CounterExchangeRate: item.miktarKuru ?? 1,
                    BaseCurrencyAmount: (item.equivalentTotal ?? 0) * (item.hesapKuru ?? 1),
                    CostAmount: 0,
                    ProfitAmount: 0,
                    CounterTransactionId: null,
                    Quantity: 0,
                    MillRate: 0,
                    LaborCost: null,
                    LaborUnit: null,
                    LaborQuantity: null,
                    IsLaborIncluded: false,
                    IsReconciled: false,
                    NetProductValue: 0,
                    TotalLaborCost: 0
                });
            }
        }

        console.log("SUNUCUYA GÖNDERİLEN REQUEST MODEL:", JSON.stringify(requestModel, null, 2));

        try {
            await saveReceiptToServer(requestModel);
        } catch (saveError) {
            console.error("Kaydetme sırasında hata oluştu:", saveError);
            showToast(`Kaydetme hatası: ${saveError.message}`, 'danger');
        }
    };
    const updateFisTime = () => {
        if (isTimeManuallySet || state.receiptItems.length > 0 || state.loadedFis) {
            if (timeUpdateInterval) {
                clearInterval(timeUpdateInterval);
                timeUpdateInterval = null;
            }
            return;
        }
        fisTarihiInput.value = toLocalISOString(new Date());
    };
    const startTimer = () => {
        if (timeUpdateInterval) {
            clearInterval(timeUpdateInterval);
        }
        isTimeManuallySet = false;
        updateFisTime();
        timeUpdateInterval = setInterval(updateFisTime, 60000);
    };
    const initialize = async () => {
        showLoadingOverlay();
        allActionButtons.forEach(btn => btn.disabled = true);
        fisTarihiInput.addEventListener('input', () => {
            isTimeManuallySet = true;
        });
        startTimer();


        await Promise.all([
            (async () => {
                try {
                    const base = String(Front_BASE_URL || API_BASE_URL).replace(/\/$/, '');
                    const url = `${base}/Account/GetAll`;
                    console.log('Fetching accounts from:', url);
                    const res = await fetch(url, { headers: getAuthHeaders() });
                    if (!res.ok) {
                        const text = await res.text();
                        throw new Error(`Hesap listesi alınamadı (${res.status}) - ${text}`);
                    }
                    const json = await res.json();
                    const items = Array.isArray(json) ? json : (json && Array.isArray(json.data) ? json.data : []);

                    // Gelen model { data: [ { accountId, accountName, ... } ], ... } veya doğrudan dizi olabilir.
                    allAccounts = items.map(i => ({
                        hesapID: i.accountId ?? i.accountID ?? i.hesapID ?? i.id ?? '',
                        hesapAdi: i.accountName ?? i.accountname ?? i.hesapAdi ?? '',
                        hesapTipiID: i.accountTypeId ?? i.accountTypeID ?? i.hesapTipiID ?? null,
                        hesapTipiAdi: i.accountTypeName ?? i.accountTypeName ?? i.hesapTipiAdi ?? '',
                        tezgahtar: !!(i.tezgahtar ?? i.tezgahtar),
                        isActive: ('isActive' in i) ? !!i.isActive : true,
                        telefon: i.phone ?? i.telefon ?? ''
                    }));

                    // Müşteri select'ini doldur
                    // Müşteri select'ini doldur
                    customerSelect.innerHTML = `<option value="">Hesap Seçiniz...</option>${allAccounts.map(a => `<option value="${a.hesapID}">${a.hesapAdi}</option>`).join('')}`;

                    return allAccounts;
                } catch (err) {
                    showToast(`Hesap listesi alınamadı (${err.message || err})`, 'danger');
                    console.error('Account fetch error:', err);
                    allAccounts = [];
                    customerSelect.innerHTML = `<option value=""></option>`;
                    return [];
                }
            })(),

            // Dövizleri çekerken API'nin döndürdüğü model `{"data":[...], ...}` veya doğrudan dizi olabilir.
            // Ayrıca Front_BASE_URL ile birleştirmede eksik slash nedeniyle 500 vb. hatalar alınıyordu.
            // (Replacement for the async IIFE that loads currencies)
            (async () => {
                try {
                    const base = String(Front_BASE_URL || API_BASE_URL).replace(/\/$/, '');
                    const url = `${base}/Currency/GetAll`;
                    console.log('Fetching currencies from:', url);
                    const res = await fetch(url, { headers: getAuthHeaders() });
                    if (!res.ok) {
                        const text = await res.text();
                        throw new Error(`Döviz listesi alınamadı (${res.status}) - ${text}`);
                    }
                    const json = await res.json();
                    const items = Array.isArray(json) ? json : (json && Array.isArray(json.data) ? json.data : []);

                    allCurrencies = items.map(i => ({
                        id: i.id,
                        dovizKodu: i.currencyCode ?? i.dovizKodu ?? '',
                        dovizAdi: i.currencyName ?? i.dovizAdi ?? '',
                        symbol: i.symbol ?? '',
                        ulkeParabirimi: !!(i.isNationalCurrency ?? i.IsNationalCurrency),
                        alisKuru: parseFloat((i.buyRate ?? i.BuyRate ?? i.alisKuru ?? 0).toString()) || 0,
                        satisKuru: parseFloat((i.sellRate ?? i.SellRate ?? i.satisKuru ?? 0).toString()) || 0,
                        metaCode: i.metaCode ?? i.MetaCode ?? ''
                    }));

                    // Populate select
                    currencySelect.innerHTML = `<option value=""></option>${allCurrencies.map(c => `<option value="${c.id}">${c.dovizKodu}</option>`).join('')}`;

                    // --- Yeni: Varsayılan olarak TRY seçili gelsin ---
                    const tryCurrency = allCurrencies.find(c => c.dovizKodu === 'TRY');
                    if (tryCurrency) {
                        currencySelect.value = tryCurrency.id;
                        state.activeCurrency = tryCurrency.dovizKodu;
                        state.activeCurrencyId = tryCurrency.id;
                        // trigger change handlers that depend on select.value
                        currencySelect.dispatchEvent(new Event('change'));
                    } else {
                        // Fallback: ulkeParabirimi olanı seç
                        const countryCurrency = allCurrencies.find(c => c.ulkeParabirimi === true);
                        if (countryCurrency) {
                            currencySelect.value = countryCurrency.id;
                            state.activeCurrency = countryCurrency.dovizKodu;
                            state.activeCurrencyId = countryCurrency.id;
                            currencySelect.dispatchEvent(new Event('change'));
                        }
                    }
                    // --------------------------------------------------

                    return allCurrencies;
                } catch (err) {
                    showToast(`Döviz listesi alınamadı (${err.message || err})`, 'danger');
                    console.error('Currency fetch error:', err);
                    allCurrencies = [];
                    currencySelect.innerHTML = `<option value=""></option>`;
                    return [];
                }
            })(),
            populateSelect(salespersonSelect, `${Front_BASE_URL}/Account/GetAll`, 'accountName', 'accountId', 'Tezgahtar...', item => item.tezgahtar == 1),
            //fetch(`${API_BASE_URL}/Kurlar/son`, { headers: getAuthHeaders() }).then(res => res.ok ? res.json() : Promise.reject('Kurlar alınamadı')).then(data => allExchangeRates = data).catch(err => showToast(err.toString(), 'danger')),
            //populateSelect(document.createElement('select'), `${API_BASE_URL}/hesaplar`, 'hesapAdi', 'hesapID').then(data => allAccounts = data),
            // replace populateSelect(...) call with explicit fetch + response.data handling
            (async () => {
                try {
                    const base = String(Front_BASE_URL || API_BASE_URL).replace(/\/$/, '');
                    const url = `${base}/Stock/GetAll`;
                    const res = await fetch(url, { headers: getAuthHeaders() });
                    if (!res.ok) {
                        const txt = await res.text().catch(() => '');
                        throw new Error(`Stok listesi alınamadı (${res.status}) - ${txt}`);
                    }
                    const json = await res.json();
                    const items = Array.isArray(json) ? json : (json && Array.isArray(json.data) ? json.data : []);

                    // Normalize API response into the frontend shape expected by product form logic
                    allStoklar = items.map(s => ({
                        stokID: s.id ?? s.stockId ?? s.stokID ?? 0,
                        stokAdi: s.stockName ?? s.stockName ?? s.stokAdi ?? '',
                        milyem: parseFloat(s.millRate ?? s.MillRate ?? s.milyem ?? 0) || 0,
                        birim: s.unitName ?? s.UnitName ?? s.birim ?? '',
                        iscilikBirimiKodu: s.laborUnit ?? s.laborUnit ?? s.laborUnitName ?? s.laborUnit ?? '',
                        stokGrupAdi: s.stockGroupName ?? s.stockGroupName ?? s.stokGrupAdi ?? '',
                        stokTipAdi: s.stockTypeName ?? s.stockTypeName ?? s.stokTipAdi ?? '',
                        stokTipID: s.stockTypeId ?? s.stockTypeId ?? null,
                        stokGrupID: s.stockGroupId ?? s.stockGroupId ?? null,
                        raw: s
                    }));
                    return allStoklar;
                } catch (err) {
                    console.error('fetch Stock/GetAll error:', err);
                    allStoklar = [];
                    return [];
                }
            })()
        ]);
        nationalCurrency = allCurrencies.find(c => c.ulkeParabirimi === true);
        if (!nationalCurrency) {
            console.warn("API'den 'ulkeParabirimi = true' olan bir döviz bulunamadı. 'TRY' varsayılıyor.");
            nationalCurrency = allCurrencies.find(c => c.dovizKodu === 'TRY') || { dovizKodu: 'TRY', id: 1 }; // Acil durum yedeği
        }

        originalCustomerOptions = Array.from(customerSelect.options).map(opt => ({ text: opt.text, value: opt.value }));
        const financialAccountTypeIDs = [5, 6, 7];
        allFinancialAccounts = allAccounts.filter(a => a.hesapTipiID && financialAccountTypeIDs.includes(a.hesapTipiID));
        // önce satışçı SlimSelect
        // replace previous SlimSelect initializations with explicit placeholder + safe-set
        salespersonSlimSelect = new SlimSelect({
            select: '#salesperson-select',
            placeholder: 'Tezgahtar Seç',
            searchPlaceholder: 'Ara',
            allowDeselect: true
        });

        customerSlimSelect = new SlimSelect({
            select: '#customer-select',
            placeholder: 'Hesap Seçiniz...',
            searchPlaceholder: 'Hesap Ara...',
            allowDeselect: true,
            addable: function (value) {
                showToast(`'${value}' adlı yeni hesap eklendi (simülasyon).`, 'success');
                const newCustomer = { text: value, value: `new_${Date.now()}` };
                originalCustomerOptions.push(newCustomer);
                return newCustomer;
            },
            onChange: (info) => {
                try {
                    // Robust seçimi çözümle
                    let raw = '';
                    try { raw = customerSlimSelect.getSelected(); } catch (e) { raw = ''; }

                    let resolvedId = '';
                    if (Array.isArray(raw)) {
                        resolvedId = raw.length > 0 ? String(raw[0]) : '';
                    } else if (raw === null || raw === undefined) {
                        resolvedId = '';
                    } else if (typeof raw === 'object') {
                        resolvedId = raw.value ? String(raw.value) : '';
                    } else {
                        resolvedId = String(raw || '').trim();
                    }

                    // Native select ile senkronize et (kullanıcı "temizledi" ise '' atanır)
                    if (customerSelect) {
                        try {
                            customerSelect.value = resolvedId || '';
                            customerSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        } catch (err) {
                            console.warn('customerSelect sync failed:', err);
                        }
                    }

                    // Ardından görünümü güncelle
                    updateActionButtonsVisibility();

                    // Eğer seçim boşsa orta paneli başlangıç durumuna al
                    if (!resolvedId) {
                        showDefaultMessage();
                        return;
                    }

                    if (state.operationType === 'cari') {
                        setTimeout(() => fetchAndRenderCariBakiye(), 20);
                    }
                } catch (err) {
                    console.error('customerSlimSelect onChange error:', err);
                }
            }
        });

        // --- ENSURE: native select ve SlimSelect gösterimi için kesin placeholder atama (robust retry)
        try {
            // Force native select to empty placeholder option
            if (customerSelect) {
                // Ensure an empty option exists
                let emptyOpt = customerSelect.querySelector('option[value=""]');
                if (!emptyOpt) {
                    emptyOpt = document.createElement('option');
                    emptyOpt.value = '';
                    emptyOpt.textContent = 'Hesap Seçiniz...';
                    customerSelect.insertBefore(emptyOpt, customerSelect.firstChild);
                }
                // Select the empty option natively
                customerSelect.value = '';
                // mark first option selected explicitly to be safe for old browsers
                customerSelect.selectedIndex = Array.from(customerSelect.options).findIndex(o => o.value === '');
                customerSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }

            // Retry helper to ask SlimSelect to display placeholder
            const ensureSlimShowsPlaceholder = () => {
                try {
                    if (!customerSlimSelect) return false;
                    // Prefer setSelected API
                    if (typeof customerSlimSelect.setSelected === 'function') {
                        customerSlimSelect.setSelected('');
                        return true;
                    }
                    // Alternative APIs some versions expose
                    if (typeof customerSlimSelect.set === 'function') {
                        customerSlimSelect.set('');
                        return true;
                    }
                    if (typeof customerSlimSelect.setData === 'function' && Array.isArray(originalCustomerOptions) && originalCustomerOptions.length > 0) {
                        // Re-set data (keeps options) and clear selection
                        customerSlimSelect.setData(originalCustomerOptions);
                        if (typeof customerSlimSelect.setSelected === 'function') {
                            customerSlimSelect.setSelected('');
                            return true;
                        }
                    }
                } catch (e) {
                    console.warn('ensureSlimShowsPlaceholder error', e);
                }
                return false;
            };

            // Try immediately and a few times after (DOM/SLimSelect race conditions)
            let attempts = 0;
            const maxAttempts = 8;
            const interval = setInterval(() => {
                attempts++;
                const ok = ensureSlimShowsPlaceholder();
                if (ok || attempts >= maxAttempts) {
                    clearInterval(interval);
                    // Final guard: make sure action-buttons container gets normalized after placeholder
                    setTimeout(() => updateActionButtonsVisibility && updateActionButtonsVisibility(), 20);
                }
            }, 60);
            // Also call once immediately
            ensureSlimShowsPlaceholder();
        } catch (err) {
            console.warn('Placeholder enforcement failed:', err);
        }

        // Polyfill / shim: bazı SlimSelect sürümlerinde getSelected() yok olabilir.
        // Burada güvenli bir fallback ekliyoruz; önce SlimSelect'in kendi API'lerini dener,
        // bulamazsa native select elementinden value/selectedOptions döner.
        const ensureGetSelected = (slimInstance, selector) => {
            if (!slimInstance) return;
            if (typeof slimInstance.getSelected === 'function') return;
            const nativeSelect = selector ? document.querySelector(selector) : null;
            slimInstance.getSelected = function () {
                try {
                    if (typeof this.get === 'function') {
                        const r = this.get();
                        if (r !== undefined) return r;
                    }
                    if (typeof this.selected === 'function') {
                        const r2 = this.selected();
                        if (r2 !== undefined) return r2;
                    }
                    if (nativeSelect) {
                        if (nativeSelect.multiple) return Array.from(nativeSelect.selectedOptions).map(o => o.value);
                        return nativeSelect.value;
                    }
                } catch (e) {
                    console.warn('getSelected shim error', e);
                }
                return '';
            };
        };

        ensureGetSelected(customerSlimSelect, '#customer-select');
        ensureGetSelected(salespersonSlimSelect, '#salesperson-select');

        // Ensure SlimSelect shows placeholder (safe, checks available API)
        try {
            const nativeCustomerSelect = document.getElementById('customer-select');
            if (nativeCustomerSelect) {
                nativeCustomerSelect.value = '';
                nativeCustomerSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }

            if (typeof customerSlimSelect !== 'undefined') {
                if (typeof customerSlimSelect.set === 'function') customerSlimSelect.set('');
                else if (typeof customerSlimSelect.setSelected === 'function') customerSlimSelect.setSelected('');
                else if (typeof customerSlimSelect.setData === 'function') {
                    // keep existing data but force-a blank selected state
                    customerSlimSelect.setData(originalCustomerOptions);
                    try { customerSlimSelect.set(''); } catch (e) { /* ignored */ }
                }
            }
        } catch (err) {
            console.warn('Could not enforce customer-select placeholder:', err);
        }
        // ensure SlimSelect shows the "Hesap Seçiniz..." placeholder on initial load
        try {
            const nativeCustomerSelect = document.getElementById('customer-select');
            if (nativeCustomerSelect) {
                // make sure the native select has the empty placeholder selected
                nativeCustomerSelect.value = '';
                nativeCustomerSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }

            if (typeof customerSlimSelect !== 'undefined' && customerSlimSelect && typeof customerSlimSelect.setSelected === 'function') {
                // force SlimSelect to display placeholder
                customerSlimSelect.setSelected('');
            }
        } catch (err) {
            console.warn('Could not enforce customer-select placeholder:', err);
        }
        // Normalize action-buttons container immediately after SlimSelect init
        (function normalizeActionButtonsInitialState() {
            const container = document.getElementById('action-buttons-container');
            if (!container) return;

            // Remove old opacity that may be hard-coded in markup
            container.classList.remove('opacity-50', 'pointer-events-none');

            // If no customer is selected yet, apply dim-buttons so border stays visible
            let sel = '';
            try { sel = customerSlimSelect && typeof customerSlimSelect.getSelected === 'function' ? customerSlimSelect.getSelected() : (customerSelect ? customerSelect.value : ''); }
            catch (e) { sel = customerSelect ? customerSelect.value : ''; }
            const cid = Array.isArray(sel) ? sel[0] : sel;

            if (!cid || cid === '') {
                container.classList.add('dim-buttons');
                // also disable native buttons until selection is made
                container.querySelectorAll('.action-btn').forEach(b => b.disabled = true);
            } else {
                container.classList.remove('dim-buttons');
                container.querySelectorAll('.action-btn').forEach(b => b.disabled = false);
            }
        })();
        window.customerSlimSelect = customerSlimSelect;
        window.salespersonSlimSelect = salespersonSlimSelect;

        // Başlangıçta overlay varsa gizle (overlay DOM'da görünürse üst kutuyu kapatır)
        const actionOverlay = document.getElementById('action-buttons-overlay');
        if (actionOverlay) {
            actionOverlay.classList.add('hidden');
            actionOverlay.classList.remove('opacity-0', 'pointer-events-none');
        }
        // new: server-side filter fetch for fis list (call Receipt/GetAll POST)
        const fetchFisListByFilters = async (e) => {
            if (e && typeof e.preventDefault === 'function') e.preventDefault();

            fisListContent.innerHTML = '<div class="text-center p-8"><i class="fas fa-spinner fa-spin text-3xl text-gray-400"></i></div>';

            try {
                const isCari = state.operationType === 'cari';

                // read selection robustly (SlimSelect or native)
                let rawSelected = getSlimSelectedValue(fisListCustomerFilterSlimSelect, 'fis-list-customer-filter');
                if (Array.isArray(rawSelected)) rawSelected = rawSelected.length ? rawSelected[0] : '';
                const selected = String(rawSelected ?? '').trim();

                let accountId = 0;
                if (selected && selected.toLowerCase() !== 'all' && selected !== '') {
                    const p = parseInt(selected, 10);
                    if (!isNaN(p)) accountId = p;
                }

                const payload = {
                    IsCari: isCari,
                    AccountId: accountId,
                    StartDate: `${fisListStartDate.value}T00:00:00`,
                    EndDate: `${fisListEndDate.value}T23:59:59`
                };

                const response = await fetch(`${API_BASE_URL}/Receipt/GetAll`, {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const txt = await response.text().catch(() => '');
                    throw new Error(`Fiş listesi alınamadı (${response.status}) - ${txt}`);
                }

                const result = await response.json();
                const list = (result && result.data) ? result.data : [];

                // normalize to frontend model and render
                state.fisList = list.map(r => ({
                    fisID: r.id,
                    fisNo: r.receiptNumber,
                    tarih: r.receiptDate,
                    cariHesapID: r.accountId,
                    raw: r
                }));

                // render server-fetched list
                renderFisList(state.fisList);
            } catch (error) {
                fisListContent.innerHTML = `<p class="text-center text-red-500 p-8">${error.message}</p>`;
                console.error('fetchFisListByFilters error:', error);
            }
        };
        // Son bir kez görünümü düzenle
        updateActionButtonsVisibility();
        const filterCustomerOptions = [{ text: 'Tüm Hesaplar', value: 'all' }, ...originalCustomerOptions.filter(opt => opt.value)];
        fisListCustomerFilterSlimSelect = new SlimSelect({
            select: '#fis-list-customer-filter',
            settings: { placeholderText: 'Hesap Seçiniz...', searchPlaceholder: 'Ara...' },
            data: filterCustomerOptions
        });

        try { ensureGetSelected(fisListCustomerFilterSlimSelect, '#fis-list-customer-filter'); } catch (e) { console.warn('ensureGetSelected failed for fisListCustomerFilterSlimSelect', e); }
        // Mevcut kod (initialize fonksiyonu içinde):
        customerSelect.addEventListener('change', () => {
            // Önce buton görünümünü güncelle
            updateActionButtonsVisibility();

            // Eğer seçili hesap boşsa varsayılan ekranı göster ve bakiye çağırma/işleme yapma
            const val = String(customerSelect.value ?? '').trim();
            if (!val) {
                showDefaultMessage();
                return;
            }

            if (state.operationType === 'cari') {
                fetchAndRenderCariBakiye();
            }
        });

        operationTypeToggle.addEventListener('change', (e) => {
            if (state.receiptItems.length > 0) {
                showConfirmationModal(
                    'Yapılan işlemler kaybolacak. Devam etmek istiyor musunuz?',
                    () => { updateUIForOperationType(); },
                    () => { e.target.checked = !e.target.checked; }
                );
            } else {
                updateUIForOperationType();
            }
        });

        currencySelect.addEventListener('change', updateActiveCurrency);

        // Ekstre modalı açıldığında tarih aralığını ayarla
        ekstreButton.addEventListener('click', () => {
            const selectedValue = customerSlimSelect.getSelected();
            const hesapId = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;

            if (!hesapId || hesapId === '') {
                showToast('Lütfen işlem yapmak için bir hesap seçiniz.', 'warning');
                return;
            }

            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

            ekstreBitis.value = getLocalDateString(today);
            ekstreBaslangic.value = getLocalDateString(firstDayOfMonth);

            ekstreModal.classList.remove('hidden');
            fetchAndRenderEkstre();
        });
        ekstreGetirButton.addEventListener('click', fetchAndRenderEkstre);

        salesListButton.addEventListener('click', fetchAndShowFisList);
        fisListFilterButton.addEventListener('click', fetchFisListByFilters);
        fisListModalCloseButton.addEventListener('click', () => {
            fisListModal.classList.add('hidden');

            // Sadece önizlemeyi temizle, düzenleme modunu kapat
            state.receiptItems = [];
            state.selectedItemIndex = -1;
            state.loadedFis = null;
            state.isEditModeActive = false; // YENİ EKLENDİ
            renderReceipt();
            showDefaultMessage();
            if (window.switchMobileTab) window.switchMobileTab('fis');

            fetchAndRenderCariBakiye();
            updateMainButtons(); // Butonların durumunu güncelle
        });
        fisListModal.querySelector('.modal-bg').addEventListener('click', () => fisListModal.classList.add('hidden'));

        fisListContent.addEventListener('click', (e) => {
            const editButton = e.target.closest('.edit-fis-btn');
            const itemRow = e.target.closest('.fis-list-item');

            // Öncelikle Düzenle butonuna mı tıklandı diye kontrol et
            if (editButton) {
                const fisId = editButton.dataset.fisId;
                if (fisId) {
                    // DÜZELTME: Önce fark kontrolü yap
                    if (checkSatisFarki()) {
                        return; // Fark varsa düzenlemeye geçme
                    }
                    loadFisToScreen(fisId, true); // Düzenleme modunda yükle
                }
            }
            // Eğer düzenle butonuna tıklanmadıysa, satırın kendisine mi tıklandı diye bak
            else if (itemRow) {
                const fisId = itemRow.dataset.fisId;
                if (fisId) {
                    loadFisToScreen(fisId, false); // Önizleme modunda yükle
                }
            }
        });

        ekstreModalCloseButton.addEventListener('click', () => {
            // 1. Ekstre modalını gizle
            ekstreModal.classList.add('hidden');

            // 2. Müşterinin güncel bakiye durumunu sunucudan yeniden çek ve
            //    "Devir/Giren/Çıkan/Kalan" tablosunu bu yeni bilgiyle güncelle
            fetchAndRenderCariBakiye();
        });

        ekstreContent.addEventListener('change', (e) => {
            if (e.target && e.target.id.startsWith('mutabakat-')) {
                const hareketId = e.target.id.split('-')[1];
                const isMutabik = e.target.checked;
                updateMutabakatStatus(hareketId, isMutabik);
            }
        });

        ekstreContent.addEventListener('click', (e) => {
            // Önce "Düzenle" düğmesine mi tıklandı diye kontrol et
            const editButton = e.target.closest('.edit-ekstre-fis-btn');
            if (editButton && editButton.dataset.fisId) {
                const fisIdToEdit = editButton.dataset.fisId;
                loadFisToScreen(fisIdToEdit, true);
                ekstreModal.classList.add('hidden');
                return;
            }

            // Eğer Düzenle düğmesine tıklanmadıysa, satır seçme/bakiye gösterme mantığına devam et
            const row = e.target.closest('.ekstre-item');
            const currentlySelected = ekstreContent.querySelector('.selected-ekstre-row');

            if (currentlySelected) {
                currentlySelected.classList.remove('selected-ekstre-row');
            }

            if (row && row.dataset.balances) {
                if (row === currentlySelected) { // Zaten seçili satıra tekrar tıklandıysa seçimi kaldır
                    renderBakiyeOzeti(lastFetchedEkstreFinalBalance);
                } else {
                    row.classList.add('selected-ekstre-row');
                    try {
                        const balancesForThisRow = JSON.parse(row.dataset.balances);
                        renderBakiyeOzeti(balancesForThisRow);
                    } catch (error) {
                        console.error('Satır bakiyesi parse edilemedi:', error);
                        renderBakiyeOzeti(lastFetchedEkstreFinalBalance);
                    }
                }
            } else { // Boş bir alana tıklandıysa
                renderBakiyeOzeti(lastFetchedEkstreFinalBalance);
            }
        });

        allActionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedValue = customerSlimSelect.getSelected();
                const customerId = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;
                if (!customerId || customerId === '') {
                    showToast('Lütfen işlem yapmak için bir hesap seçiniz.', 'warning');
                    return;
                }
                const panelType = btn.id.replace('btn-', '');

                const performAction = () => {
                    isFormDirty = false;
                    if (panelType.startsWith('urun-')) {
                        if (state.operationType === 'cari') {
                            handleProductPanelChange(panelType === 'urun-alis');
                        } else {
                            showToast('Bu özellik henüz hazırlanıyor.', 'info');
                            return;
                        }
                    } else {
                        handlePanelChange(panelType);
                    }

                    if (window.openMobileModal) {
                        const labelSpan = btn.querySelector('span');
                        window.openMobileModal(labelSpan ? labelSpan.textContent : 'İşlem Detayı');
                    }
                };

                if (state.selectedItemIndex > -1 && isFormDirty) {
                    showConfirmationModal('Kaydedilmemiş değişiklikleriniz var. Değişiklikler kaybolacak. Devam edilsin mi?', performAction);
                } else {
                    performAction();
                }
            });
        });

        receiptLog.addEventListener('click', (e) => {
            console.log("Receipt log tıklandı"); // Debug için
            const itemDiv = e.target.closest('.receipt-item');
            if (!itemDiv) {
                console.log("Tıklanan öğe receipt-item değil");
                return;
            }

            const index = parseInt(itemDiv.dataset.index, 10);
            if (isNaN(index)) {
                console.log("Geçersiz index");
                return;
            }

            const performSwitch = () => {
                console.log("performSwitch başladı, index:", index);
                isFormDirty = false;

                // Seçili indexi güncelle
                state.selectedItemIndex = index;
                const itemToEdit = state.receiptItems[index];
                console.log("Düzenlenecek item:", itemToEdit);

                // Tüm işlem tipleri için handlePanelChange kullan
                if (itemToEdit.itemClass === 'product') {
                    handleProductPanelChange(itemToEdit.isIncome, itemToEdit);
                } else {
                    // Açık hesap dahil tüm diğer işlemler için handlePanelChange kullan
                    handlePanelChange(itemToEdit.type, itemToEdit);
                }

                renderReceipt();
            };

            if (state.selectedItemIndex > -1 && isFormDirty) {
                showConfirmationModal(
                    'Kaydedilmemiş değişiklikleriniz var. Değişiklikler kaybolacak. Devam edilsin mi?',
                    performSwitch
                );
            } else {
                performSwitch();
            }
        });


        deleteButton.addEventListener('click', () => {
            if (state.selectedItemIndex > -1) {
                // 1. Kalemi listeden sil
                state.receiptItems.splice(state.selectedItemIndex, 1);

                // 2. Fişi ve toplamları GÜNCEL LİSTEYE göre yeniden çiz
                renderReceipt();

                // 3. Orta paneli temizle ve başlangıç durumuna getir
                showDefaultMessage();
                if (window.switchMobileTab) window.switchMobileTab('fis');
            }
        });

        mainResetButton.addEventListener('click', () => {
            const doReset = () => {
                resetTransaction();
                if (window.switchMobileTab) window.switchMobileTab('islem');
            };
            if (state.receiptItems.length > 0 || state.loadedFis) {
                showConfirmationModal('Tüm değişiklikler iptal edilecek ve yeni bir işlem başlayacak. Emin misiniz?', doReset);
            } else {
                doReset();
            }
        });

        mainDeleteButton.addEventListener('click', () => {
            if (!state.loadedFis) return;
            showConfirmationModal(
                `"${state.loadedFis.fisNo}" numaralı fişi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`,
                () => { performDelete(state.loadedFis.fisID); }
            );
        });

        const checkSatisFarki = () => {
            if (state.operationType === 'satis') {
                const fark = parseFormattedNumber(farkToplamSpan.textContent);
                if (fark !== 0) {
                    showToast(`Satışta Giren ile Çıkan aynı değerde olmalıdır. Mevcut Fark: ${formatCurrency(fark)} ${state.activeCurrency}`, 'warning');
                    return true; // Fark var
                }
            }
            return false; // Fark yok veya cari mod
        };

        mainSaveButton.addEventListener('click', () => {
            if (state.receiptItems.length === 0) {
                return showToast('Fiş boş, kaydedilecek bir işlem yok.', 'warning');
            }

            const selectedValue = customerSlimSelect.getSelected();
            const selectedCustomerId = Array.isArray(selectedValue) ? selectedValue[0] : selectedValue;
            if (!selectedCustomerId || selectedCustomerId === '') {
                return showToast('Lütfen bir müşteri veya cari hesap seçiniz.', 'warning');
            }

            const fisTarihiValue = fisTarihiInput.value;
            if (!fisTarihiValue) {
                return showToast('Lütfen geçerli bir fiş tarihi seçin.', 'warning');
            }

            // SATIŞ modunda fark kontrolü yap
            if (checkSatisFarki()) {
                return; // Fark varsa işlemi durdur
            }

            // Fark yoksa veya CARİ modundaysa normal akışa devam et
            const formattedDate = new Date(fisTarihiValue).toLocaleString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            showConfirmationModal(
                `İşlem, "${formattedDate}" tarihi ile ${state.loadedFis ? 'güncellenecektir' : 'kaydedilecektir'}. Devam etmek istiyor musunuz?`,
                () => { performSave(fisTarihiValue); }
            );
        });

        updateUIForOperationType();
        showDefaultMessage();
        if (window.switchMobileTab) window.switchMobileTab('fis');
        allActionButtons.forEach(btn => btn.disabled = false);
        hideLoadingOverlay();
    };
    initialize();
});

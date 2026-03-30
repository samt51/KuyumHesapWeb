/* home_dashboard.js - Home\Dashboard.cshtml */

document.addEventListener('DOMContentLoaded', async () => {
    // localStorage token kullanılmıyor (geçici)
    const API_BASE_URL = window.API_BASE_URL;
    const CURE_GET_LATEST_URL_RAW = window.CURE_GET_LATEST_URL || '/Cure/GetLatestCure';
    const CURE_GET_LATEST_URL = window.CURE_GET_LATEST_URL || CURE_GET_LATEST_URL_RAW || '/Cure/GetLatestCure';
    const tickerContent = document.getElementById('tickerContent');
    const toastContainer = document.getElementById('toast-container');
    const refreshButton = document.getElementById('refresh-rates-btn');

    console.log(window.API_BASE_URL);

    // global kurlar dizisi — diğer fonksiyonların erişebilmesi için burada tanımlandı
    let kurlar = [];
    window.kurlar = kurlar;

    // ─── JWT parse (şimdilik pasif) ───────────────────────────────────────────
    let kullaniciAdi = 'Samet';

    // getAuthHeaders artık Authorization göndermiyor; sadece Content-Type
    const getAuthHeaders = () => ({
        'Content-Type': 'application/json'
    });

    // --- HIZLI DÜZELTME: Sayfada görünmesini istemediğimiz ekstra "Kasalar" bölümünü kaldır ---
    const removeDuplicateKasalarSection = () => {
        try {
            // Başlık metni tam olarak 'Kasalar' olan H1..H6 etiketlerini hedefle
            document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => {
                if (h.textContent && h.textContent.trim() === 'Kasalar' && !h.closest('#kasalar-card')) {
                    // Başlığı gizle
                    h.style.display = 'none';
                    // Eğer başlığın hemen altında Nakit Toplam veya Detaylar için tıklayın gibi öğeler varsa onları da gizle
                    let next = h.nextElementSibling;
                    for (let i = 0; i < 4 && next; i++, next = next.nextElementSibling) {
                        const txt = (next.textContent || '').trim();
                        if (!txt) {
                            next.style.display = 'none';
                            continue;
                        }
                        if (txt.includes('Nakit Toplam') || txt.includes('Detaylar için tıklayın') || txt.startsWith('Detaylar için')) {
                            next.style.display = 'none';
                        } else {
                            break;
                        }
                    }
                }
            });

            // Ek güvenlik: tek başına "Detaylar için tıklayın" içeren p/span/div'leri gizle
            document.querySelectorAll('p,div,span').forEach(el => {
                const txt = (el.textContent || '').trim();
                if (txt.startsWith('Detaylar için tıklayın')) {
                    // Ama bu element #kasalar-card içinde ise dokunma
                    if (!el.closest('#kasalar-card')) el.style.display = 'none';
                }
            });
        } catch (e) {
            console.warn('[home_dashboard] removeDuplicateKasalarSection hata:', e);
        }
    };
    // --------------------------------------------------------------------------------

    // ─── Karşılama metni ─────────────────────────────────────────────────────
    const renderWelcome = async () => {
        let dbAdi = 'KuyumHesap';
        const el = document.getElementById('welcome-text');
        if (el) {
            el.innerHTML = `Merhaba <span class="text-green-600 font-bold">${kullaniciAdi}</span>, <span class="text-gray-700">${dbAdi}</span> şirketine hoş geldin!`;
        }
    };

    // ─── Toast ───────────────────────────────────────────────────────────────
    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `p-4 rounded-lg text-white shadow-lg ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.transition = 'opacity 0.5s ease';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    };

    const syncTicker = (options = {}) => {
        try {
            const container = document.querySelector('.scrolling-ticker-container');
            const content = document.querySelector('.scrolling-ticker-content');
            const sidebar = document.getElementById('sidebar-menu');

            if (!container || !content) return;

            const sidebarWidth = sidebar ? sidebar.offsetWidth : 0;
            document.documentElement.style.setProperty('--ticker-left-offset', `${sidebarWidth}px`);

            const scrollW = content.scrollWidth || content.offsetWidth;
            const visibleW = container.clientWidth || window.innerWidth;
            const speedPxPerSec = options.speedPxPerSec || 35;
            const minDuration = options.minDuration || 60;
            const distance = Math.max(scrollW, visibleW * 2);

            let durationSec = Math.max(minDuration, Math.ceil(distance / speedPxPerSec));
            document.documentElement.style.setProperty('--marquee-duration', `${durationSec}s`);
        } catch (e) {
            console.warn('syncTicker hata:', e);
        }
    };

    const scheduleSyncTicker = () => {
        syncTicker();
        setTimeout(syncTicker, 150);
        setTimeout(syncTicker, 600);
    };

    window.addEventListener('resize', () => {
        syncTicker();
    });

    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', () => {
            setTimeout(syncTicker, 350);
        });
    }

    const sidebar = document.getElementById('sidebar-menu');
    if (sidebar) {
        sidebar.addEventListener('mouseenter', () => {
            setTimeout(syncTicker, 220);
        });
        sidebar.addEventListener('mouseleave', () => {
            setTimeout(syncTicker, 220);
        });
    }

    // ─── Döviz Ticker ────────────────────────────────────────────────────────
    const fetchAndRenderTicker = async () => {
        try {
            const response = await fetch(CURE_GET_LATEST_URL, {
                method: 'GET',
                headers: getAuthHeaders(),
                credentials: 'same-origin' // HttpOnly cookie ile auth için
            });

            if (response.status === 401) {
                console.warn('[home_dashboard] 401 from CURE_GET_LATEST_URL — cookie/auth eksik veya sunucu reddetti');
                return;
            }
            if (!response.ok) return;

            const payload = await response.json();
            const parsedKurlar = Array.isArray(payload) ? payload : (payload && Array.isArray(payload.data) ? payload.data : []);

            kurlar = parsedKurlar;
            window.kurlar = kurlar;
            console.log('[home_dashboard] kurlar set:', kurlar);

            if (kurlar.length === 0) return;

            const formatOptions = { style: 'decimal', minimumFractionDigits: 4, maximumFractionDigits: 4 };

            let allItemsHTML = kurlar.map(kur => {
                const code = kur.currencyCode ?? kur.dovizKodu ?? '';
                const buy = typeof kur.buyRate === 'number' ? kur.buyRate : kur.alisKuru;
                const sell = typeof kur.sellRate === 'number' ? kur.sellRate : kur.satisKuru;
                const previousClose = typeof kur.previousClosingRate === 'number' ? kur.previousClosingRate : kur.oncekiKapanisKuru;

                let changeHtml = `<span class="ml-2 text-xs text-gray-400">--</span>`;
                if (typeof previousClose === 'number' && previousClose > 0 && typeof sell === 'number') {
                    const pct = ((sell - previousClose) / previousClose) * 100;
                    if (isFinite(pct)) {
                        const cls = pct >= 0 ? 'positive' : 'negative';
                        const icon = pct >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
                        changeHtml = `<span class="percentage-change ${cls} ml-2 text-xs"><i class="fas ${icon}"></i> ${pct.toFixed(2)}%</span>`;
                    }
                }

                const buyText = (typeof buy === 'number') ? buy.toLocaleString('tr-TR', formatOptions) : '--';
                const sellText = (typeof sell === 'number') ? sell.toLocaleString('tr-TR', formatOptions) : '--';

                return `<div style="display:inline-flex;align-items:center;border:1px solid var(--ticker-item-border);border-radius:6px;padding:6px 16px;margin-right:16px;background-color:#4a5568;color:white;font-size:0.875rem;white-space:nowrap;">
                    <span class="font-bold">${code}</span>
                    <span class="mx-2 text-gray-400">|</span>
                    <span class="text-gray-300">ALIŞ:</span>
                    <span class="font-semibold text-white ml-1">${buyText}</span>
                    ${changeHtml}
                    <span class="mx-2 text-gray-400">|</span>
                    <span class="text-gray-300">SATIŞ:</span>
                    <span class="font-semibold text-white ml-1">${sellText}</span>
                    ${changeHtml}
                </div>`;
            }).join('');

            tickerContent.innerHTML = allItemsHTML + allItemsHTML;
            scheduleSyncTicker();
        } catch (error) {
            console.error('Ticker hatası:', error);
        }
    };

    const updateRatesAndTicker = async (showSuccessToast = false) => {
        const icon = refreshButton.querySelector('i');
        icon.classList.add('fa-spin');
        refreshButton.disabled = true;
        try {
            const response = await fetch(`${API_BASE_URL}/Cure/CureUpdate`, {
                method: 'POST',
                headers: getAuthHeaders(),
                credentials: 'same-origin'
            });

            if (response.status === 401) {
                console.warn('[home_dashboard] 401 on CureUpdate — cookie/auth eksik veya sunucu reddetti');
                return;
            }

            const result = await response.json();

            if (response.ok) {
                if (showSuccessToast) showToast(result.message || 'Kurlar güncellendi.');
                await fetchAndRenderTicker();
            } else {
                showToast(result.message || 'Kur güncelleme başarısız.', 'danger');
            }
        } catch (error) {
            showToast('Ağ hatası oluştu.', 'danger');
        } finally {
            icon.classList.remove('fa-spin');
            refreshButton.disabled = false;
        }
    };

    // ─── Kasalar - HAS Toplamı ───────────────────────────────────────────────
    const fetchKasalar = async () => {
        const ozet = document.getElementById('kasalar-ozet');
        if (!ozet) return;

        const kullanilanKurlar = window.kurlar || [];

        try {
            const apiBaseRaw = (window.API_BASE_URL || '').toString();
            const apiBase = apiBaseRaw ? apiBaseRaw.replace(/\/+$/, '') : '';
            const url = apiBase ? `${apiBase}/Report/GetCashReport` : '/Report/GetCashReport';

            console.log('[home_dashboard] Fetch GetCashReport ->', url);

            const resEkstre = await fetch(url, {
                method: 'GET',
                headers: getAuthHeaders(),
                mode: 'cors',
                credentials: 'same-origin'
            });

            console.log('[home_dashboard] GetCashReport status:', resEkstre.status);

            if (!resEkstre.ok) {
                console.warn('GetCashReport response not ok:', resEkstre.status, await resEkstre.text().catch(() => ''));
                ozet.innerHTML = '<span class="text-xs text-red-400">Yüklenemedi</span>';
                return;
            }

            const payload = await resEkstre.json();
            const data = (payload && payload.data) ? payload.data : payload;

            const kasaBakiyeler = {};

            if (Array.isArray(data.devredenBakiyeler)) {
                data.devredenBakiyeler.forEach(b => {
                    const code = b.dovizKodu ?? b.currencyCode ?? b.birim ?? 'UNKNOWN';
                    const bakiye = Number(b.bakiye ?? b.amount ?? 0) || 0;
                    kasaBakiyeler[code] = (kasaBakiyeler[code] || 0) + bakiye;
                });
            }

            if (Array.isArray(data.hareketler)) {
                data.hareketler.forEach(h => {
                    const birim = h.balanceCurrency ?? h.unit ?? h.counterUnit ?? h.birim ?? h.karsilikBirim ?? 'UNKNOWN';
                    const sonBakiye = Number(
                        h.finalBalance ??
                        h.baseCurrencyAmount ??
                        h.counterQuantity ??
                        h.balanceEffectAmount ??
                        h.quantity ??
                        0
                    ) || 0;
                    kasaBakiyeler[birim] = sonBakiye;
                });
            }

            let toplamHas = 0;
            kasaDetaylar = [];
            const kasaBakiyeListesi = [];

            for (const [birim, miktar] of Object.entries(kasaBakiyeler)) {
                if (!miktar || miktar === 0) continue;
                toplamHas += 0; // HAS hesaplama şimdilik pasif
                kasaBakiyeListesi.push({ birim, miktar });
            }

            kasaDetaylar.push({
                ad: 'Kasalar',
                bakiyeler: kasaBakiyeListesi,
                hasToplamı: data.totalHas
            });

            const fmt = v => v.toLocaleString('tr-TR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
            const renk = data.totalHas >= 0 ? 'text-green-600' : 'text-red-600';
            ozet.innerHTML = `
            <span class="text-2xl font-extrabold font-mono ${renk}">${fmt(data.totalHas)}</span>
            <span class="text-sm font-semibold text-gray-400 mb-0.5">HAS</span>
        `;
        } catch (e) {
            console.error('Kasalar yüklenemedi (fetch):', e);
            if (ozet) ozet.innerHTML = '<span class="text-xs text-red-400">Yüklenemedi</span>';
        }
    };

    // ─── Kasalar Modal ──────────────────────────────────────────────────────
    const kasalarModal = document.getElementById('kasalar-modal');
    const kasalarModalBody = document.getElementById('kasalar-modal-body');
    const kasalarCard = document.getElementById('kasalar-card');
    const kasalarModalClose = document.getElementById('kasalar-modal-close');
    const kasalarModalBg = document.getElementById('kasalar-modal-bg');

    // Ensure modal starts hidden (robust against missing/overriding CSS)
    if (kasalarModal) {
        kasalarModal.classList.remove('flex'); // remove any accidental flex
        kasalarModal.classList.add('hidden');
        kasalarModal.style.display = 'none';
    }

    const openKasalarModal = () => {
        if (!kasalarModal) return;
        const fmt = (v, d = 2) => v.toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d });

        if (kasaDetaylar.length === 0) {
            kasalarModalBody.innerHTML = '<p class="text-sm text-gray-400 text-center py-6">Veri yüklenmedi. Lütfen bekleyin.</p>';
        } else {
            let html = '';
            for (const kasa of kasaDetaylar) {
                const renk = kasa.hasToplamı >= 0 ? 'text-green-600' : 'text-red-600';
                html += `
                    <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <div class="flex items-center justify-between mb-2">
                            <span class="font-bold text-gray-700 text-sm">${kasa.ad}</span>
                            <span class="font-extrabold font-mono text-sm ${renk}">${fmt(kasa.hasToplamı, 3)} HAS</span>
                        </div>
                        <div class="space-y-1">
                            ${kasa.bakiyeler.map(b => {
                    const r = b.miktar >= 0 ? 'text-green-600' : 'text-red-600';
                    return `<div class="flex justify-between text-xs text-gray-500">
                                    <span>${b.birim}</span>
                                    <span class="font-mono font-semibold ${r}">${fmt(b.miktar, 2)}</span>
                                </div>`;
                }).join('')}
                            ${kasa.bakiyeler.length === 0 ? '<span class="text-xs text-gray-400">İşlem yok</span>' : ''}
                        </div>
                    </div>
                `;
            }
            kasalarModalBody.innerHTML = html;
        }

        // show modal (both class + inline style to be robust)
        kasalarModal.classList.remove('hidden');
        kasalarModal.classList.add('flex');
        kasalarModal.style.display = 'flex';
    };

    const closeKasalarModal = () => {
        if (kasalarModal) {
            kasalarModal.classList.add('hidden');
            kasalarModal.classList.remove('flex');
            kasalarModal.style.display = 'none';
        }
    };

    if (kasalarCard) kasalarCard.addEventListener('click', openKasalarModal);
    if (kasalarModalClose) kasalarModalClose.addEventListener('click', closeKasalarModal);
    if (kasalarModalBg) kasalarModalBg.addEventListener('click', closeKasalarModal);

    // ─── İlk yükleme ─────────────────────────────────────────────────────────
    renderWelcome();

    // gizlenmesi istenen tekrar eden statik/arka plan 'Kasalar' bölümünü temizle
    removeDuplicateKasalarSection();

    await updateRatesAndTicker(false);
    await fetchKasalar();

});
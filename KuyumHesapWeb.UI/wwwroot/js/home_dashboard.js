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
    const getAuthHeaders = () => window.khGetAuthHeaders
        ? window.khGetAuthHeaders({ 'Content-Type': 'application/json' })
        : { 'Content-Type': 'application/json' };

    // --- HIZLI DÜZELTME: Sayfada görünmesini istemediğimiz ekstra "Kasalar" bölümünü kaldır ---
    const removeDuplicateKasalarSection = () => {
        try {
            // Başlık metni tam olarak 'Kasalar' olan H1..H6 etiketlerini hedefle
            document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(h => {
                const text = (h.textContent || '').trim();
                // Sadece Dashboard kartı DIŞINDAKİ 'Kasalar' başlıklarını hedefle
                if (text === 'Kasalar' && !h.closest('#kasalar-card')) {
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

            // Ek güvenlik: sadece hiçbir ana karta ait OLMAYAN "Detaylar için tıklayın" yazılarını gizle
            document.querySelectorAll('p,div,span').forEach(el => {
                const txt = (el.textContent || '').trim();
                if (txt.startsWith('Detaylar için tıklayın')) {
                    const isMainCard = el.closest('#kasalar-card') || el.closest('#bankalar-card') || el.closest('#poslar-card');
                    if (!isMainCard) {
                        el.style.display = 'none';
                    }
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
            const response = await fetch('/Cure/CureUpdate', {
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

    let kasaDetaylar = [];
    let bankaDetaylar = [];
    let posDetaylar = [];

    // ─── Kasalar - HAS Toplamı ───────────────────────────────────────────────
    const fetchKasalar = async (initialPayload = null) => {
        const ozet = document.getElementById('kasalar-ozet');
        if (!ozet) return;
        try {
            let payload = initialPayload;
            if (!payload) {
                const url = '/Report/GetCashReport';
                const res = await fetch(url, { method: 'GET', headers: getAuthHeaders(), credentials: 'same-origin' });
                if (!res.ok) { ozet.innerHTML = '<span class="text-xs text-red-400">Yüklenemedi</span>'; return; }
                payload = await res.json();
            }
            
            const dataObj = (payload && (payload.data !== undefined || payload.Data !== undefined)) ? (payload.data ?? payload.Data) : payload;
            const accounts = (dataObj && Array.isArray(dataObj.items ?? dataObj.Items)) ? (dataObj.items ?? dataObj.Items) : [];
            const overallTotalHas = Number((dataObj && (dataObj.totalHas ?? dataObj.TotalHas)) ?? 0);
            kasaDetaylar = [];
            accounts.forEach(acc => {
                const accountName = acc.accountName || acc.AccountName || acc.hesapAdi || acc.HesapAdi || 'Bilinmeyen Kasa';
                const accountTotalHas = Number(acc.totalHas ?? acc.TotalHas ?? acc.hasToplami ?? 0) || 0;
                const currentBalances = {};
                const devreden = acc.devredenBakiyeler ?? acc.DevredenBakiyeler;
                if (Array.isArray(devreden)) {
                    devreden.forEach(b => {
                        const code = b.dovizKodu ?? b.DovizKodu ?? b.currencyCode ?? b.CurrencyCode ?? b.birim ?? b.Birim ?? 'UNKNOWN';
                        currentBalances[code] = Number(b.bakiye ?? b.Bakiye ?? b.amount ?? b.Amount ?? 0) || 0;
                    });
                }
                const hareketler = acc.hareketler ?? acc.Hareketler;
                if (Array.isArray(hareketler)) {
                    hareketler.forEach(h => {
                        const birim = h.balanceCurrency ?? h.BalanceCurrency ?? h.unit ?? h.Unit ?? h.counterUnit ?? h.CounterUnit ?? h.birim ?? h.Birim ?? h.karsilikBirim ?? 'UNKNOWN';
                        currentBalances[birim] = Number(h.finalBalance ?? h.FinalBalance ?? currentBalances[birim] ?? 0);
                    });
                }
                const bakiyeListesi = Object.entries(currentBalances).filter(([_, m])=>m!==0).map(([birim, miktar])=>({ birim, miktar }));
                kasaDetaylar.push({ ad: accountName, bakiyeler: bakiyeListesi, hasToplamı: accountTotalHas });
            });
            const fmt = v => v.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const renk = overallTotalHas >= 0 ? 'text-green-600' : 'text-red-600';
            ozet.innerHTML = `<span class="text-2xl font-extrabold font-mono ${renk}">${fmt(overallTotalHas)}</span><span class="text-sm font-semibold text-gray-400 mb-0.5">HAS</span>`;
        } catch (e) { ozet.innerHTML = '<span class="text-xs text-red-400">Yüklenemedi</span>'; }
    };

    // ─── Bankalar ────────────────────────────────────────────────────────────
    const fetchBankalar = async (initialPayload = null) => {
        const ozet = document.getElementById('bankalar-ozet');
        if (!ozet) return;
        try {
            let payload = initialPayload;
            if (!payload) {
                const url = '/Report/GetBankReport';
                const res = await fetch(url, { method: 'GET', headers: getAuthHeaders(), credentials: 'same-origin' });
                if (!res.ok) { ozet.innerHTML = '<span class="text-xs text-red-400">Yüklenemedi</span>'; return; }
                payload = await res.json();
            }

            const dataObj = (payload && (payload.data !== undefined || payload.Data !== undefined)) ? (payload.data ?? payload.Data) : payload;
            const accounts = (dataObj && Array.isArray(dataObj.items ?? dataObj.Items)) ? (dataObj.items ?? dataObj.Items) : [];
            const overallTotalHas = Number((dataObj && (dataObj.totalHas ?? dataObj.TotalHas)) ?? 0);
            bankaDetaylar = [];
            accounts.forEach(acc => {
                const accountName = acc.accountName || acc.AccountName || acc.hesapAdi || acc.HesapAdi || 'Bilinmeyen Banka';
                const accountTotalHas = Number(acc.totalHas ?? acc.TotalHas ?? acc.hasToplami ?? 0) || 0;
                const currentBalances = {};
                const devreden = acc.devredenBakiyeler ?? acc.DevredenBakiyeler;
                if (Array.isArray(devreden)) {
                    devreden.forEach(b => {
                        const code = b.dovizKodu ?? b.DovizKodu ?? b.currencyCode ?? b.CurrencyCode ?? b.birim ?? b.Birim ?? 'UNKNOWN';
                        currentBalances[code] = Number(b.bakiye ?? b.Bakiye ?? b.amount ?? b.Amount ?? 0) || 0;
                    });
                }
                const hareketler = acc.hareketler ?? acc.Hareketler;
                if (Array.isArray(hareketler)) {
                    hareketler.forEach(h => {
                        const birim = h.balanceCurrency ?? h.BalanceCurrency ?? h.unit ?? h.Unit ?? h.counterUnit ?? h.CounterUnit ?? h.birim ?? h.Birim ?? h.karsilikBirim ?? 'UNKNOWN';
                        currentBalances[birim] = Number(h.finalBalance ?? h.FinalBalance ?? currentBalances[birim] ?? 0);
                    });
                }
                const bakiyeListesi = Object.entries(currentBalances).filter(([_, m])=>m!==0).map(([birim, miktar])=>({ birim, miktar }));
                bankaDetaylar.push({ ad: accountName, bakiyeler: bakiyeListesi, hasToplamı: accountTotalHas });
            });
            const fmt = v => v.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const renk = overallTotalHas >= 0 ? 'text-green-600' : 'text-red-600';
            ozet.innerHTML = `<span class="text-2xl font-extrabold font-mono ${renk}">${fmt(overallTotalHas)}</span><span class="text-sm font-semibold text-gray-400 mb-0.5">HAS</span>`;
        } catch (e) { ozet.innerHTML = '<span class="text-xs text-red-400">Yüklenemedi</span>'; }
    };

    // ─── Poslar ─────────────────────────────────────────────────────────────
    const fetchPoslar = async (initialPayload = null) => {
        const ozet = document.getElementById('poslar-ozet');
        if (!ozet) return;
        try {
            let payload = initialPayload;
            if (!payload) {
                const url = '/Report/GetPosReport';
                const res = await fetch(url, { method: 'GET', headers: getAuthHeaders(), credentials: 'same-origin' });
                if (!res.ok) { ozet.innerHTML = '<span class="text-xs text-red-400">Yüklenemedi</span>'; return; }
                payload = await res.json();
            }

            const dataObj = (payload && (payload.data !== undefined || payload.Data !== undefined)) ? (payload.data ?? payload.Data) : payload;
            const accounts = (dataObj && Array.isArray(dataObj.items ?? dataObj.Items)) ? (dataObj.items ?? dataObj.Items) : [];
            const overallTotalHas = Number((dataObj && (dataObj.totalHas ?? dataObj.TotalHas)) ?? 0);
            posDetaylar = [];
            accounts.forEach(acc => {
                const accountName = acc.accountName || acc.AccountName || acc.hesapAdi || acc.HesapAdi || 'Bilinmeyen Pos';
                const accountTotalHas = Number(acc.totalHas ?? acc.TotalHas ?? acc.hasToplami ?? 0) || 0;
                const currentBalances = {};
                const devreden = acc.devredenBakiyeler ?? acc.DevredenBakiyeler;
                if (Array.isArray(devreden)) {
                    devreden.forEach(b => {
                        const code = b.dovizKodu ?? b.DovizKodu ?? b.currencyCode ?? b.CurrencyCode ?? b.birim ?? b.Birim ?? 'UNKNOWN';
                        currentBalances[code] = Number(b.bakiye ?? b.Bakiye ?? b.amount ?? b.Amount ?? 0) || 0;
                    });
                }
                const hareketler = acc.hareketler ?? acc.Hareketler;
                if (Array.isArray(hareketler)) {
                    hareketler.forEach(h => {
                        const birim = h.balanceCurrency ?? h.BalanceCurrency ?? h.unit ?? h.Unit ?? h.counterUnit ?? h.CounterUnit ?? h.birim ?? h.Birim ?? h.karsilikBirim ?? 'UNKNOWN';
                        currentBalances[birim] = Number(h.finalBalance ?? h.FinalBalance ?? currentBalances[birim] ?? 0);
                    });
                }
                const bakiyeListesi = Object.entries(currentBalances).filter(([_, m])=>m!==0).map(([birim, miktar])=>({ birim, miktar }));
                posDetaylar.push({ ad: accountName, bakiyeler: bakiyeListesi, hasToplamı: accountTotalHas });
            });
            const fmt = v => v.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const renk = overallTotalHas >= 0 ? 'text-green-600' : 'text-red-600';
            ozet.innerHTML = `<span class="text-2xl font-extrabold font-mono ${renk}">${fmt(overallTotalHas)}</span><span class="text-sm font-semibold text-gray-400 mb-0.5">HAS</span>`;
        } catch (e) { ozet.innerHTML = '<span class="text-xs text-red-400">Yüklenemedi</span>'; }
    };

    // ─── Modals Logic ───────────────────────────────────────────────────────
    const setupModal = (cardId, modalId, detailsArray) => {
        const card = document.getElementById(cardId);
        const modal = document.getElementById(modalId);
        const body = document.getElementById(`${modalId}-body`);
        const close = document.getElementById(`${modalId}-close`);
        const bg = document.getElementById(`${modalId}-bg`);

        if (!card || !modal || !body) return;

        const fmt = (v, d = 2) => v.toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d });

        card.addEventListener('click', () => {
            if (detailsArray.length === 0) {
                body.innerHTML = '<p class="text-sm text-gray-400 text-center py-6">Veri bulunamadı.</p>';
            } else {
                let html = '';
                detailsArray.forEach(k => {
                    const renk = k.hasToplamı >= 0 ? 'text-green-600' : 'text-red-600';
                    html += `
                        <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div class="flex items-center justify-between mb-2">
                                <span class="font-bold text-gray-700 text-sm">${k.ad}</span>
                                <span class="font-extrabold font-mono text-sm ${renk}">${fmt(k.hasToplamı, 2)} HAS</span>
                            </div>
                            <div class="space-y-1">
                                ${k.bakiyeler.map(b => {
                                    const r = b.miktar >= 0 ? 'text-green-600' : 'text-red-600';
                                    return `<div class="flex justify-between text-xs text-gray-500">
                                                <span>${b.birim}</span>
                                                <span class="font-mono font-semibold ${r}">${fmt(b.miktar, 2)}</span>
                                            </div>`;
                                }).join('')}
                                ${k.bakiyeler.length === 0 ? '<span class="text-xs text-gray-400">İşlem yok</span>' : ''}
                            </div>
                        </div>
                    `;
                });
                body.innerHTML = html;
            }
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            modal.style.display = 'flex';
        });

        const closeModal = () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            modal.style.display = 'none';
        };

        if (close) close.addEventListener('click', closeModal);
        if (bg) bg.addEventListener('click', closeModal);
    };

    // ─── İlk yükleme ─────────────────────────────────────────────────────────
    renderWelcome();
    removeDuplicateKasalarSection();

    await updateRatesAndTicker(false);
    
    // Fetch all report data — use initial data if available
    const initial = window.dashboardInitialData || {};
    
    await Promise.all([
        fetchKasalar(initial.cashReport),
        fetchBankalar(initial.bankReport),
        fetchPoslar(initial.posReport)
    ]);

    // Setup all modals
    setupModal('kasalar-card', 'kasalar-modal', kasaDetaylar);
    setupModal('bankalar-card', 'bankalar-modal', bankaDetaylar);
    setupModal('poslar-card', 'poslar-modal', posDetaylar);

});

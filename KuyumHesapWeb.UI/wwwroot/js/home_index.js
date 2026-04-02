// Scripts/app/main-layout.js - Düzenlenmiş ve temizlenmiş son hali
(function () {
    'use strict';

    // Başlangıç
    function init() {
        console.log('[home_index] DOMContentLoaded');

        // --- Ayarlar / Sabitler ---
        const API_BASE_URL = 'https://localhost:7055/api';

        // Temel element referansları
        const mainElement = document.getElementById('main-content');
        if (!mainElement) {
            console.warn('[home_index] main-content bulunamadı!');
            return;
        }
        const loginUrl = mainElement.dataset.loginUrl || '/Auth/Login';
        const dashboardUrl = mainElement.dataset.dashboardUrl || '/';
        const sidebarMenu = document.getElementById('sidebar-menu');
        const mainContent = document.getElementById('main-content');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const toggleIcon = sidebarToggle ? sidebarToggle.querySelector('i') : null;
        const searchInput = document.getElementById('sidebar-search');
        const tabsContainer = document.getElementById('tabs-container');
        const contentFrames = document.getElementById('content-frames');
        const logoutButton = document.getElementById('logout-button');
        const mobileOverlay = document.getElementById('mobile-overlay');
        const mobileTopHamburger = document.getElementById('mobile-top-hamburger');
        const submenuFlyout = document.getElementById('submenu-flyout');

        let hoverTimeout = null;
        let openTabs = [];
        const MAX_TABS = 10;
        let isPinned = false; // false => sidebar gizli
        let activeSubmenu = null;
        let pinnedTrigger = null;
        let idCounter = 0; // benzersiz id üretici

        // Güvenlik / debug
        console.log('[home_index] elements:', {
            sidebarMenu: !!sidebarMenu,
            mobileTopHamburger: !!mobileTopHamburger,
            sidebarToggle: !!sidebarToggle,
            mobileOverlay: !!mobileOverlay,
            submenuFlyout: !!submenuFlyout
        });

        // Yardımcı fonksiyonlar
        const generateId = (prefix) => `${prefix}-${Date.now()}-${++idCounter}`;

        const saveSettings = async (sidebarGizli) => {
            try {
                const token = localStorage.getItem('jwt_token');
                if (!token) return;
                await fetch(`${API_BASE_URL}/Ayarlar/me`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sidebarGizli)
                });
            } catch (e) {
                console.error('[home_index] Ayarlar kaydedilemedi', e);
            }
        };

        const clearSearchAndResetMenu = () => {
            if (searchInput && searchInput.value !== '') {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        };

        const expandSidebar = () => {
            if (hoverTimeout) { clearTimeout(hoverTimeout); hoverTimeout = null; }
            if (!sidebarMenu) return;
            sidebarMenu.classList.add('expanded', 'w-64');
            sidebarMenu.classList.remove('w-16');
            if (window.innerWidth < 768) {
                if (mobileOverlay) mobileOverlay.classList.remove('opacity-0', 'pointer-events-none');
            } else if (isPinned) {
                mainContent && mainContent.classList.replace('md:pl-16', 'md:pl-64');
            }
        };

        const collapseSidebar = () => {
            if (hoverTimeout) { clearTimeout(hoverTimeout); hoverTimeout = null; }
            if (!sidebarMenu) return;
            if (window.innerWidth < 768) {
                sidebarMenu.classList.add('hidden');
                sidebarMenu.classList.remove('flex');
                if (mobileOverlay) mobileOverlay.classList.add('opacity-0', 'pointer-events-none');
            } else {
                sidebarMenu.classList.remove('expanded', 'w-64');
                sidebarMenu.classList.add('w-16');
                mainContent && mainContent.classList.replace('md:pl-64', 'md:pl-16');
            }

            if (pinnedTrigger) {
                pinnedTrigger.classList.remove('pinned');
                pinnedTrigger = null;
            }
            hideActiveSubmenu();
        };

        const hideActiveSubmenu = () => {
            if (activeSubmenu && submenuFlyout) {
                submenuFlyout.classList.add('opacity-0', 'pointer-events-none');
                submenuFlyout.innerHTML = '';
                activeSubmenu = null;
            }
        };

        // Mobil hamburger davranışları
        if (mobileTopHamburger) {
            mobileTopHamburger.style.pointerEvents = 'auto';
            mobileTopHamburger.setAttribute('tabindex', '0');
            mobileTopHamburger.setAttribute('role', 'button');
            mobileTopHamburger.setAttribute('aria-label', 'Menüyü aç');

            const openFromMobileTrigger = (e) => {
                e && e.stopPropagation && e.stopPropagation();
                e && e.preventDefault && e.preventDefault();
                if (sidebarMenu) {
                    sidebarMenu.classList.remove('hidden');
                    sidebarMenu.classList.add('flex');
                    expandSidebar();
                }
                if (mobileOverlay) {
                    mobileOverlay.classList.remove('opacity-0', 'pointer-events-none');
                }
            };

            mobileTopHamburger.addEventListener('click', openFromMobileTrigger, { passive: true });
            mobileTopHamburger.addEventListener('touchstart', openFromMobileTrigger, { passive: true });

            mobileTopHamburger.addEventListener('mouseenter', () => {
                if (hoverTimeout) { clearTimeout(hoverTimeout); hoverTimeout = null; }
                if (sidebarMenu) {
                    sidebarMenu.classList.remove('hidden');
                    sidebarMenu.classList.add('flex');
                    expandSidebar();
                }
                if (mobileOverlay) mobileOverlay.classList.remove('opacity-0', 'pointer-events-none');
            });

            mobileTopHamburger.addEventListener('mouseleave', (e) => {
                if (hoverTimeout) clearTimeout(hoverTimeout);
                hoverTimeout = setTimeout(() => {
                    const related = e.relatedTarget;
                    if (related && (sidebarMenu && sidebarMenu.contains(related))) return;
                    if (!isPinned) collapseSidebar();
                }, 180);
            });

            mobileTopHamburger.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    openFromMobileTrigger(e);
                }
            });
        } else {
            console.log('[home_index] mobileTopHamburger yok — devtools Console\'da şu komutu çalıştırın: document.getElementById("mobile-top-hamburger")');
        }

        // Sidebar hover davranışları
        if (sidebarMenu) {
            sidebarMenu.addEventListener('mouseenter', () => {
                if (hoverTimeout) { clearTimeout(hoverTimeout); hoverTimeout = null; }
                if (!isPinned) expandSidebar();
            });

            sidebarMenu.addEventListener('mouseleave', (e) => {
                if (!isPinned) {
                    if (submenuFlyout && submenuFlyout.contains(e.relatedTarget)) return;
                    if (hoverTimeout) clearTimeout(hoverTimeout);
                    hoverTimeout = setTimeout(() => collapseSidebar(), 100);
                }
            });
        }

        // Alt menü davranışları
        const menuItemsWithSubmenu = Array.from(document.querySelectorAll('.sidebar-link-container')).filter(item => item.querySelector('.submenu'));
        menuItemsWithSubmenu.forEach(item => {
            const trigger = item.querySelector('.sidebar-link');
            if (!trigger) return;
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const isAlreadyPinned = trigger === pinnedTrigger;
                if (isAlreadyPinned) {
                    if (pinnedTrigger) {
                        pinnedTrigger.classList.remove('pinned');
                        pinnedTrigger = null;
                    }
                    hideActiveSubmenu();
                    return;
                }
                if (pinnedTrigger) pinnedTrigger.classList.remove('pinned');

                trigger.classList.add('pinned');
                pinnedTrigger = trigger;
                if (activeSubmenu) hideActiveSubmenu();

                const submenuContent = item.querySelector('.submenu').innerHTML;
                if (submenuFlyout) submenuFlyout.innerHTML = `<div class="py-2 flex flex-col">${submenuContent}</div>`;
                const sidebarWidth = sidebarMenu ? sidebarMenu.offsetWidth : 64;
                if (submenuFlyout) {
                    submenuFlyout.style.left = `${sidebarWidth}px`;
                    submenuFlyout.classList.remove('opacity-0', 'pointer-events-none');
                }
                activeSubmenu = item;
            });
        });

        // Bağlantı tıklamalarında sidebar davranışı
        const allSidebarLinks = document.querySelectorAll('.sidebar-link-container .sidebar-link');
        allSidebarLinks.forEach(link => {
            const container = link.closest('.sidebar-link-container');
            const hasSubmenu = container && container.querySelector('.submenu') !== null;
            if (!hasSubmenu) {
                link.addEventListener('click', () => {
                    if (!isPinned) collapseSidebar();
                });
            }
        });

        // Flyout tıklaması
        submenuFlyout && submenuFlyout.addEventListener('click', () => {
            if (!isPinned) collapseSidebar();
            hideActiveSubmenu();
        });

        // Dış tıklama: mobil hamburger istisnası
        document.addEventListener('click', (e) => {
            if (!(submenuFlyout && submenuFlyout.contains(e.target)) && !e.target.closest('.sidebar-link-container')) {
                hideActiveSubmenu();
            }
            if (!sidebarMenu || !sidebarMenu.contains(e.target)) {
                if (!e.target.closest('#sidebar-toggle') && !e.target.closest('#mobile-top-hamburger')) {
                    if (!isPinned) {
                        collapseSidebar();
                        clearSearchAndResetMenu();
                    }
                }
            }
        }, true);

        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', () => {
                if (!isPinned || window.innerWidth < 768) {
                    collapseSidebar();
                }
            });
        }

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                isPinned = !isPinned;
                const sidebarGizli = !isPinned;
                if (isPinned) {
                    expandSidebar();
                    toggleIcon && toggleIcon.classList.add('text-green-700');
                } else {
                    collapseSidebar();
                    toggleIcon && toggleIcon.classList.remove('text-green-700');
                }
                saveSettings(sidebarGizli);
            });
        }

        logoutButton && logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('jwt_token');
            window.location.href = loginUrl;
        });

        // Sekme / iframe yönetimi
        window.openTab = function (url, title) {
            const normalizeUrl = (u) => u.replace(/\/$/, '').toLowerCase();
            const existingTab = openTabs.find(tab => tab.title === title || normalizeUrl(tab.url) === normalizeUrl(url));

            if (existingTab) { switchTab(existingTab.id); return; }
            if (openTabs.length >= MAX_TABS) { alert(`Maksimum ${MAX_TABS} sekme açabilirsiniz.`); return; }

            const tabId = generateId('tab');
            const frameId = generateId('frame');

            const tabButton = document.createElement('button');
            tabButton.className = 'tab-button flex items-center px-3 py-1.5 text-xs font-medium';
            tabButton.dataset.tabId = tabId;
            const isDashboard = url === dashboardUrl;
            tabButton.innerHTML = `<span>${title}</span>` + (isDashboard ? '' : `<span class="close-tab-btn ml-2 text-gray-500 hover:text-gray-800">&times;</span>`);
            tabsContainer && tabsContainer.appendChild(tabButton);

            const iframe = document.createElement('iframe');
            iframe.id = frameId;
            iframe.className = 'w-full h-full border-none overflow-hidden';
            iframe.src = url.includes('?') ? `${url}&noLayout=1` : `${url}?noLayout=1`;

            if (!contentFrames) {
                console.warn('[home_index] contentFrames element not found — fallback: navigation to url', url);
                window.location.href = url;
                return;
            }

            contentFrames.appendChild(iframe);
            openTabs.push({ id: tabId, url, title, frameId });

            if (!isDashboard) {
                const closeBtn = tabButton.querySelector('.close-tab-btn');
                closeBtn && closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeTab(tabId); });
            }

            tabButton.addEventListener('click', () => switchTab(tabId));

            iframe.onload = () => {
                try {
                    iframe.contentWindow.document.addEventListener('click', () => {
                        hideActiveSubmenu();
                    });
                } catch (err) {
                    // cross-origin -> ignore
                }
            };

            switchTab(tabId);
        };

        function switchTab(tabId, skipHistory) {
            const nativeContent = document.getElementById('native-content');
            const contentFrames = document.getElementById('content-frames');
            let isNativeActive = false;
            let activeTab = null;

            openTabs.forEach(tab => {
                const button = document.querySelector(`.tab-button[data-tab-id="${tab.id}"]`);
                const frame = tab.frameId ? document.getElementById(tab.frameId) : null;
                if (button) button.classList.toggle('active', tab.id === tabId);
                
                if (tab.id === tabId) {
                    activeTab = tab;
                    if (tab.isNative) {
                        isNativeActive = true;
                    }
                    if (frame) {
                        frame.classList.add('active');
                        frame.style.display = 'block';
                    }
                } else {
                    if (frame) {
                        frame.classList.remove('active');
                        frame.style.display = 'none';
                    }
                }
            });

            if (nativeContent && contentFrames) {
                if (isNativeActive) {
                    nativeContent.style.display = '';
                    nativeContent.style.flex = '';
                    contentFrames.classList.add('hidden');
                    contentFrames.style.flex = '0';
                } else {
                    nativeContent.style.display = 'none';
                    nativeContent.style.flex = '0 0 0px';
                    contentFrames.classList.remove('hidden');
                    contentFrames.style.flex = '1 1 0%';
                }
            }

            // URL'i aktif sekmenin URL'iyle güncelle
            if (!skipHistory && activeTab) {
                const newUrl = activeTab.url || dashboardUrl;
                history.pushState({ tabId: tabId }, activeTab.title || '', newUrl);
                document.title = (activeTab.title ? activeTab.title + ' | ' : '') + 'KuyumHesap';
            }

            updateActiveSidebarLink(tabId);
        }

        // Geri/ileri buton desteği
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.tabId) {
                const tab = openTabs.find(t => t.id === e.state.tabId);
                if (tab) { switchTab(tab.id, true); return; }
            }
            // State yoksa URL'e göre bul
            const loc = (window.location.pathname || '').replace(/\/$/, '').toLowerCase();
            const found = openTabs.find(t => t.url && t.url.replace(/\/$/, '').toLowerCase() === loc);
            if (found) switchTab(found.id, true);
        });

        function closeTab(tabId) {
            const tabIndex = openTabs.findIndex(tab => tab.id === tabId);
            if (tabIndex === -1) return;
            const tabToClose = openTabs[tabIndex];
            const button = document.querySelector(`.tab-button[data-tab-id="${tabToClose.id}"]`);
            const frame = tabToClose.frameId ? document.getElementById(tabToClose.frameId) : null;
            if (button) button.remove();
            if (frame) frame.remove();
            openTabs.splice(tabIndex, 1);
            if (button && button.classList.contains('active') && openTabs.length > 0) {
                const nextActiveTab = openTabs[Math.max(0, tabIndex - 1)];
                switchTab(nextActiveTab.id);
            } else if (openTabs.length === 0) {
                // Hiç sekme kalmadıysa ana sayfayı aç
                openTab(dashboardUrl, 'Ana Sayfa');
            }
        }

        // Arama inputu
        searchInput && searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();
            document.querySelectorAll('#menu-links-container .sidebar-link-container').forEach(container => {
                const mainLink = container.querySelector('.sidebar-link');
                const submenu = container.querySelector('.submenu');
                if (submenu) {
                    let hasVisibleChild = false;
                    submenu.querySelectorAll('a').forEach(subLink => {
                        const linkText = subLink.textContent.toLowerCase();
                        if (linkText.includes(searchTerm)) {
                            subLink.style.display = 'block';
                            hasVisibleChild = true;
                        } else {
                            subLink.style.display = 'none';
                        }
                    });
                    const mainLinkText = mainLink && mainLink.querySelector('.sidebar-text') ? mainLink.querySelector('.sidebar-text').textContent.toLowerCase() : (mainLink ? mainLink.textContent.toLowerCase() : '');
                    container.style.display = (hasVisibleChild || mainLinkText.includes(searchTerm)) ? 'block' : 'none';
                } else if (mainLink) {
                    const linkText = mainLink.textContent.toLowerCase();
                    container.style.display = linkText.includes(searchTerm) ? 'block' : 'none';
                }
            });
        });

        function updateActiveSidebarLink(activeTabId) {
            document.querySelectorAll('.sidebar-link-container.active-link').forEach(el => el.classList.remove('active-link'));
            const activeTab = openTabs.find(tab => tab.id === activeTabId);
            if (activeTab) {
                const allLinks = document.querySelectorAll('.sidebar-link-container a');
                allLinks.forEach(link => {
                    const onclickAttr = link.getAttribute('onclick') || '';
                    const hrefAttr = link.getAttribute('href') || '';
                    try {
                        const tabUrlLower = activeTab.url.replace(/\/$/, '').toLowerCase();
                        const hrefLower = hrefAttr.replace(/\/$/, '').toLowerCase();
                        
                        // Eşleştirme logic'i
                        let isMatch = false;
                        if (onclickAttr.includes(`'${activeTab.url}'`) || onclickAttr.includes(`"${activeTab.url}"`)) {
                            isMatch = true;
                        } else if (hrefAttr && hrefAttr !== '#' && hrefAttr !== 'javascript:void(0);') {
                            if (tabUrlLower.includes(hrefLower) || hrefLower.includes(tabUrlLower)) {
                                isMatch = true;
                            }
                        }

                        if (isMatch) {
                            const parentContainer = link.closest('.sidebar-link-container');
                            if (parentContainer) parentContainer.classList.add('active-link');
                            const submenu = link.closest('.submenu');
                            if (submenu) {
                                const prev = submenu.previousElementSibling;
                                if (prev) prev.closest('.sidebar-link-container') && prev.closest('.sidebar-link-container').classList.add('active-link');
                            }
                        }
                    } catch (err) {
                        // ignore
                    }
                });
            }
        }

        // İlk sekmeyi aç
        if (openTabs.length === 0) {
            try {
                const locPath = (window.location.pathname || '').replace(/\/$/, '').toLowerCase();
                const normalizedDashboard = dashboardUrl.replace(/\/$/, '').toLowerCase();
                const pageHasDashboardMarkup = !!document.getElementById('kasalar-card') || !!document.getElementById('welcome-text');

                let title = 'Ana Sayfa';
                let isDashboard = locPath.includes(normalizedDashboard) || pageHasDashboardMarkup;
                
                if (!isDashboard) {
                    const allLinks = document.querySelectorAll('.sidebar-link-container a');
                    for (const link of allLinks) {
                        const href = link.getAttribute('href');
                        const onclickAttr = link.getAttribute('onclick') || '';
                        let targetUrl = '';
                        
                        if (onclickAttr.includes('openTab(')) {
                            // Extract URL from openTab('/Url', 'Title')
                            const match = onclickAttr.match(/openTab\(['"]([^'"]+)['"]/);
                            if (match && match[1]) targetUrl = match[1];
                        } else if (href && href !== '#' && href !== 'javascript:void(0);') {
                            targetUrl = href;
                        }

                        if (targetUrl) {
                            const normalizedUrl = targetUrl.replace(/\/$/, '').toLowerCase();
                            if (locPath.includes(normalizedUrl) || normalizedUrl.includes(locPath)) {
                                const textSpan = link.querySelector('.sidebar-text');
                                if (textSpan) {
                                    title = textSpan.textContent.trim();
                                    break;
                                }
                            }
                        }
                    }
                }

                const tabId = generateId('tab');
                const tabButton = document.createElement('button');
                tabButton.className = 'tab-button flex items-center px-3 py-1.5 text-xs font-medium active';
                tabButton.dataset.tabId = tabId;
                tabButton.innerHTML = `<span>${title}</span>` + (isDashboard ? '' : `<span class="close-tab-btn ml-2 text-gray-500 hover:text-gray-800">&times;</span>`);
                
                if (tabsContainer) {
                    tabsContainer.appendChild(tabButton);
                }
                
                openTabs.push({ id: tabId, url: window.location.pathname, title: title, isNative: true });
                
                if (!isDashboard) {
                    const closeBtn = tabButton.querySelector('.close-tab-btn');
                    closeBtn && closeBtn.addEventListener('click', (e) => { e.stopPropagation(); closeTab(tabId); });
                }
                
                tabButton.addEventListener('click', () => switchTab(tabId));
                
                switchTab(tabId);
                
            } catch (e) {
                console.error("Tab açılış hatası:", e);
                openTab(dashboardUrl, 'Ana Sayfa');
            }
        }
    }

    // DOMContentLoaded bağlama
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
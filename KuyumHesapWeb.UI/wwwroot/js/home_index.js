// Scripts/app/main-layout.js - Düzenlenmiş ve temizlenmiş son hali
(function () {
    'use strict';

    // Başlangıç
    async function init() {
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
        const dashboardUrl = (mainElement.dataset.dashboardUrl || '/').trim();
        const sidebarMenu = document.getElementById('sidebar-menu');
        const mainContent = document.getElementById('main-content');
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const toggleIcon = sidebarToggle ? sidebarToggle.querySelector('i') : null;
        let searchInput = document.getElementById('sidebar-search');
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

        const parseJwtToUserName = () => {
            try {
                const token = window.khGetAuthToken ? window.khGetAuthToken() : localStorage.getItem('jwt_token');
                if (!token) return 'Kullanıcı';
                
                const payloadStr = atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'));
                const payload = JSON.parse(decodeURIComponent(escape(payloadStr)));
                
                return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 
                       payload.userName || payload.username || 
                       payload.unique_name || payload.name || payload.given_name || 'Kullanıcı';
            } catch (e) {
                console.warn('[home_index] Token çözülemedi, varsayılan Kullanıcı adı kullanılacak', e);
                return 'Kullanıcı';
            }
        };

        const displayUsernameEl = document.getElementById('display-username');
        if (displayUsernameEl) {
            displayUsernameEl.innerText = parseJwtToUserName();
        }

        const saveSettings = async (sidebarGizli) => {
            try {
                const token = window.khGetAuthToken ? window.khGetAuthToken() : localStorage.getItem('jwt_token');
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

        const isMobileView = () => {
            // Sadece ekran genişliğine göre mobil kontrolü yapalım (768px Tailwind md breakpoint'idir)
            const isSmall = window.innerWidth < 768;
            console.log('[home_index] isMobileView check:', { innerWidth: window.innerWidth, isSmall });
            return isSmall;
        };

        const collapseSidebar = () => {
            console.log('[home_index] collapseSidebar called');
            if (hoverTimeout) { clearTimeout(hoverTimeout); hoverTimeout = null; }
            if (!sidebarMenu) return;

            const isMobile = isMobileView();

            // Genişleme sınıflarını her durumda temizle
            sidebarMenu.classList.remove('expanded', 'w-64');

            if (isMobile) {
                console.log('[home_index] collapsing for mobile');
                sidebarMenu.classList.add('hidden');
                sidebarMenu.classList.remove('flex'); // Mobilde flex yerine hidden olmalı
                sidebarMenu.style.display = 'none'; // Force hide inline
                if (mobileOverlay) {
                    mobileOverlay.classList.add('opacity-0', 'pointer-events-none');
                }
            } else {
                console.log('[home_index] collapsing for desktop');
                // Masaüstünde Tailwind 'hidden md:flex' kuralı hakimdir, sadece inline stilleri temizleyelim
                sidebarMenu.classList.remove('hidden');
                sidebarMenu.style.display = ''; // Inline stilleri tamamen temizle
                sidebarMenu.classList.add('w-16');
                if (mainContent) {
                    mainContent.classList.replace('md:pl-64', 'md:pl-16');
                }
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

        const getValue = (item, ...keys) => keys.map(key => item && item[key]).find(value => value !== undefined && value !== null);
        const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
        const menuTitleOf = item => getValue(item, 'name', 'Name', 'menuName', 'MenuName', 'text', 'Text') || 'Menü';
        const menuIdOf = item => getValue(item, 'id', 'Id', 'menuId', 'MenuId');
        const menuParentIdOf = item => getValue(item, 'parentId', 'ParentId', 'parentMenuId', 'ParentMenuId');
        const menuOrderOf = item => Number(getValue(item, 'orderNo', 'OrderNo', 'order', 'Order', 'sortOrder', 'SortOrder') ?? 0);
        const menuIconOf = item => getValue(item, 'iconUrl', 'IconUrl', 'icon', 'Icon', 'iconClass', 'IconClass') || 'fas fa-circle';
        const menuIsActiveOf = item => getValue(item, 'isActive', 'IsActive') !== false;
        const menuCodeOf = item => String(getValue(item, 'code', 'Code') || '').trim().toUpperCase();

        const normalizeNavigationUrl = (value) => {
            let url = String(value || '').trim();
            if (!url) return '';
            if (/^(https?:)?\/\//i.test(url) || url.startsWith('/') || url.startsWith('#') || url.startsWith('javascript:')) {
                return url;
            }
            return `/${url.replace(/^\/+/, '')}`;
        };

        const menuUrlOf = (item) => normalizeNavigationUrl(getValue(item, 'url', 'Url', 'path', 'Path') || '');

        const menuIdentityKeyOf = item => {
            const code = menuCodeOf(item);
            if (code) return `code:${code}`;

            const url = menuUrlOf(item).toLowerCase();
            if (url) return `url:${url}`;

            return `title:${String(menuTitleOf(item) || '').trim().toLocaleLowerCase('tr-TR')}`;
        };

        const pruneInactiveMenuItems = items => {
            const flatItems = Array.isArray(items) ? items : [];
            const byId = new Map();
            const inactiveIds = new Set();

            flatItems.forEach(item => {
                const id = menuIdOf(item);
                if (id !== undefined && id !== null) {
                    byId.set(String(id), item);
                    if (!menuIsActiveOf(item)) {
                        inactiveIds.add(String(id));
                    }
                }
            });

            const hasInactiveParent = item => {
                let parentId = menuParentIdOf(item);
                const visited = new Set();

                while (parentId !== undefined && parentId !== null && parentId !== 0) {
                    const key = String(parentId);
                    if (inactiveIds.has(key)) return true;
                    if (visited.has(key) || !byId.has(key)) return false;

                    visited.add(key);
                    parentId = menuParentIdOf(byId.get(key));
                }

                return false;
            };

            return flatItems.filter(item => menuIsActiveOf(item) && !hasInactiveParent(item));
        };

        const fallbackSidebarItems = [
            { Id: -1, Name: 'Ana Sayfa', Code: 'DASHBOARD_VIEW', Url: '/Dashboard/IndexDashboard', IconUrl: 'fas fa-home w-6 text-center text-xl text-gray-500', OrderNo: 1 },
            { Id: -2, Name: 'Satış Ve Cari', Code: 'SELLANDCARI_VIEW', Url: '/SellAndCari/Index', IconUrl: 'fas fa-shopping-cart w-6 text-center text-xl text-gray-500', OrderNo: 2 },
            { Id: -3, Name: 'Cari Raporlar', Code: 'REPORTS_ROOT', Url: '', IconUrl: 'fas fa-chart-line w-6 text-center text-xl text-gray-500', OrderNo: 3 },
            { Id: -31, ParentId: -3, Name: 'Kasa Raporu', Code: 'CASH_REPORT_VIEW', Url: '/Report/GetCashReport', IconUrl: 'fas fa-wallet', OrderNo: 1 },
            { Id: -32, ParentId: -3, Name: 'Nakit Giriş Çıkış Raporu', Code: 'CASH_IN_OUT_REPORT_VIEW', Url: '/Report/GetCashReport', IconUrl: 'fas fa-exchange-alt', OrderNo: 2 },
            { Id: -4, Name: 'Tanımlamalar', Code: 'DEFINITIONS_ROOT', Url: '', IconUrl: 'fas fa-sitemap w-6 text-center text-xl text-gray-500', OrderNo: 4 },
            { Id: -41, ParentId: -4, Name: 'Hesap Tanımlama', Code: 'ACCOUNT_VIEW', Url: '/Account/Index', IconUrl: 'fas fa-tags', OrderNo: 1 },
            { Id: -42, ParentId: -4, Name: 'Hesap Tipleri Tanımlama', Code: 'ACCOUNT_TYPE_VIEW', Url: '/AccountType/Index', IconUrl: 'fas fa-tags', OrderNo: 2 },
            { Id: -43, ParentId: -4, Name: 'Döviz Tanımlama', Code: 'CURRENCY_VIEW', Url: '/Currency/Index', IconUrl: 'fas fa-coins', OrderNo: 3 },
            { Id: -44, ParentId: -4, Name: 'Stok Grubu Tanımlama', Code: 'STOCK_GROUP_VIEW', Url: '/StockGroup/Index', IconUrl: 'fas fa-layer-group', OrderNo: 4 },
            { Id: -45, ParentId: -4, Name: 'Stok Tipleri Tanımlama', Code: 'STOCK_TYPE_VIEW', Url: '/StockType/Index', IconUrl: 'fas fa-cubes', OrderNo: 5 },
            { Id: -46, ParentId: -4, Name: 'Stok Tanımlama', Code: 'STOCK_VIEW', Url: '/Stock/Index', IconUrl: 'fas fa-box', OrderNo: 6 },
            { Id: -47, ParentId: -4, Name: 'Ürün Tipi Tanımlama', Code: 'PRODUCT_TYPE_VIEW', Url: '/ProductType/Index', IconUrl: 'fas fa-gem', OrderNo: 7 },
            { Id: -48, ParentId: -4, Name: 'Kullanıcı Tanımlama', Code: 'USER_VIEW', Url: '/User/Index', IconUrl: 'fas fa-users-cog', OrderNo: 8 }
        ];

        const mergeFallbackSidebarItems = (items, addMissingFallbackItems = false) => {
            const merged = Array.isArray(items) ? items.slice() : [];
            const normalizeCode = value => String(value || '').trim().toUpperCase();
            const byCode = new Map();

            merged.forEach(item => {
                const code = normalizeCode(getValue(item, 'code', 'Code'));
                if (code) byCode.set(code, item);
            });

            fallbackSidebarItems.forEach(fallback => {
                const fallbackCode = normalizeCode(fallback.Code);
                const existing = byCode.get(fallbackCode);
                if (existing) {
                    if (!menuUrlOf(existing) && fallback.Url) existing.Url = fallback.Url;
                    if (!menuIconOf(existing) && fallback.IconUrl) existing.IconUrl = fallback.IconUrl;
                    return;
                }

                if (!addMissingFallbackItems) return;

                const parentCode = fallback.ParentId === -3 ? 'REPORTS_ROOT' : fallback.ParentId === -4 ? 'DEFINITIONS_ROOT' : '';
                if (parentCode) {
                    const parent = byCode.get(parentCode);
                    fallback = { ...fallback, ParentId: parent ? menuIdOf(parent) : fallback.ParentId };
                }

                merged.push(fallback);
                byCode.set(fallbackCode, fallback);
            });

            return merged;
        };

        const parseApiData = response => response && response.data !== undefined ? response.data : response;

        const loadAllMenuItems = async () => {
            try {
                const response = await fetch('/MenuSettings/GetAll', { headers: { 'Accept': 'application/json' } });
                if (!response.ok) return [];

                return flattenMenuItems(parseApiData(await response.json()) || []);
            } catch (error) {
                console.warn('[home_index] Tum menu aktiflik bilgisi alinamadi.', error);
                return [];
            }
        };

        const pruneMenusByGlobalActiveState = (items, allMenus) => {
            const flatItems = Array.isArray(items) ? items : [];
            const flatAllMenus = Array.isArray(allMenus) ? allMenus : [];
            if (!flatAllMenus.length) {
                return pruneInactiveMenuItems(flatItems);
            }

            const allById = new Map();
            const allByKey = new Map();
            const inactiveIds = new Set();
            const inactiveKeys = new Set();

            flatAllMenus.forEach(menu => {
                const id = menuIdOf(menu);
                const key = menuIdentityKeyOf(menu);
                if (id !== undefined && id !== null) {
                    allById.set(String(id), menu);
                }
                if (key) {
                    allByKey.set(key, menu);
                }
                if (!menuIsActiveOf(menu)) {
                    if (id !== undefined && id !== null) {
                        inactiveIds.add(String(id));
                    }
                    if (key) {
                        inactiveKeys.add(key);
                    }
                }
            });

            const allMenuFor = item => {
                const id = menuIdOf(item);
                if (id !== undefined && id !== null && allById.has(String(id))) {
                    return allById.get(String(id));
                }

                return allByKey.get(menuIdentityKeyOf(item));
            };

            const hasInactiveParentInAllMenus = item => {
                let current = allMenuFor(item) || item;
                let parentId = menuParentIdOf(current);
                const visited = new Set();

                while (parentId !== undefined && parentId !== null && parentId !== 0) {
                    const key = String(parentId);
                    if (inactiveIds.has(key)) return true;
                    if (visited.has(key) || !allById.has(key)) return false;

                    visited.add(key);
                    current = allById.get(key);
                    parentId = menuParentIdOf(current);
                }

                return false;
            };

            return flatItems.filter(item => {
                const allMenu = allMenuFor(item);
                const key = menuIdentityKeyOf(item);
                const id = allMenu ? menuIdOf(allMenu) : menuIdOf(item);

                if (allMenu && !menuIsActiveOf(allMenu)) return false;
                if (id !== undefined && id !== null && inactiveIds.has(String(id))) return false;
                if (inactiveKeys.has(key)) return false;

                return menuIsActiveOf(item) && !hasInactiveParentInAllMenus(item);
            });
        };

        const loadCurrentRoleIds = async () => {
            try {
                const response = await fetch('/MenuSettings/GetCurrentRoleIds', { headers: { 'Accept': 'application/json' } });
                if (!response.ok) return [];

                return (parseApiData(await response.json()) || [])
                    .map(id => String(id).trim())
                    .filter(Boolean);
            } catch (error) {
                console.warn('[home_index] Rol bilgisi alinamadi.', error);
                return [];
            }
        };

        const canUseFullFallbackMenu = roleIds => roleIds.includes('1') || roleIds.includes('3');
        const hasSystemAdminRole = roleIds => roleIds.includes('1') || roleIds.includes('3');

        const isSystemAdminOnlyMenu = item => {
            const title = String(menuTitleOf(item) || '').trim().toLocaleLowerCase('tr-TR');
            const code = String(getValue(item, 'code', 'Code', 'requiredPermissionCode', 'RequiredPermissionCode') || '').trim().toUpperCase();
            const url = menuUrlOf(item).toLowerCase();

            return url.includes('/menusettings') ||
                url.includes('/pageactionsettings') ||
                code.includes('MENU_SETTINGS') ||
                code.includes('PAGE_ACTION_SETTINGS') ||
                title.includes('menü ayarları') ||
                title.includes('menu ayarları') ||
                title.includes('sayfa aksiyon');
        };

        const pruneSystemAdminOnlyMenus = (items, roleIds) => {
            const canShowSystemAdminOnly = hasSystemAdminRole(roleIds);
            return (Array.isArray(items) ? items : []).filter(item => canShowSystemAdminOnly || !isSystemAdminOnlyMenu(item));
        };

        const applyRoleRestrictedLinks = async (currentRoleIds = null) => {
            const restrictedLinks = Array.from(document.querySelectorAll('[data-role-ids]'));
            if (!restrictedLinks.length) return;

            restrictedLinks.forEach(link => link.classList.add('hidden'));

            try {
                const roleIds = Array.isArray(currentRoleIds) ? currentRoleIds : await loadCurrentRoleIds();

                restrictedLinks.forEach(link => {
                    const allowedRoles = String(link.dataset.roleIds || '').split(',').map(id => id.trim()).filter(Boolean);
                    const canShow = allowedRoles.some(roleId => roleIds.includes(roleId));
                    link.classList.toggle('hidden', !canShow);
                });
            } catch (error) {
                console.warn('[home_index] Rol bazli statik menu kontrolu yapilamadi.', error);
            }
        };

        const flattenMenuItems = (items, parentId = null) => {
            const result = [];
            (items || []).forEach(item => {
                const children = getValue(item, 'menus', 'Menus', 'children', 'Children') || [];
                if (parentId !== null && (menuParentIdOf(item) === undefined || menuParentIdOf(item) === null)) {
                    item.ParentId = parentId;
                }
                result.push(item);
                if (Array.isArray(children) && children.length) {
                    result.push(...flattenMenuItems(children, menuIdOf(item)));
                }
            });
            return result;
        };

        const decodeHtmlEntities = value => {
            const textarea = document.createElement('textarea');
            textarea.innerHTML = String(value || '');
            return textarea.value;
        };

        const renderMenuIcon = (icon, isChild) => {
            let normalizedIcon = decodeHtmlEntities(icon || 'fas fa-circle').trim();
            const classMatch = normalizedIcon.match(/class\s*=\s*["']([^"']+)["']/i);
            if (classMatch && classMatch[1]) {
                normalizedIcon = classMatch[1];
            }

            const isImage = !/^</.test(normalizedIcon) && (/^(https?:)?\/\//i.test(normalizedIcon) || normalizedIcon.includes('/') || /\.(png|jpe?g|gif|webp|svg)$/i.test(normalizedIcon));
            if (isImage) {
                const sizeClass = isChild ? 'w-5 h-5 mr-2' : 'w-6 h-6';
                return `<img src="${escapeHtml(normalizedIcon)}" alt="" class="${sizeClass} object-contain flex-shrink-0">`;
            }

            const className = isChild
                ? `${normalizedIcon} w-5 text-center text-gray-400 mr-2 group-hover:text-green-600 transition-colors`
                : `${normalizedIcon} w-6 text-center text-xl text-gray-500`;

            return `<i class="${escapeHtml(className)}"></i>`;
        };

        const buildMenuLink = (item, isChild) => {
            const title = escapeHtml(menuTitleOf(item));
            const icon = menuIconOf(item);
            const url = escapeHtml(menuUrlOf(item));
            const titleForJs = title.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            const urlForJs = url.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
            const iconMarkup = renderMenuIcon(icon, isChild);

            if (isChild) {
                return `<a href="javascript:void(0);" onclick="openTab('${urlForJs}', '${titleForJs}')" class="flex items-center px-4 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-green-700 transition-colors border-l-2 border-transparent hover:border-green-600 group">
                    ${iconMarkup}<span>${title}</span>
                </a>`;
            }

            return `<div class="sidebar-link-container">
                <a href="javascript:void(0);" onclick="openTab('${urlForJs}', '${titleForJs}')" class="sidebar-link flex items-center px-5 py-2.5 text-gray-700 transition-colors">
                    ${iconMarkup}
                    <span class="ml-3 font-semibold text-sm sidebar-text whitespace-nowrap">${title}</span>
                </a>
            </div>`;
        };

        const buildMenuGroup = (item, children) => {
            const title = escapeHtml(menuTitleOf(item));
            const icon = menuIconOf(item);
            const iconMarkup = renderMenuIcon(icon, false);
            const submenu = children.map(child => buildMenuLink(child, true)).join('');

            return `<div class="sidebar-link-container">
                <div class="sidebar-link flex items-center px-5 py-2.5 text-gray-700 transition-colors cursor-pointer">
                    ${iconMarkup}
                    <span class="ml-3 font-semibold text-sm sidebar-text whitespace-nowrap">${title}</span>
                    <i class="fas fa-chevron-right ml-auto sidebar-text chevron-icon text-xs"></i>
                </div>
                <div class="submenu hidden">${submenu}</div>
            </div>`;
        };

        const loadDynamicSidebarMenu = async () => {
            const container = document.getElementById('menu-links-container');
            const menuUrl = container && container.dataset.authorizedMenuUrl;
            if (!container || !menuUrl) return;

            try {
                const staticMenuMarkup = Array.from(container.querySelectorAll('[data-static-menu]'))
                    .map(element => element.outerHTML)
                    .join('');
                const roleIdsForCheck = await loadCurrentRoleIds();
                let targetUrl = menuUrl;
                if (roleIdsForCheck.includes('1') || roleIdsForCheck.includes('3') || roleIdsForCheck.includes(1) || roleIdsForCheck.includes(3)) {
                    targetUrl = '/MenuSettings/GetAll';
                }
                const response = await fetch(targetUrl, { headers: { 'Accept': 'application/json' } });
                if (!response.ok) return;

                const raw = await response.json();
                const roleIds = await loadCurrentRoleIds();
                const allMenus = await loadAllMenuItems();
                const items = pruneSystemAdminOnlyMenus(
                    pruneMenusByGlobalActiveState(
                        mergeFallbackSidebarItems(flattenMenuItems(parseApiData(raw)), canUseFullFallbackMenu(roleIds)),
                        allMenus
                    ),
                    roleIds
                );
                if (!Array.isArray(items) || items.length === 0) return;

                const activeItems = items.slice().sort((a, b) => menuOrderOf(a) - menuOrderOf(b));
                const childMap = new Map();
                activeItems.forEach(item => {
                    const parentId = menuParentIdOf(item);
                    if (parentId === undefined || parentId === null || parentId === 0) return;
                    const key = String(parentId);
                    if (!childMap.has(key)) childMap.set(key, []);
                    childMap.get(key).push(item);
                });

                const roots = activeItems.filter(item => {
                    const parentId = menuParentIdOf(item);
                    return parentId === undefined || parentId === null || parentId === 0 || !activeItems.some(x => String(menuIdOf(x)) === String(parentId));
                });

                const searchMarkup = `<div class="sidebar-link-container">
                    <div class="relative flex items-center px-5 py-2 text-gray-700 transition-colors overflow-hidden">
                        <i class="fas fa-search w-6 text-center text-xl text-gray-500 flex-shrink-0"></i>
                        <div class="ml-3 flex-grow sidebar-text">
                            <input type="text" id="sidebar-search" placeholder="Menüde Ara..." class="w-full bg-gray-100 border border-gray-200 rounded-md py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-green-700">
                        </div>
                    </div>
                </div>`;

                const dynamicMenuMarkup = roots.map(root => {
                    const children = (childMap.get(String(menuIdOf(root))) || []).sort((a, b) => menuOrderOf(a) - menuOrderOf(b));
                    return children.length ? buildMenuGroup(root, children) : buildMenuLink(root, false);
                }).join('');

                container.innerHTML = searchMarkup + dynamicMenuMarkup + staticMenuMarkup;
                await applyRoleRestrictedLinks(roleIds);
            } catch (error) {
                console.warn('[home_index] Dinamik menü yüklenemedi, statik menü kullanılacak.', error);
                await applyRoleRestrictedLinks();
            }
        };

        await loadDynamicSidebarMenu();
        searchInput = document.getElementById('sidebar-search');

        // Mobil hamburger davranışları
        if (mobileTopHamburger) {
            mobileTopHamburger.style.pointerEvents = 'auto';
            mobileTopHamburger.setAttribute('tabindex', '0');
            mobileTopHamburger.setAttribute('role', 'button');
            mobileTopHamburger.setAttribute('aria-label', 'Menüyü aç');

            const openFromMobileTrigger = (e) => {
                console.log('[home_index] openFromMobileTrigger');
                e && e.stopPropagation && e.stopPropagation();
                e && e.preventDefault && e.preventDefault();
                if (sidebarMenu) {
                    sidebarMenu.classList.remove('hidden');
                    sidebarMenu.style.display = ''; // Force show
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
        const allSidebarLinks = document.querySelectorAll('.sidebar-link-container a');
        allSidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                const container = link.closest('.sidebar-link-container');
                const hasSubmenu = container && container.querySelector('.submenu') !== null;

                // Eğer doğrudan bir link ise veya onclick ile bir sayfa açıyorsa sidebar'ı kapat
                const isDirectLink = !hasSubmenu || link.hasAttribute('onclick');

                if (isDirectLink) {
                    // Mobil ekranlarda her zaman, masaüstünde isPinned değilse kapat
                    if (isMobileView() || !isPinned) {
                        collapseSidebar();
                        hideActiveSubmenu();
                    }
                }
            });
        });

        // Flyout tıklaması
        submenuFlyout && submenuFlyout.addEventListener('click', (e) => {
            // Sadece bir linke tıklandığında sidebar'ı kapat
            const link = e.target.closest('a');
            if (link) {
                if (isMobileView() || !isPinned) {
                    collapseSidebar();
                }
                hideActiveSubmenu();
            }
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
            url = normalizeNavigationUrl(url || dashboardUrl);
            title = title || 'Ana Sayfa';
            console.log('[home_index] openTab called:', url);
            // Mobil görünümde herhangi bir sekme açıldığında sidebar'ı kapat (Overlay'i kaldırmak için)
            if (isMobileView()) {
                collapseSidebar();
                hideActiveSubmenu();
            }

            const normalizeUrl = (u) => u.replace(/\/$/, '').toLowerCase();
            const existingTab = openTabs.find(tab => normalizeUrl(tab.url) === normalizeUrl(url));

            if (existingTab) { switchTab(existingTab.id); return; }
            if (openTabs.length >= MAX_TABS) { alert(`Maksimum ${MAX_TABS} sekme açabilirsiniz.`); return; }

            const tabId = generateId('tab');
            const frameId = generateId('frame');

            const tabButton = document.createElement('button');
            tabButton.className = 'tab-button flex items-center px-3 py-1.5 text-xs font-medium';
            tabButton.dataset.tabId = tabId;
            const isDashboard = normalizeUrl(url) === normalizeUrl(dashboardUrl);
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

                const nativeUrl = isDashboard ? dashboardUrl : normalizeNavigationUrl(window.location.pathname || dashboardUrl);
                openTabs.push({ id: tabId, url: nativeUrl, title: title, isNative: true });

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
        // Ekran boyutu değişimini dinle (Responsive geçişler için)
        let lastWidth = window.innerWidth;
        window.addEventListener('resize', () => {
            const currentWidth = window.innerWidth;
            // 768px eşiği (mobile/desktop) geçildiğinde sidebar durumunu sıfırla
            if ((lastWidth < 768 && currentWidth >= 768) || (lastWidth >= 768 && currentWidth < 768)) {
                console.log('[home_index] resize threshold crossed, collapsing sidebar to reset state');
                collapseSidebar();
            }
            lastWidth = currentWidth;
        });
    }

    // DOMContentLoaded bağlama
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

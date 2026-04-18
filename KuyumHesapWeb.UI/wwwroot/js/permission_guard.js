(function () {
    'use strict';

    const dataOf = response => response && response.data !== undefined ? response.data : response;
    const normalize = value => String(value || '').trim().toUpperCase();
    const normalizeActions = actions => (actions || []).map(action => ({
        code: action && (action.code || action.Code),
        requiredPermissionCode: action && (action.requiredPermissionCode || action.RequiredPermissionCode),
        orderNo: Number(action && (action.orderNo || action.OrderNo || 0)) || 0
    }));

    const actionCodesOf = actions => {
        const codes = [];
        normalizeActions(actions).forEach(action => {
            const actionCode = action.code;
            const permissionCode = action.requiredPermissionCode;
            if (actionCode) codes.push(actionCode);
            if (permissionCode) codes.push(permissionCode);
        });
        return codes;
    };

    const collectPageCodes = () => {
        const codes = [];
        document.querySelectorAll('[data-permission-code]').forEach(element => {
            [
                element.dataset.permissionCode,
                element.dataset.permissionCodeSatis,
                element.dataset.permissionCodeCari,
                element.dataset.actionCode,
                element.dataset.actionCodeSatis,
                element.dataset.actionCodeCari
            ].forEach(code => {
                if (code) codes.push(code);
            });
        });
        return Array.from(new Set(codes.map(normalize).filter(Boolean)));
    };

    const loadCurrentRoleIds = async () => {
        const response = await fetch('/MenuSettings/GetCurrentRoleIds', {
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) return [];

        const json = await response.json();
        const roleIds = dataOf(json) || [];
        return roleIds.map(roleId => String(roleId).trim()).filter(Boolean);
    };

    const hasFullPageActionRole = roleIds => roleIds.includes('1') || roleIds.includes('3');

    const applyPermissionGuard = allowedCodes => {
        const allowed = new Set((allowedCodes || []).map(normalize).filter(Boolean));
        document.querySelectorAll('[data-permission-code]').forEach(element => {
            const required = normalize(element.dataset.permissionCode);
            if (!required || allowed.has(required)) {
                if (element.dataset.permissionOriginalHidden !== 'true') {
                    element.classList.remove('hidden');
                    // element.hidden = false; kaldırıldı
                }
                element.disabled = false;
                element.classList.remove('opacity-50', 'pointer-events-none');
                return;
            }

            // KULLANICI TALEBİ: Yetkisi olmayanlar ekrandan tamamen silinmesin, sadece buzlu dursun
            // element.hidden = true; kaldırıldı
            // element.classList.add('hidden'); kaldırıldı
            element.disabled = true;
            element.classList.add('opacity-50', 'pointer-events-none');
        });
    };

    const getPageCode = () => {
        const pageElement = document.querySelector('[data-page-code]');
        return pageElement ? pageElement.dataset.pageCode : '';
    };

    const isSellAndCariPage = pageCode => normalize(pageCode).startsWith('SATIS_CARI');

    const applyFullPageAccess = effectivePageCode => {
        const allowedCodes = collectPageCodes();
        window.currentPageActionCodes = allowedCodes;
        window.currentPageActions = [];
        applyPermissionGuard(allowedCodes);
        window.dispatchEvent(new CustomEvent('page-actions:loaded', {
            detail: { pageCode: effectivePageCode, actions: [], allowedCodes }
        }));
        return [];
    };

    const loadAuthorizedActions = async pageCode => {
        if (!pageCode) return [];

        const response = await fetch(`/PageActionSettings/GetAuthorizedForCurrentPage?pageCode=${encodeURIComponent(pageCode)}`, {
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) return [];

        const json = await response.json();
        if (json && json.isSuccess === false) return [];
        return normalizeActions(dataOf(json) || []);
    };

    window.applyPageActionPermissions = async pageCode => {
        const effectivePageCode = pageCode || getPageCode();
        const roleIds = await loadCurrentRoleIds();

        if (hasFullPageActionRole(roleIds)) {
            return applyFullPageAccess(effectivePageCode);
        }

        const actions = await loadAuthorizedActions(effectivePageCode);
        const allowedCodes = actionCodesOf(actions);

        // ESKİDEN BURADA OLAN: "Sıfır yetki geliyorsa FullPageAccess ver" geliştirici kuralı, 
        // gerçek rol/izin testlerini bozduğu için Kökünden Silindi! Orjinal güvenlik devrede.

        window.currentPageActionCodes = allowedCodes;
        window.currentPageActions = actions;
        applyPermissionGuard(allowedCodes);
        window.dispatchEvent(new CustomEvent('page-actions:loaded', {
            detail: { pageCode: effectivePageCode, actions, allowedCodes }
        }));
        return actions;
    };

    document.addEventListener('DOMContentLoaded', async () => {
        const guardedElements = document.querySelectorAll('[data-permission-code]');
        if (!guardedElements.length) return;

        guardedElements.forEach(element => {
            element.dataset.permissionOriginalHidden = String(element.hidden || element.classList.contains('hidden'));
            // element.hidden = true; kaldırıldı
            
            // BAŞLANGIÇTA GİZLEMESİN (Kullanıcı talebi)
            // element.classList.add('hidden');
        });

        try {
            await window.applyPageActionPermissions(getPageCode());
        } catch (error) {
            console.warn('[permission_guard] Sayfa aksiyon yetkileri alınamadı.', error);
            applyPermissionGuard([]);
        }
    });
})();

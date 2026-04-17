(function () {
    'use strict';

    const tokenCookieName = 'AuthTokenClient';

    const readCookie = name => {
        const prefix = `${name}=`;
        const cookie = document.cookie
            .split(';')
            .map(value => value.trim())
            .find(value => value.startsWith(prefix));

        return cookie ? decodeURIComponent(cookie.substring(prefix.length)) : '';
    };

    const normalizeToken = token => {
        const value = String(token || '').trim();
        if (!value || value === 'null' || value === 'undefined') return '';
        return value.replace(/^Bearer\s+/i, '').trim();
    };

    const getAuthToken = () => normalizeToken(readCookie(tokenCookieName) || localStorage.getItem('jwt_token'));

    window.khGetAuthToken = getAuthToken;

    window.khGetAuthHeaders = (headers = {}) => {
        const result = new Headers(headers || {});
        const token = getAuthToken();
        const currentAuthorization = result.get('Authorization');

        if (token && (!currentAuthorization || /Bearer\s+(null|undefined)?\s*$/i.test(currentAuthorization))) {
            result.set('Authorization', `Bearer ${token}`);
        }

        return result;
    };

    if (window.fetch && !window.fetch.__khAuthWrapped) {
        const nativeFetch = window.fetch.bind(window);
        const authFetch = (input, init = {}) => {
            const requestHeaders = input instanceof Request ? input.headers : undefined;
            const headers = window.khGetAuthHeaders(init.headers || requestHeaders || {});

            return nativeFetch(input, {
                ...init,
                headers
            });
        };

        authFetch.__khAuthWrapped = true;
        window.fetch = authFetch;
    }
})();

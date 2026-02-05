/* Frontend/config.js - Configuração centralizada do frontend */

// Detectar URL da API automaticamente (desenvolvimento ou produção)
function getAPIUrl() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    } else {
        const protocol = window.location.protocol;
        const host = window.location.host;
        return `${protocol}//${host}/api`;
    }
}

const CONFIG = {
    // API
    API_URL: getAPIUrl(),
    API_TIMEOUT: 5000,
    
    // Storage
    AUTH_TOKEN_KEY: 'centralhits_admin_token',
    ADMIN_SESSION_KEY: 'centralhits_admin_session',
    PRODUCTS_STORAGE_KEY: 'centralhits_products_v2',
    PURCHASES_KEY: 'centralhits_purchases_v1',
    
    // Defaults
    DEFAULT_PASSWORD: 'admin123',
    UPLOAD_SIZE_LIMIT: 50 * 1024 * 1024, // 50MB
    
    // UI
    REFRESH_INTERVAL: 5000, // 5 segundos
};

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

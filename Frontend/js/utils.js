/* Frontend/js/utils.js - Funções utilitárias */

const Utils = {
    // Validação
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    isAuthenticated() {
        return !!localStorage.getItem('centralhits_admin_token');
    },

    redirectIfNotAuthenticated() {
        if (!this.isAuthenticated()) {
            window.location.href = 'admin-login.html';
        }
    },

    // Formatação
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    },

    formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR');
    },

    getFileType(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image';
        if (['mp3', 'wav', 'ogg', 'flac', 'm4a'].includes(ext)) return 'audio';
        return 'file';
    },

    // DOM
    hideElement(selector) {
        const el = document.querySelector(selector);
        if (el) el.style.display = 'none';
    },

    showElement(selector, display = 'block') {
        const el = document.querySelector(selector);
        if (el) el.style.display = display;
    },

    toggleElement(selector) {
        const el = document.querySelector(selector);
        if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
    },

    // Notificações
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 4px;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }
};

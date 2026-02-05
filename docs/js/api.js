/* Frontend/js/api.js - Serviço de API centralizado */

const API_URL = 'http://localhost:5000/api';
const AUTH_TOKEN_KEY = 'centralhits_admin_token';

class APIService {
    static getToken() {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    }

    static setToken(token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    }

    static clearToken() {
        localStorage.removeItem(AUTH_TOKEN_KEY);
    }

    static async request(endpoint, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const token = this.getToken();
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(`${API_URL}${endpoint}`, options);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro na requisição');
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth
    static async login(password) {
        return this.request('/auth/login', 'POST', { password });
    }

    static async logout() {
        return this.request('/auth/logout', 'POST');
    }

    // Products
    static async getProducts() {
        return this.request('/products');
    }

    static async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    static async createProduct(data) {
        return this.request('/products', 'POST', data);
    }

    static async updateProduct(id, data) {
        return this.request(`/products/${id}`, 'PUT', data);
    }

    static async deleteProduct(id) {
        return this.request(`/products/${id}`, 'DELETE');
    }

    static async reorderProducts(order) {
        return this.request('/products/reorder/batch', 'PUT', { order });
    }

    // Comments
    static async addComment(productId, text) {
        return this.request(`/products/${productId}/comments`, 'POST', { text });
    }

    static async deleteComment(productId, commentId) {
        return this.request(`/products/${productId}/comments/${commentId}`, 'DELETE');
    }

    // Upload
    static async uploadFile(file, metadata = {}) {
        const formData = new FormData();
        formData.append('file', file);
        Object.keys(metadata).forEach(key => {
            formData.append(key, metadata[key]);
        });

        const token = this.getToken();
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        try {
            const response = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                headers,
                body: formData
            });

            if (!response.ok) throw new Error('Erro ao fazer upload');
            return await response.json();
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIService;
}

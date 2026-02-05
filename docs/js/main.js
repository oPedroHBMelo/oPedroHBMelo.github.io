/* Frontend/js/main.js - Script principal */

document.addEventListener('DOMContentLoaded', () => {
    // Menu hamburger
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');

    hamburgerBtn.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-active');
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            navLinks.classList.remove('mobile-active');
        }
    });

    // Carregar produtos na loja
    loadShopProducts();

    // Formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});

async function loadShopProducts() {
    try {
        const container = document.getElementById('shopContainer');
        container.innerHTML = '<p class="loading">Carregando produtos...</p>';

        const response = await APIService.request('/products');
        const products = response.products || [];

        if (products.length === 0) {
            container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Nenhum produto disponível</p>';
            return;
        }

        container.innerHTML = products.map(product => `
            <div class="product-card">
                ${product.filePath ? `
                    ${Utils.getFileType(product.filePath) === 'image' 
                        ? `<img src="${product.fileUrl}" alt="${product.name}" class="product-image">`
                        : `<audio controls class="product-audio"><source src="${product.fileUrl}" type="audio/mpeg"></audio>`
                    }
                ` : '<div class="product-placeholder">Sem mídia</div>'}
                <h3>${product.name}</h3>
                <p class="product-title">${product.title}</p>
                <p class="product-description">${product.description}</p>
                ${product.price ? `<p class="product-price">R$ ${parseFloat(product.price).toFixed(2)}</p>` : ''}
                <p class="product-category">${product.category || 'Geral'}</p>
                ${product.comments && product.comments.length > 0 ? `
                    <div class="product-comments">
                        <strong>Comentários (${product.comments.length})</strong>
                        <ul>
                            ${product.comments.slice(-2).map(c => `<li>${c.text}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `).join('');

    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        const container = document.getElementById('shopContainer');
        container.innerHTML = '<p style="color: red;">Erro ao carregar produtos. Tente recarregar.</p>';
    }
}

function handleContactForm(e) {
    e.preventDefault();
    Utils.showNotification('Mensagem enviada com sucesso!', 'success');
    e.target.reset();
}

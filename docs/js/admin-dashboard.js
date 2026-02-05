/* Frontend/js/admin-dashboard.js - Gerenciador do painel admin */

let products = [];
let currentFile = null;

document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    Utils.redirectIfNotAuthenticated();

    // Setup eventos
    setupNavigation();
    setupUploadArea();
    setupMetadataForm();
    setupLogout();
    setupModals();

    // Carregar dados iniciais
    loadProducts();
    updateDashboard();
});

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            switchSection(section);

            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function switchSection(section) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(s => s.classList.remove('active'));

    const titles = {
        'dashboard': '📊 Dashboard',
        'upload': '📤 Upload de Produtos',
        'products': '📦 Gerenciar Produtos',
        'settings': '⚙️ Configurações'
    };

    document.getElementById(`${section}-section`).classList.add('active');
    document.getElementById('sectionTitle').textContent = titles[section] || 'Dashboard';
}

function setupUploadArea() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    uploadArea.addEventListener('click', () => fileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(255, 20, 147, 0.1)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = '';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = '';
        handleFileSelect(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', (e) => {
        handleFileSelect(e.target.files[0]);
    });
}

function handleFileSelect(file) {
    if (!file) return;

    const maxSize = 50 * 1024 * 1024; // 50MB
    const validTypes = ['image/', 'audio/'];
    const isValid = validTypes.some(type => file.type.startsWith(type)) && file.size <= maxSize;

    if (!isValid) {
        Utils.showNotification('Arquivo inválido. Máx. 50MB, apenas imagens e áudio.', 'error');
        return;
    }

    currentFile = file;
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.innerHTML = `
        <div class="upload-content">
            <p>✅ ${file.name}</p>
            <small>${Utils.formatFileSize(file.size)}</small>
        </div>
    `;
}

function setupMetadataForm() {
    const form = document.getElementById('metadataForm');
    form.addEventListener('submit', handleMetadataSubmit);

    document.getElementById('refreshBtn').addEventListener('click', () => {
        loadProducts();
        updateDashboard();
        Utils.showNotification('Dados recarregados', 'success');
    });
}

async function handleMetadataSubmit(e) {
    e.preventDefault();

    if (!currentFile) {
        Utils.showNotification('Selecione um arquivo primeiro', 'error');
        return;
    }

    const submitBtn = e.target.querySelector('button');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
        const metadata = {
            name: document.getElementById('productName').value,
            title: document.getElementById('productTitle').value,
            description: document.getElementById('productDescription').value,
            price: document.getElementById('productPrice').value || 0,
            category: document.getElementById('productCategory').value,
            type: document.getElementById('productType').value
        };

        const result = await APIService.uploadFile(currentFile, metadata);

        Utils.showNotification('Produto enviado com sucesso!', 'success');
        e.target.reset();
        currentFile = null;
        document.getElementById('uploadArea').innerHTML = `
            <div class="upload-content">
                <p>📁 Arrastar arquivos aqui ou clicar para selecionar</p>
                <small>Máximo: 50MB | Formatos: Imagens e Áudio</small>
            </div>
        `;

        loadProducts();
        updateDashboard();
    } catch (error) {
        Utils.showNotification('Erro ao enviar produto: ' + error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Upload & Salvar';
    }
}

async function loadProducts() {
    try {
        const response = await APIService.getProducts();
        products = response.products || [];
        displayProducts();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

function displayProducts() {
    const container = document.getElementById('productsList');
    const searchInput = document.getElementById('searchProducts');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.title.toLowerCase().includes(searchTerm)
    );

    if (filtered.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #b0b0b0;">Nenhum produto encontrado</p>';
        return;
    }

    container.innerHTML = filtered.map(product => `
        <div class="product-item" draggable="true">
            <div class="product-media">
                ${product.filePath ? `
                    ${Utils.getFileType(product.filePath) === 'image'
                        ? `<img src="${product.fileUrl}" alt="${product.name}">`
                        : `<audio controls><source src="${product.fileUrl}" type="audio/mpeg"></audio>`
                    }
                ` : '<div style="width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">Sem mídia</div>'}
            </div>
            <div class="product-info">
                <h4>${product.name}</h4>
                <p><strong>Título:</strong> ${product.title}</p>
                <p><strong>Categoria:</strong> ${product.category || 'N/A'}</p>
                ${product.price ? `<p><strong>Preço:</strong> R$ ${parseFloat(product.price).toFixed(2)}</p>` : ''}
                <p><strong>Comentários:</strong> ${product.comments ? product.comments.length : 0}</p>
                <div class="product-actions">
                    <button class="btn-edit" onclick="editProduct('${product._id}')">Editar</button>
                    <button class="btn-comments" onclick="viewComments('${product._id}')">💬</button>
                    <button class="btn-delete" onclick="deleteProduct('${product._id}')">Deletar</button>
                </div>
            </div>
        </div>
    `).join('');

    // Setup busca
    if (searchInput) {
        searchInput.removeEventListener('input', displayProducts);
        searchInput.addEventListener('input', displayProducts);
    }
}

async function editProduct(productId) {
    const product = products.find(p => p._id === productId);
    if (!product) return;

    document.getElementById('editProductId').value = productId;
    document.getElementById('editName').value = product.name;
    document.getElementById('editTitle').value = product.title;
    document.getElementById('editDescription').value = product.description || '';
    document.getElementById('editPrice').value = product.price || '';
    document.getElementById('editCategory').value = product.category || '';

    document.getElementById('editModal').classList.add('show');
}

async function deleteProduct(productId) {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;

    try {
        await APIService.deleteProduct(productId);
        Utils.showNotification('Produto deletado com sucesso', 'success');
        loadProducts();
        updateDashboard();
    } catch (error) {
        Utils.showNotification('Erro ao deletar: ' + error.message, 'error');
    }
}

async function viewComments(productId) {
    const product = products.find(p => p._id === productId);
    const commentsList = document.getElementById('commentsList');

    if (!product || !product.comments || product.comments.length === 0) {
        commentsList.innerHTML = '<p>Sem comentários</p>';
    } else {
        commentsList.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${product.comments.map((c, i) => `
                    <div style="background: rgba(255,20,147,0.1); padding: 1rem; border-radius: 4px;">
                        <p>${c.text}</p>
                        <small style="color: #b0b0b0;">${Utils.formatDate(c.createdAt)}</small>
                        <button onclick="deleteComment('${productId}', ${i})" style="margin-top: 0.5rem; padding: 0.25rem 0.75rem; background: #f44336; color: white; border: none; border-radius: 3px; cursor: pointer;">Deletar</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    document.getElementById('commentsModal').classList.add('show');
}

async function deleteComment(productId, index) {
    try {
        const product = products.find(p => p._id === productId);
        const commentId = product.comments[index]._id;
        await APIService.deleteComment(productId, commentId);
        Utils.showNotification('Comentário deletado', 'success');
        loadProducts();
        viewComments(productId);
    } catch (error) {
        Utils.showNotification('Erro ao deletar: ' + error.message, 'error');
    }
}

function setupModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').classList.remove('show');
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });

    // Edit Form
    document.getElementById('editForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const productId = document.getElementById('editProductId').value;
        const data = {
            name: document.getElementById('editName').value,
            title: document.getElementById('editTitle').value,
            description: document.getElementById('editDescription').value,
            price: document.getElementById('editPrice').value,
            category: document.getElementById('editCategory').value
        };

        try {
            await APIService.updateProduct(productId, data);
            Utils.showNotification('Produto atualizado', 'success');
            document.getElementById('editModal').classList.remove('show');
            loadProducts();
            updateDashboard();
        } catch (error) {
            Utils.showNotification('Erro: ' + error.message, 'error');
        }
    });
}

function setupLogout() {
    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Sair da sessão?')) {
            APIService.clearToken();
            window.location.href = 'index.html';
        }
    });
}

async function updateDashboard() {
    try {
        const response = await APIService.getProducts();
        const products = response.products || [];

        document.getElementById('totalProducts').textContent = products.length;
        document.getElementById('totalComments').textContent = products.reduce((sum, p) => sum + (p.comments ? p.comments.length : 0), 0);

        // Calcular storage aproximado
        const storageUsed = products.reduce((sum, p) => {
            if (p.filePath) {
                return sum + (Math.random() * 5 + 1); // Simulado
            }
            return sum;
        }, 0);
        document.getElementById('storageUsed').textContent = storageUsed.toFixed(1) + ' MB';

        // Produtos recentes
        const recent = products.slice(-3).reverse();
        document.getElementById('recentProductsList').innerHTML = recent.map(p => `
            <div style="background: rgba(255,20,147,0.05); padding: 1rem; border-left: 3px solid #FF1493; margin-bottom: 1rem; border-radius: 4px;">
                <p><strong>${p.name}</strong></p>
                <p style="color: #b0b0b0; font-size: 0.9rem;">${p.title}</p>
                <small>${Utils.formatDate(p.createdAt)}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao atualizar dashboard:', error);
    }
}

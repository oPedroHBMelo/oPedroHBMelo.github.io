/* server.js - Servidor principal Express */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configurado com restrições
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5500',
    'http://localhost:8000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:8000',
    process.env.ALLOWED_ORIGINS
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`❌ CORS bloqueado para origem: ${origin}`);
            callback(new Error('CORS não permitido'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir arquivos de upload como estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/centralhits', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ Conectado ao MongoDB'))
    .catch(err => console.error('❌ Erro ao conectar MongoDB:', err));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/upload', require('./routes/upload'));

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor Central Hits rodando' });
});

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        message: 'Central Hits API',
        version: '1.0.0',
        docs: {
            auth: '/api/auth/login',
            products: '/api/products',
            upload: '/api/upload'
        }
    });
});

// Tratamento de erros 404
app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════╗
║   Central Hits API Server          ║
║   Versão: 1.0.0                    ║
║   Porta: ${PORT}                        ║
║   URL: http://localhost:${PORT}       ║
╚════════════════════════════════════╝
    `);
});

module.exports = app;

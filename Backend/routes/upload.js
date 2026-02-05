/* routes/upload.js - Rotas para upload de arquivos */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');
const Product = require('../models/Product');

const router = express.Router();

// Configurar diretório de uploads
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${timestamp}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'audio/mpeg',
        'audio/wav',
        'audio/ogg',
        'audio/mp4'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não permitido'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

/**
 * POST /api/upload
 * Fazer upload de arquivo único
 * Requer autenticação
 * Body: FormData com { file, title, description, price, category, position }
 */
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        const { title, description, price, category, position } = req.body;

        // Validações de segurança
        if (!title || title.trim().length === 0) {
            return res.status(400).json({ error: 'Título é obrigatório' });
        }

        if (title.length > 100) {
            return res.status(400).json({ error: 'Título não pode exceder 100 caracteres' });
        }

        if (description && description.length > 500) {
            return res.status(400).json({ error: 'Descrição não pode exceder 500 caracteres' });
        }

        if (price && (isNaN(price) || parseFloat(price) < 0)) {
            return res.status(400).json({ error: 'Preço deve ser um número positivo' });
        }

        // Sanitizar nome de arquivo
        const sanitizedFilename = req.file.filename.replace(/[^a-zA-Z0-9._-]/g, '_');

        // Determinar tipo baseado no mimetype
        const type = req.file.mimetype.startsWith('image') ? 'image' : 'audio';

        // URL relativa para acesso público
        const fileUrl = `/uploads/${sanitizedFilename}`;
        const filePath = req.file.path;

        // Criar produto no banco
        const product = new Product({
            name: req.file.originalname,
            title: title || req.file.originalname,
            type,
            filePath,
            fileUrl,
            description: description || '',
            price: parseFloat(price) || 0,
            category: category || '',
            position: parseInt(position) || 0,
            comments: []
        });

        await product.save();

        res.status(201).json({
            message: 'Arquivo enviado com sucesso',
            product,
            fileUrl
        });
    } catch (error) {
        // Se houver erro, deletar o arquivo
        if (req.file) {
            fs.unlink(req.file.path, () => {});
        }
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/upload/multiple
 * Fazer upload de múltiplos arquivos
 * Requer autenticação
 * Body: FormData com { files } (múltiplos)
 */
router.post('/multiple', authMiddleware, upload.array('files', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        const products = [];

        for (const file of req.files) {
            const type = file.mimetype.startsWith('image') ? 'image' : 'audio';
            const fileUrl = `/uploads/${file.filename}`;

            const product = new Product({
                name: file.originalname,
                title: file.originalname,
                type,
                filePath: file.path,
                fileUrl,
                description: '',
                price: 0,
                category: '',
                position: products.length,
                comments: []
            });

            await product.save();
            products.push(product);
        }

        res.status(201).json({
            message: `${products.length} arquivo(s) enviado(s) com sucesso`,
            products
        });
    } catch (error) {
        // Deletar arquivos em caso de erro
        if (req.files) {
            req.files.forEach(file => {
                fs.unlink(file.path, () => {});
            });
        }
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

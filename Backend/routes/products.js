/* routes/products.js - Rotas para gerenciamento de produtos */

const express = require('express');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/products
 * Listar todos os produtos ordenados por posição
 * Query params: ?category=value (opcional)
 */
router.get('/', async (req, res) => {
    try {
        let query = {};
        if (req.query.category) {
            query.category = req.query.category;
        }

        const products = await Product.find(query).sort({ position: 1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/products/:id
 * Obter detalhes de um produto
 */
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/products
 * Criar novo produto (requer autenticação)
 * Body: { title, description, price, category, position, fileUrl, filePath, type, name }
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, price, category, position, fileUrl, filePath, type, name } = req.body;

        if (!title || !fileUrl || !filePath || !type) {
            return res.status(400).json({ error: 'Campos obrigatórios: title, fileUrl, filePath, type' });
        }

        const product = new Product({
            title,
            name: name || title,
            description: description || '',
            price: price || 0,
            category: category || '',
            position: position || 0,
            fileUrl,
            filePath,
            type,
            comments: []
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/products/:id
 * Atualizar produto (requer autenticação)
 * Body: { title, description, price, category, position }
 */
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { title, description, price, category, position } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                title: title !== undefined ? title : undefined,
                description: description !== undefined ? description : undefined,
                price: price !== undefined ? price : undefined,
                category: category !== undefined ? category : undefined,
                position: position !== undefined ? position : undefined,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/products/:id
 * Deletar produto (requer autenticação)
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        // TODO: Deletar arquivo do servidor aqui
        // fs.unlink(product.filePath, (err) => { ... })

        res.json({ message: 'Produto deletado com sucesso', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/products/:id/comments
 * Adicionar comentário a um produto
 * Body: { text: string }
 */
router.post('/:id/comments', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Texto do comentário obrigatório' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        product.comments.push({
            id: Date.now().toString(),
            text,
            date: new Date()
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/products/:id/comments/:commentId
 * Deletar comentário (requer autenticação)
 */
router.delete('/:id/comments/:commentId', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        product.comments = product.comments.filter(c => c.id !== req.params.commentId);
        await product.save();

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * PUT /api/products/:id/reorder
 * Reordenar produtos (requer autenticação)
 * Body: { order: [{ id, position }, ...] }
 */
router.put('/reorder/batch', authMiddleware, async (req, res) => {
    try {
        const { order } = req.body; // Array de { id, position }

        if (!Array.isArray(order)) {
            return res.status(400).json({ error: 'order deve ser um array' });
        }

        // Atualizar cada produto com sua nova posição
        for (const item of order) {
            await Product.findByIdAndUpdate(item.id, { position: item.position });
        }

        const updated = await Product.find().sort({ position: 1 });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

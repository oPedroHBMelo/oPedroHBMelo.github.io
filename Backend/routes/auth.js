/* routes/auth.js - Rotas de autenticação */

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

/**
 * POST /api/auth/login
 * Login do administrador
 * Body: { password: string }
 * Response: { token: string, admin: { id, role } }
 */
router.post('/login', async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Senha não fornecida' });
        }

        if (password !== ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        const token = jwt.sign(
            { id: 'admin', role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            admin: { id: 'admin', role: 'admin' }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/auth/logout
 * Logout (apenas marca no frontend)
 */
router.post('/logout', (req, res) => {
    res.json({ message: 'Logout realizado' });
});

module.exports = router;

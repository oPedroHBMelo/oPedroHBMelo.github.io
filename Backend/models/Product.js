/* models/Product.js - Schema para produtos no MongoDB */

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    id: { type: String, default: () => Date.now().toString() },
    text: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['image', 'audio'], required: true },
    filePath: { type: String, required: true }, // Caminho do arquivo no servidor
    fileUrl: { type: String, required: true }, // URL pública para acesso
    description: { type: String, default: '' },
    price: { type: Number, default: 0 },
    category: { type: String, default: '' },
    position: { type: Number, default: 0 },
    comments: [commentSchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Índice para ordenação por posição
productSchema.index({ position: 1 });

module.exports = mongoose.model('Product', productSchema);

const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Ruta para obtener productos con paginación
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = '', category, available } = req.query;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {}
        };

        const filter = {};
        if (query.trim()) {
            filter.$or = [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ];
        }
        if (category) filter.category = category;
        if (available === 'false') filter.stock = 0;

        const result = await Product.paginate(filter, options);
        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}&category=${category}&available=${available}` : null,
            nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}&category=${category}&available=${available}` : null,
        });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});

// Actualización de un producto
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.pid, req.body, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json({ status: 'success', message: 'Producto actualizado', payload: updatedProduct });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
});

// Eliminación de un producto
router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado.' });
        res.json({ status: 'success', message: 'Producto eliminado', payload: deletedProduct });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
});

module.exports = router;

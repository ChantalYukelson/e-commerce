const express = require('express');
const Cart = require('../models/Cart');
const { createCart, addProductToCart, updateCart, clearCart } = require('../controllers/cart.controller');

const router = express.Router();

// Crear un nuevo carrito
router.post('/', createCart);

// Obtener el carrito del usuario actual
router.get('/', async (req, res) => {
    try {
        const cartId = req.session.cartId;
        const cart = await Cart.findById(cartId).populate('products.product');
        if (!cart) return res.render('cart', { title: 'Carrito', products: [] });
        res.render('cart', { title: 'Carrito', products: cart.products });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al obtener el carrito');
    }
});

// Agregar un producto al carrito
router.post('/:cid/products/:pid', addProductToCart);

// Eliminar todos los productos del carrito
router.delete('/:cid', clearCart);

module.exports = router;

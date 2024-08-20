import { Router } from 'express';
import CartManager from '../service/CartManager.js';

const router = Router();
const cartManager = new CartManager();


router.post('/', (req, res) => {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = cartManager.getCartById(cartId);
    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});


router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const updatedCart = cartManager.addProductToCart(cartId, productId);
    if (updatedCart) {
        res.json(updatedCart);
    } else {
        res.status(404).json({ error: 'Carrito no encontrado o producto no encontrado' });
    }
});

export default router;

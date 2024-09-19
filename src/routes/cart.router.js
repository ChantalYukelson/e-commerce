import { Router } from 'express';
import CartManager from '../service/CartManager.js'; // Luego reemplazar por el modelo de MongoDB

const router = Router();
const cartManager = new CartManager();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
});

// Obtener productos de un carrito con populate
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCartById(cartId).populate('products.productId'); // Usar populate para obtener detalles completos
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// Agregar un producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const updatedCart = await cartManager.addProductToCart(cartId, productId);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.removeProductFromCart(cid, pid);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto del carrito' });
    }
});

// Actualizar la cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});

// Vaciar un carrito
router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const emptiedCart = await cartManager.clearCart(cid);
        res.json(emptiedCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al vaciar el carrito' });
    }
});

export default router;

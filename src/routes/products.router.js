import { Router } from "express";
import ProductManager from "../service/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

// Recibe `io` desde el servidor principal
export default (io) => {
    router.get('/', async (req, res) => {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
            const products = await productManager.getAllProducts(limit);
            res.json(products);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al obtener los productos' });
        }
    });

    router.post('/', async (req, res) => {
        try {
            const { title, description, code, price, stock, category, thumbnails } = req.body;
            if (!title || !description || !code || !price || !stock || !category) {
                return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
            }

            const newProduct = await productManager.addProduct({ title, description, code, price, stock, category, thumbnails });
            
            // Emitir el evento de WebSocket para actualizar la lista en tiempo real
            io.emit('productListUpdate', newProduct);

            res.status(201).json(newProduct);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al agregar el producto' });
        }
    });

    router.delete('/:pid', async (req, res) => {
        try {
            const productId = parseInt(req.params.pid);
            const deletedProduct = await productManager.deleteProduct(productId);
            if (deletedProduct) {
                // Emitir el evento de WebSocket para notificar la eliminación del producto
                io.emit('productDeleted', productId);
                res.json(deletedProduct);
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    });

    return router;
};

import { Router } from "express";
import ProductManager from "../service/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

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

router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
        }

        const newProduct = await productManager.addProduct({ title, description, code, price, stock, category, thumbnails });
        res.status(201).json(newProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updateProduct = await productManager.updateProduct(productId, req.body);
        if (updateProduct) {
            res.json(updateProduct);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const deletedProduct = await productManager.deleteProduct(productId); // Asegúrate de que este método se llame `deleteProduct`
        if (deletedProduct) {
            res.json(deletedProduct);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default router;

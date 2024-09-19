import { Router } from "express";
import ProductManager from "../service/ProductManager.js"; // Luego cambiar por el modelo de MongoDB

const router = Router();
const productManager = new ProductManager();

// Recibe `io` desde el servidor principal
export default (io) => {
    router.get('/', async (req, res) => {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;
            
            // Filtro basado en query
            const filter = query ? { category: query } : {}; // Buscar por categoría o disponibilidad

            // Orden ascendente o descendente
            const sortOption = sort === 'asc' ? { price: 1 } : { price: -1 };

            // Obtener productos con filtro, paginación y ordenamiento
            const products = await productManager.getAllProducts({
                filter,
                limit: parseInt(limit),
                page: parseInt(page),
                sort: sortOption
            });

            // Contar productos y calcular total de páginas
            const totalProducts = await productManager.countProducts(filter);
            const totalPages = Math.ceil(totalProducts / limit);

            // Estructura de respuesta solicitada
            res.json({
                status: 'success',
                payload: products,
                totalPages,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                page: parseInt(page),
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${parseInt(page) + 1}&sort=${sort}&query=${query}` : null
            });
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

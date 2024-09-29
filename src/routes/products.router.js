import { Router } from 'express';
import {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';

const router = Router();

export default (io) => {
    router.get('/', getProducts); // Ruta para obtener productos con filtros
    router.get('/:id', getProductById); // Obtener producto por ID
    router.post('/', addProduct); // Agregar un nuevo producto
    router.put('/:id', updateProduct); // Actualizar producto existente
    router.delete('/:id', deleteProduct); // Eliminar producto

    return router;
};

import { Router } from 'express';
import {
  getCartById,
  addProductToCart,
  removeProductFromCart,
  updateProductQuantity,
  clearCart,
} from '../controllers/cart.controller.js';

const router = Router();

router.get('/', getCartById); // Obtener el carrito de la sesión
router.post('/product/:pid', addProductToCart); // Agregar producto
router.delete('/product/:pid', removeProductFromCart); // Eliminar producto
router.put('/product/:pid', updateProductQuantity); // Actualizar cantidad
router.delete('/', clearCart); // Vaciar el carrito

export default router;

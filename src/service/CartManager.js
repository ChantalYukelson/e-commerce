import mongoose from 'mongoose'; // Importa mongoose para usar ObjectId
import Cart from '../models/Cart.js'; // Importa el modelo de MongoDB para carritos

export default class CartManager {
    // Crear un nuevo carrito vacío
    async createCart() {
        try {
            const newCart = new Cart({ products: [] });
            return await newCart.save(); // Guardar el nuevo carrito en la base de datos
        } catch (error) {
            throw new Error(`Error al crear el carrito: ${error.message}`);
        }
    }

    // Obtener un carrito por ID (asegurándote de que el ID sea un ObjectId válido)
    async getCartById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('ID de carrito no válido');
            }

            const cart = await Cart.findById(id).populate('products.product');
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart;
        } catch (error) {
            throw new Error(`Error al obtener el carrito: ${error.message}`);
        }
    }

    // Agregar un producto al carrito (o incrementar la cantidad si ya existe)
    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (productIndex !== -1) {
                // Si el producto ya está en el carrito, incrementa la cantidad
                cart.products[productIndex].quantity += quantity;
            } else {
                // Si el producto no está en el carrito, lo agrega
                cart.products.push({ product: productId, quantity });
            }
            return await cart.save(); // Guarda el carrito actualizado en la base de datos
        } catch (error) {
            throw new Error(`Error al agregar producto al carrito: ${error.message}`);
        }
    }

    // Actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) return null;

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
            if (productIndex !== -1) {
                if (quantity > 0) {
                    cart.products[productIndex].quantity = quantity;
                } else {
                    // Si la cantidad es menor o igual a 0, eliminar el producto
                    cart.products.splice(productIndex, 1);
                }
                return await cart.save();
            }
            return null;
        } catch (error) {
            throw new Error(`Error al actualizar la cantidad del producto: ${error.message}`);
        }
    }

    // Eliminar un producto del carrito
    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) return null;

            cart.products = cart.products.filter(p => p.product.toString() !== productId);
            return await cart.save(); // Guarda el carrito actualizado en la base de datos
        } catch (error) {
            throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
        }
    }

    // Vaciar el carrito
    async clearCart(cartId) {
        try {
            const cart = await this.getCartById(cartId);
            if (!cart) return null;

            cart.products = []; // Vaciar el array de productos
            return await cart.save(); // Guarda el carrito vacío en la base de datos
        } catch (error) {
            throw new Error(`Error al vaciar el carrito: ${error.message}`);
        }
    }
}


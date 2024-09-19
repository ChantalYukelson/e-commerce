import Cart from '../models/Cart.js'; // Importa el modelo de MongoDB para carritos

export default class CartManager {

    // Crear un nuevo carrito vacío
    async createCart() {
        const newCart = new Cart({ products: [] });
        return await newCart.save(); // Guardar el nuevo carrito en la base de datos
    }

    // Obtener un carrito por ID (utilizando populate para obtener detalles completos de los productos)
    async getCartById(id) {
        return await Cart.findById(id).populate('products.product'); // Utiliza populate para traer la información del producto
    }

    // Agregar un producto al carrito (o incrementar la cantidad si ya existe)
    async addProductToCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);
        if (productIndex !== -1) {
            // Si el producto ya está en el carrito, incrementa la cantidad
            cart.products[productIndex].quantity += 1;
        } else {
            // Si el producto no está en el carrito, lo agrega
            cart.products.push({ product: productId, quantity: 1 });
        }
        return await cart.save(); // Guarda el carrito actualizado en la base de datos
    }

    // Actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await this.getCartById(cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            return await cart.save();
        }
        return null;
    }

    // Eliminar un producto del carrito
    async removeProductFromCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        if (!cart) return null;

        cart.products = cart.products.filter(p => p.product._id.toString() !== productId);
        return await cart.save(); // Guardar el carrito actualizado
    }

    // Vaciar un carrito (eliminar todos los productos)
    async clearCart(cartId) {
        const cart = await this.getCartById(cartId);
        if (!cart) return null;

        cart.products = []; // Vacía el carrito
        return await cart.save(); // Guarda el carrito vacío en la base de datos
    }
}

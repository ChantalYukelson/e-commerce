const mongoose = require('mongoose');
const Cart = require('../models/Cart'); // Asegúrate de que la ruta sea correcta

class CartManager {
    constructor() {
        this.init(); // Conectar a la base de datos al inicializar la instancia
    }

    async init() {
        try {
            // Asegúrate de que Mongoose está conectado
            await mongoose.connect('mongodb+srv://chantuyukel:InAQTDBdKSPC1bcs@clustercoder.1r9ot.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=ClusterCoder', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Conectado a MongoDB');
        } catch (err) {
            console.error('Error al conectar a MongoDB:', err);
        }
    }

    async createCart() {
        try {
            const newCart = new Cart({ products: [] });
            await newCart.save();
            return newCart;
        } catch (err) {
            console.error('Error al crear el carrito:', err);
            return null;
        }
    }

    async getCartById(id) {
        try {
            const cart = await Cart.findById(id);
            return cart || null;
        } catch (err) {
            console.error('Error al obtener el carrito por ID:', err);
            return null;
        }
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (cart) {
                const existingProduct = cart.products.find(p => p.product.toString() === productId);
                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    cart.products.push({ product: productId, quantity: 1 });
                }
                await cart.save();
                return cart;
            }
            return null;
        } catch (err) {
            console.error('Error al agregar el producto al carrito:', err);
            return null;
        }
    }
}

module.exports = CartManager;

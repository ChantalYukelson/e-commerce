import Cart from '../models/Cart.js'; // Importa el modelo de carrito
import Product from '../models/Product.js'; // Importa el modelo de producto

class CartManager {
    async createCart() {
        const newCart = new Cart({ products: [] });
        await newCart.save();
        return newCart;
    }

    async getCartById(cartId) {
        const cart = await Cart.findById(cartId).populate('products.product');
        const totalPrice = cart.products.reduce((total, item) => total + item.product.price * item.quantity, 0);
        return { cart, totalPrice }; // Retornar el carrito y el precio total
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await Cart.findById(cartId);
        const product = await Product.findById(productId);

        if (!cart || !product) {
            throw new Error('Carrito o producto no encontrado');
        }

        const productInCart = cart.products.find(p => p.product.equals(productId));

        if (productInCart) {
            productInCart.quantity += quantity; // Aumentar la cantidad
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await Cart.findById(cartId);

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        cart.products = cart.products.filter(p => !p.product.equals(productId));
        await cart.save();
        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productInCart = cart.products.find(p => p.product.equals(productId));

        if (productInCart) {
            if (quantity > 0) {
                productInCart.quantity = quantity;
            } else {
                // Si la cantidad es menor o igual a 0, eliminar el producto
                cart.products = cart.products.filter(p => !p.product.equals(productId));
            }
        }

        await cart.save();
        return cart;
    }

    async clearCart(cartId) {
        const cart = await Cart.findById(cartId);

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        cart.products = [];
        await cart.save();
        return cart;
    }
}

const cartManager = new CartManager();

export const createCart = async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito' });
    }
};

// Obtener productos de un carrito
export const getCartById = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const { cart, totalPrice } = await cartManager.getCartById(cartId);
        if (cart) {
            res.json({ cart, totalPrice }); // Retorna el carrito con el total
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: `Error al obtener el carrito: ${error.message}` });
    }
};

// Agregar un producto al carrito
export const addProductToCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity = 1 } = req.body; // Obtén la cantidad desde el cuerpo de la solicitud
        console.log(`Agregando producto ${productId} al carrito ${cartId} con cantidad ${quantity}`);
        
        const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
        console.log('Carrito actualizado:', updatedCart); // Ver el carrito actualizado
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: `Error al agregar el producto al carrito: ${error.message}` });
    }
};

// Eliminar un producto del carrito
export const removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.removeProductFromCart(cid, pid);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: `Error al eliminar el producto del carrito: ${error.message}` });
    }
};

// Actualizar la cantidad de un producto en el carrito
export const updateProductQuantity = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body; // Obtener la cantidad desde el cuerpo de la solicitud
        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ error: `Error al actualizar la cantidad del producto: ${error.message}` });
    }
};

// Vaciar un carrito
export const clearCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const emptiedCart = await cartManager.clearCart(cid);
        res.json(emptiedCart);
    } catch (error) {
        res.status(500).json({ error: `Error al vaciar el carrito: ${error.message}` });
    }
};

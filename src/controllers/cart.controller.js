import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

class CartManager {
  async createCart() {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    return newCart;
  }

  async getCartById(cartId) {
    const cart = await Cart.findById(cartId).populate('products.product');
    const totalPrice = cart.products.reduce((total, item) => total + item.product.price * item.quantity, 0);
    return { cart, totalPrice };
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await Cart.findById(cartId);
    const product = await Product.findById(productId);

    const productInCart = cart.products.find(p => p.product.equals(productId));
    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return cart;
  }

  async removeProductFromCart(cartId, productId) {
    const cart = await Cart.findById(cartId);
    cart.products = cart.products.filter(p => !p.product.equals(productId));
    await cart.save();
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    const productInCart = cart.products.find(p => p.product.equals(productId));

    if (productInCart) {
      if (quantity > 0) {
        productInCart.quantity = quantity;
      } else {
        cart.products = cart.products.filter(p => !p.product.equals(productId));
      }
    }

    await cart.save();
    return cart;
  }

  async clearCart(cartId) {
    const cart = await Cart.findById(cartId);
    cart.products = [];
    await cart.save();
    return cart;
  }
}

const cartManager = new CartManager();

export const getCartById = async (req, res) => {
  try {
    const cartId = req.session.cartId; // Usar el ID de la sesión
    console.log("ID del carrito en la sesión:", cartId); // Verificar el ID del carrito
    const { cart, totalPrice } = await cartManager.getCartById(cartId);
    console.log("Contenido del carrito:", cart); // Verificar el contenido del carrito
    res.render('cartDetails', { cart, totalPrice });
  } catch (error) {
    res.status(500).json({ error: `Error al obtener el carrito: ${error.message}` });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const cartId = req.session.cartId;
    console.log("ID del carrito en la sesión:", cartId); // Verificar el ID del carrito
    const productId = req.params.pid;
    const { quantity = 1 } = req.body;
    const updatedCart = await cartManager.addProductToCart(cartId, productId, quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: `Error al agregar producto al carrito: ${error.message}` });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const cartId = req.session.cartId;
    const productId = req.params.pid;
    const updatedCart = await cartManager.removeProductFromCart(cartId, productId);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: `Error al eliminar producto del carrito: ${error.message}` });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const cartId = req.session.cartId;
    const productId = req.params.pid;
    const { quantity } = req.body;
    const updatedCart = await cartManager.updateProductQuantity(cartId, productId, quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: `Error al actualizar la cantidad del producto: ${error.message}` });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cartId = req.session.cartId;
    const updatedCart = await cartManager.clearCart(cartId);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: `Error al vaciar el carrito: ${error.message}` });
  }
};

const Cart = require('../models/Cart'); // Asegúrate de tener un modelo de Cart
const Product = require('../models/Product'); // Asegúrate de tener un modelo de Product

// Crear un nuevo carrito
const createCart = async (req, res) => {
    try {
        console.log("Creando carrito");
        const newCart = new Cart();
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el carrito', error });
    }
};

// Agregar un producto al carrito
const addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;

    try {
        console.log(`Buscando carrito con ID: ${cid}`);
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        console.log(`Buscando producto con ID: ${pid}`);
        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        res.json({ message: 'Producto agregado al carrito', cart });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: 'Error al agregar producto al carrito', error });
    }
};

// Obtener todos los productos en un carrito específico
const getCartDetails = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product', null, null, { strictPopulate: false });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error al obtener el carrito', error });
    }
};

// Eliminar un producto del carrito
const removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Filtrar el producto a eliminar
        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();

        res.json({ message: 'Producto eliminado del carrito', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el producto del carrito', error });
    }
};

// Actualizar un carrito con un arreglo de productos
const updateCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const products = req.body.products; // Espera un arreglo de productos con el formato { product: productId, quantity: quantity }
        
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Limpiar productos actuales y agregar los nuevos
        cart.products = []; // Limpiar el carrito actual
        products.forEach(({ product, quantity }) => {
            cart.products.push({ product, quantity }); // Agregar cada producto al carrito
        });

        await cart.save();
        res.json({ message: 'Carrito actualizado', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el carrito', error });
    }
};

// Actualizar cantidad de productos
const updateProductQuantity = async (req, res) => {
    const { cid, pid } = req.params;  // cid = carrito ID, pid = producto ID
    const { quantity } = req.body;  // Obtiene la cantidad desde el cuerpo de la solicitud

    // Verifica que el valor de quantity sea un número válido
    if (!quantity || isNaN(quantity) || quantity < 1) {
        return res.status(400).json({ message: 'La cantidad debe ser un número válido mayor que 0' });
    }

    try {
        console.log(`Buscando carrito con ID: ${cid}`);
        const cart = await Cart.findById(cid).populate('products.product', 'name');  // Encuentra el carrito por su ID
        if (!cart) {
            console.log(`Carrito no encontrado con ID: ${cid}`);
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        console.log(`Buscando producto con ID: ${pid}`);
        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
        if (productIndex === -1) {
            console.log(`Producto no encontrado en el carrito con ID: ${pid}`);
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        const product = cart.products[productIndex].product;
        console.log(`Producto: ${product.name} | ID: ${product._id} | Cantidad actual: ${cart.products[productIndex].quantity}`);

        const newQuantity = parseInt(quantity, 10);
        cart.products[productIndex].quantity = newQuantity;

        console.log(`Cantidad actualizada a: ${newQuantity}`);

        await cart.save();
        console.log('Cantidad del producto actualizada correctamente');
        res.json({ message: 'Cantidad del producto reemplazada y actualizada', cart });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto:', error);
        res.status(500).json({ message: 'Error al actualizar la cantidad del producto', error });
    }
};

// Eliminar todos los productos del carrito
const clearCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        cart.products = [];
        await cart.save();
        res.json({ message: 'Todos los productos han sido eliminados del carrito', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar los productos del carrito', error });
    }
};

module.exports = {
    createCart,
    addProductToCart,
    getCartDetails,
    removeProductFromCart,
    updateCart,
    updateProductQuantity,
    clearCart,
};

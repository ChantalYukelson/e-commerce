const Product = require('../models/Product');
const mongoose = require('mongoose');

// Obtener todos los productos con paginación, filtrado y ordenamiento
const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
        };

        const filter = query ? { $text: { $search: query } } : {};
        const result = await Product.paginate(filter, options);

        // Mapear los productos para incluir los campos adicionales
        const productsWithDetails = result.docs.map(product => ({
            _id: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
        }));

        res.render('products', {
            products: productsWithDetails, // Usar el nuevo array mapeado
            title: 'Lista de Productos',
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        console.error('Error en getProducts:', error);
        res.status(500).send('Error al obtener los productos');
    }
};
// Obtener un producto específico por ID
const getProductById = async (req, res) => {
    try {
        const productId = mongoose.Types.ObjectId(req.params.pid); // Cast a ObjectId
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.render('productDetail',   
 { product });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error });
    }
};

// Agregar un nuevo producto
const addProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json({ status: 'success', payload: savedProduct });
    } catch (error) {
        console.error('Error en addProduct:', error);
        res.status(500).json({ message: 'Error al agregar el producto', error });
    }
};

// Actualizar un producto por su ID
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        const updateData = { ...req.body };

        // Eliminar el campo _id si está presente
        delete updateData._id;

        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
        if (updatedProduct) {
            res.status(200).json({ status: 'success', payload: updatedProduct });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error en updateProduct:', error);
        res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
};


// Eliminar un producto por su ID
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (deletedProduct) {
            res.status(200).json({ status: 'success', message: 'Producto eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error('Error en deleteProduct:', error);
        res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
};

const deleteAllProducts = async (req, res) => {
    try {
        await Product.deleteMany({});
        res.status(200).json({ status: 'success', message: 'Todos los productos han sido eliminados.' });
    } catch (error) {
        console.error('Error al eliminar productos:', error);
        res.status(500).json({ status: 'error', message: 'Error al eliminar productos', error });
    }
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    deleteAllProducts,
};
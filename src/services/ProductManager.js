const mongoose = require('mongoose');
const Product = require('../models/Product');

class ProductManager {
    constructor() {
        this.init();
    }

    async init() {
        try {
            await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Conectado a MongoDB');
        } catch (err) {
            console.error('Error al conectar a MongoDB:', err);
        }
    }

    async getAllProducts(limit, page) {
        try {
            const products = await Product.find()
                .limit(limit)
                .skip((page - 1) * limit);
            return products;
        } catch (err) {
            console.error('Error al obtener los productos:', err);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            return product || null;
        } catch (err) {
            console.error('Error al obtener el producto por ID:', err);
            return null;
        }
    }

    async addProduct(product) {
        try {
            const newProduct = new Product(product);
            await newProduct.save();
            return newProduct;
        } catch (err) {
            console.error('Error al agregar el producto:', err);
            return null;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
            return updatedProduct || null;
        } catch (err) {
            console.error('Error al actualizar el producto:', err);
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            return deletedProduct || null;
        } catch (err) {
            console.error('Error al eliminar el producto:', err);
            return null;
        }
    }
}

module.exports = ProductManager;
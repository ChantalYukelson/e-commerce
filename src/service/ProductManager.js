import mongoose from 'mongoose';
import Product from '../models/Product.js';

class ProductManager {
    // Obtener todos los productos con paginación, filtros y ordenamiento
    async getAllProducts({ filter = {}, limit = 10, page = 1, sort = {} }) {
        try {
            // Contar el total de productos para la paginación
            const totalProducts = await Product.countDocuments(filter);

            // Obtener productos con paginación, filtros y ordenamiento
            const products = await Product.find(filter)
                .limit(limit)
                .skip((page - 1) * limit)
                .sort(sort);

            // Devolver los productos y la información de la paginación
            return {
                products,
                totalPages: Math.ceil(totalProducts / limit),
                currentPage: page,
                totalProducts,
            };
        } catch (err) {
            console.error('Error al obtener los productos:', err);
            return { products: [], totalPages: 0, currentPage: page, totalProducts: 0 };
        }
    }

    // Obtener un producto por ID
    async getProductById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                console.error('ID inválido');
                return null;
            }
            const product = await Product.findById(id);
            return product || null;
        } catch (err) {
            console.error('Error al obtener el producto por ID:', err);
            return null;
        }
    }

    // Agregar un nuevo producto
    async addProduct(productData) {
        try {
            const newProduct = new Product(productData);
            await newProduct.save();
            console.log('Producto agregado:', newProduct);
            return newProduct;
        } catch (err) {
            console.error('Error al agregar el producto:', err);
            return null;
        }
    }

    // Actualizar un producto por ID
    async updateProduct(id, updatedFields) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                console.error('ID inválido');
                return null;
            }
            const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });
            return updatedProduct || null;
        } catch (err) {
            console.error('Error al actualizar el producto:', err);
            return null;
        }
    }

    // Eliminar un producto por ID
    async deleteProduct(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                console.error('ID inválido');
                return null;
            }
            const deletedProduct = await Product.findByIdAndDelete(id);
            return deletedProduct || null;
        } catch (err) {
            console.error('Error al eliminar el producto:', err);
            return null;
        }
    }
}

export default ProductManager;

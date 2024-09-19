import Product from '../models/Product.js'; // Importa el modelo de MongoDB

export default class ProductManager {
    
    // Obtener todos los productos con filtros, paginación y ordenamiento
    async getAllProducts({ filter = {}, limit = 10, page = 1, sort = {} }) {
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort
        };
        return await Product.paginate(filter, options); // Utiliza paginación de MongoDB
    }

    // Obtener producto por ID
    async getProductById(id) {
        return await Product.findById(id);
    }

    // Agregar un nuevo producto
    async addProduct(productData) {
        const newProduct = new Product(productData);
        return await newProduct.save(); // Guardar el nuevo producto en la base de datos
    }

    // Actualizar un producto por ID
    async updateProduct(id, updatedFields) {
        return await Product.findByIdAndUpdate(id, updatedFields, { new: true }); // Actualizar y devolver el producto actualizado
    }

    // Eliminar un producto por ID
    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id); // Eliminar producto de la base de datos
    }

    // Contar el número total de productos (para la paginación)
    async countProducts(filter = {}) {
        return await Product.countDocuments(filter);
    }
}

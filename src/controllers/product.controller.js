import ProductManager from '../service/ProductManager.js';

const productManager = new ProductManager();

// Obtener todos los productos con paginación, filtrado y ordenamiento
export const getProducts = async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        // Filtros de búsqueda
        const filter = query
            ? { $or: [{ category: query }, { title: { $regex: query, $options: 'i' } }] }
            : {};

        // Ordenamiento por precio (ascendente o descendente)
        let sortOption = {};
        if (sort === 'asc') sortOption = { price: 1 };
        if (sort === 'desc') sortOption = { price: -1 };

        // Llamada a la base de datos con paginación, límite, filtro y ordenamiento
        const { products, totalPages, currentPage, totalProducts } = await productManager.getAllProducts({
            filter,
            limit: parseInt(limit),
            page: parseInt(page),
            sort: sortOption
        });

        // Configurar enlaces de paginación
        const prevPage = currentPage > 1 ? currentPage - 1 : null;
        const nextPage = currentPage < totalPages ? currentPage + 1 : null;
        const prevLink = prevPage
            ? `/api/products?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}`
            : null;
        const nextLink = nextPage
            ? `/api/products?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}`
            : null;

        // Devolver la respuesta en formato JSON
        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage,
            nextPage,
            page: currentPage,
            hasPrevPage: prevPage !== null,
            hasNextPage: nextPage !== null,
            prevLink,
            nextLink,
            totalProducts
        });
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productManager.getProductById(id);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ status: 'success', payload: product });
    } catch (error) {
        console.error('Error al obtener producto por ID:', error.message);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

// Agregar un nuevo producto
export const addProduct = async (req, res) => {
    try {
        const productData = req.body;
        const newProduct = await productManager.addProduct(productData);

        if (!newProduct) {
            return res.status(400).json({ error: 'No se pudo agregar el producto' });
        }

        res.json({ status: 'success', payload: newProduct });
    } catch (error) {
        console.error('Error al agregar el producto:', error.message);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
};

// Actualizar un producto por ID
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedFields = req.body;
        const updatedProduct = await productManager.updateProduct(id, updatedFields);

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado o no actualizado' });
        }

        res.json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        console.error('Error al actualizar el producto:', error.message);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
};

// Eliminar un producto por ID
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await productManager.deleteProduct(id);

        if (!deletedProduct) {
            return res.status(404).json({ error: 'Producto no encontrado o no eliminado' });
        }

        res.json({ status: 'success', payload: deletedProduct });
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
};

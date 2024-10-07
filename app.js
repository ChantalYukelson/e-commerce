const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path'); 
const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');
const Product = require('./src/models/Product');
const Cart = require('./src/models/Cart'); // Asume que tienes un modelo de carrito

const app = express();

// Middleware para archivos estáticos
app.use(express.static('public'));

// Middleware para sesiones
app.use(session({
    secret: 'mi-secreto', // Cambia por una clave secreta real en producción
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para crear un carrito si no existe
app.use(async (req, res, next) => {
    if (!req.session.cartId) {
        const newCart = await Cart.create({ products: [] });
        req.session.cartId = newCart._id; // Guardar el ID del carrito en la sesión
    }
    next();
});

// Configuración de Handlebars con helper personalizado
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
    },
    helpers: {
        multiply: (a, b) => a * b // Helper personalizado para multiplicar
    }
}));



app.set('view engine', 'handlebars');
app.set('views', __dirname + '/src/views');

// Montar las rutas de API
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para la vista de productos
app.get('/products', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: {}
        };

        if (sort === 'asc') {
            options.sort = { price: 1 }; // Orden ascendente
        } else if (sort === 'desc') {
            options.sort = { price: -1 }; // Orden descendente
        }

        const filter = query ? { $text: { $search: query } } : {};

        const result = await Product.paginate(filter, options);


        res.render('products', {
            products: result.docs,
            title: 'Lista de Productos',
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: page,  // Asegura que page tenga un valor
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null,
            isPageTwo: page == 2  // Condición para verificar si estamos en la página 2
        });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ message: 'Error al obtener los productos', error });
    }
});

// Ruta para la página de inicio
app.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: {}
        };

        if (sort === 'asc') {
            options.sort = { price: 1 }; // Orden ascendente
        } else if (sort === 'desc') {
            options.sort = { price: -1 }; // Orden descendente
        }

        const filter = query ? { $text: { $search: query } } : {};

        const result = await Product.paginate(filter, options);

        res.render('home', {
            products: result.docs,
            title: 'Página de Inicio',
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
        console.error('Error al obtener los productos para la página de inicio:', error);
        res.status(500).json({ message: 'Error al obtener los productos para la página de inicio', error });
    }
});

// Nueva ruta para obtener detalles de un producto por ID
app.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await Product.findById(pid);

        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        res.render('productDetails', { product });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error al obtener el producto');
    }
});

// Ruta para agregar productos al carrito
// Ruta para agregar productos al carrito
app.post('/api/carts/add-product', async (req, res) => {
    const { productId, quantity } = req.body;
    const cartId = req.session.cartId;  // Obtener el carrito de la sesión

    try {
        const cart = await Cart.findById(cartId);
        const product = await Product.findById(productId);

        if (!cart || !product) {
            return res.status(404).json({ message: 'Carrito o producto no encontrado' });
        }

        console.log('ID del producto:', productId);
        console.log('Contenido del carrito:', cart.products);

        // Verificar si el producto ya está en el carrito
        const productInCart = cart.products.find(p => p.product.equals(productId));

        if (productInCart) {
            productInCart.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();
        res.json({ message: 'Producto agregado al carrito exitosamente' });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: 'Error al agregar producto al carrito', error });
    }
});

// Ruta para ver el carrito
app.get('/carts', async (req, res) => {
    const cartId = req.session.cartId;

    try {
        const cart = await Cart.findById(cartId).populate('products.product');
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.render('cart', { cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error al obtener el carrito', error });
    }
});

// Ruta para obtener el carrito por ID
app.get('/api/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.findById(cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.json(cart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error al obtener el carrito', error });
    }
});

// Ruta para test
app.get('/test', (req, res) => {
    res.render('test', (err) => {
        if (err) {
            console.error('Error al renderizar la vista:', err);
            res.status(500).send('Error al renderizar la vista');
        }
    });
});

mongoose.connect('mongodb+srv://chantuyukel:InAQTDBdKSPC1bcs@clustercoder.1r9ot.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=ClusterCoder')
    .then(() => {
        console.log('Conectado a MongoDB Atlas');
    })
    .catch(error => {
        console.error('Error al conectar a MongoDB Atlas', error);
        process.exit(1);
    });


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

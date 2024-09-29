import express from 'express';
import { create } from 'express-handlebars';
import { Server as SocketIOServer } from 'socket.io';
import productsRouter from './src/routes/products.router.js';
import cartRouter from './src/routes/cart.router.js';
import path from 'path';
import { fileURLToPath } from 'url';
import ProductManager from './src/service/ProductManager.js'; 
import CartManager from './src/service/CartManager.js';
import session from 'express-session'; 
import connectDB from './src/config/db.js';

await connectDB();

const app = express();
const PORT = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuraciones de middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(session({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true,
}));

// Configuración de Handlebars
const handlebars = create({
    extname: '.handlebars',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'src/views/layouts'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

app.engine('.handlebars', handlebars.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'src/views'));

// Ruta de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de WebSocket
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
const io = new SocketIOServer(httpServer);

// Rutas
app.use('/api/products', productsRouter(io));
app.use('/api/carts', cartRouter);

// Middleware para inicializar el carrito en la sesión
app.use(async (req, res, next) => {
    if (!req.session.cartId) {
        const cart = await new CartManager().createCart(); 
        req.session.cartId = cart._id;  
    }
    next();
});

app.get('/', async (req, res) => {
    try {
        const { products } = await new ProductManager().getAllProducts({ limit: 5 });
        res.render('home', { products });
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

app.get('/cartDetails', async (req, res) => {
    try {
        const cartId = req.session.cartId;  
        const cart = await new CartManager().getCartById(cartId); // Asegúrate de que esto use populate
        res.render('cartDetails', { cart });
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

app.get('/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await new ProductManager().getProductById(productId);
        res.render('productDetails', { product });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al obtener el producto' });
    }
});

app.get('/realtimeproducts', async (req, res) => {
    try {
        const { products } = await new ProductManager().getAllProducts({ limit: 10 });
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send('Error en el servidor');
    }
});

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

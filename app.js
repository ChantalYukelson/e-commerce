import express from 'express';
import { create } from 'express-handlebars'; // Importar Handlebars
import { Server as SocketIOServer } from 'socket.io'; // Importar socket.io
import productsRouter from './src/routes/products.router.js';
import cartRouter from './src/routes/cart.router.js';
import ProductManager from './src/service/ProductManager.js'; // Asegúrate de importar ProductManager
import path from 'path';
import http from 'http';

const app = express();
const httpServer = http.createServer(app); // Crear un servidor HTTP
const io = new SocketIOServer(httpServer); // Configurar WebSocket con Socket.IO

const productManager = new ProductManager(); // Instancia de ProductManager

// Configurar Handlebars
const hbs = create({
    extname: '.handlebars', // Extensión de archivo
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/src/views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Para servir archivos estáticos como JS y CSS

// Pasar `io` al router de productos
app.use('/api/products', productsRouter(io)); // Aquí pasamos io
app.use('/api/carts', cartRouter);

// Endpoint para la vista de productos en tiempo real
app.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getAllProducts(); // Obtener productos actuales
    res.render('realTimeProducts', { products }); // Pasar productos a la vista
});

// Inicializar Socket.IO
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    
    // Escuchar la creación de un nuevo producto y actualizar la vista en tiempo real
    socket.on('newProduct', (newProduct) => {
        io.emit('productListUpdate', newProduct); // Emitir a todos los clientes conectados
    });
});

// Puerto del servidor
const SERVER_PORT = 8080;
httpServer.listen(SERVER_PORT, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});

import express from 'express';
import productsRouter from './src/routes/products.router.js';
import cartRouter from './src/routes/cart.router.js';  // Importa el router de carts

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);  // Usa el router de carts

const SERVER_PORT = 9090;
app.listen(SERVER_PORT, () => {
    console.log("Servidor escuchado por el puerto: " + SERVER_PORT);
});



# Estuardo

Estuardo es una aplicación de comercio electrónico especializada en la venta de ropa de hombre, ubicada en Buenos Aires, Argentina. La plataforma está desarrollada con Node.js, Express, y Handlebars, y utiliza WebSockets para ofrecer actualizaciones en tiempo real sobre los productos.


## Estructura del Proyecto

```
Estuardo/
│
├── src/
│   ├── controllers/
│   │   ├── cart.controller.js
│   │   └── product.controller.js
│   ├── models/
│   │   ├── Cart.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── products.router.js
│   │   └── carts.router.js
│   ├── services/
│   │   ├── ProductManager.js
│   │   └── CartManager.js
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.handlebars
│   │   ├── home.handlebars
│   │   ├── realTimeProducts.handlebars
│   │   ├── cart.handlebars
│   │   ├── products.handlebars
│   │   ├── productDetails.handlebars
│   │   └── test.handlebars
│   └── app.js
│
└── data/
│   ├── productos.json
│   └── carritos.json
│
└── config/
    └── db.js
```

## Endpoints de Productos

### 1. Listar todos los productos
- **Método**: GET  
- **Ruta**: `/api/products`  
- **Descripción**: Obtiene todos los productos disponibles.
- **Controlador**: `getAllProducts` en `product.controller.js`

### 2. Obtener un producto específico
- **Método**: GET  
- **Ruta**: `/api/products/:pid`  
- **Descripción**: Obtiene un producto por su ID.
- **Controlador**: `getProductById` en `product.controller.js`

### 3. Crear un nuevo producto
- **Método**: POST  
- **Ruta**: `/api/products`  
- **Descripción**: Crea un nuevo producto.
- **Cuerpo**:
```json
{
  "title": "Nuevo Producto",
  "description": "Descripción del nuevo producto.",
  "code": "NP001",
  "price": 99.99,
  "status": true,
  "stock": 30,
  "category": "Suplementos",
  "thumbnails": [
    "http://example.com/images/nuevo-producto.jpg"
  ]
}
```
- **Controlador**: `createProduct` en `product.controller.js`

### 4. Actualizar un producto
- **Método**: PUT  
- **Ruta**: `/api/products/:pid`  
- **Descripción**: Actualiza un producto existente por su ID.
- **Cuerpo**:
```json
{
  "title": "Producto Actualizado",
  "description": "Descripción actualizada.",
  "code": "PA001",
  "price": 89.99,
  "status": true,
  "stock": 25,
  "category": "Suplementos",
  "thumbnails": [
    "http://example.com/images/producto-actualizado.jpg"
  ]
}
```
- **Controlador**: `updateProduct` en `product.controller.js`

### 5. Eliminar un producto
- **Método**: DELETE  
- **Ruta**: `/api/products/:pid`  
- **Descripción**: Elimina un producto por su ID.
- **Controlador**: `deleteProduct` en `product.controller.js`

### 6. Eliminar todos los productos
- **Método**: DELETE  
- **Ruta**: `/api/products/delete-all`  
- **Descripción**: Elimina todos los productos de la base de datos.
- **Controlador**: `deleteAllProducts` en `product.controller.js`

### 7. Listar productos con límite y paginación
- **Método**: GET  
- **Ruta**: `/api/products?limit=5&page=1`  
- **Descripción**: Obtiene una lista paginada de productos, con un límite de 5 productos por página.
- **Controlador**: `getAllProducts` en `product.controller.js`

### 8. Obtener productos por consulta
- **Método**: GET  
- **Ruta**: `/api/products?query=star`  
- **Descripción**: Obtiene productos que coinciden con la consulta.
- **Controlador**: `getProductsByQuery` en `product.controller.js`

### 9. Ordenar productos en orden ascendente o descendente
- **Método**: GET  
- **Ruta**: `/api/products?sort=asc`  
- **Descripción**: Ordena los productos de forma ascendente o descendente.
- **Controlador**: `getProductsBySort` en `product.controller.js`

### 10. Filtrar productos disponibles
- **Método**: GET  
- **Ruta**: `/api/products?available=true`  
- **Descripción**: Filtra los productos por disponibilidad.
- **Controlador**: `getAvailableProducts` en `product.controller.js`

## Endpoints de Carritos

### 1. Crear un nuevo carrito
- **Método**: POST  
- **Ruta**: `/api/carts`  
- **Descripción**: Crea un nuevo carrito.
- **Controlador**: `createCart` en `cart.controller.js`

### 2. Obtener productos de un carrito específico
- **Método**: GET  
- **Ruta**: `/api/carts/:cid`  
- **Descripción**: Obtiene los productos de un carrito por su ID.
- **Controlador**: `getCartById` en `cart.controller.js`

### 3. Agregar un producto a un carrito
- **Método**: POST  
- **Ruta**: `/api/carts/:cid/product/:pid`  
- **Descripción**: Agrega un producto a un carrito por su ID.
- **Controlador**: `addProductToCart` en `cart.controller.js`

### 4. Eliminar un producto de un carrito
- **Método**: DELETE  
- **Ruta**: `/api/carts/:cid/product/:pid`  
- **Descripción**: Elimina un producto de un carrito por su ID.
- **Controlador**: `removeProductFromCart` en `cart.controller.js`

### 5. Actualizar un carrito completo
- **Método**: PUT  
- **Ruta**: `/api/carts/:cid`  
- **Descripción**: Actualiza el contenido completo de un carrito.
- **Controlador**: `updateCart` en `cart.controller.js`

### 6. Eliminar un carrito
- **Método**: DELETE  
- **Ruta**: `/api/carts/:cid`  
- **Descripción**: Elimina un carrito por su ID.
- **Controlador**: `deleteCart` en `cart.controller.js`

### 7. Obtener el total de productos en un carrito
- **Método**: GET  
- **Ruta**: `/api/carts/:cid/total`  
- **Descripción**: Obtiene el total de productos en un carrito.
- **Controlador**: `getTotalProducts` en `cart.controller.js`

### 8. Vaciar un carrito
- **Método**: DELETE  
- **Ruta**: `/api/carts/:cid/clear`  
- **Descripción**: Elimina todos los productos de un carrito.
- **Controlador**: `clearCart` en `cart.controller.js`


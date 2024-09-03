const socket = io();

// Escuchar el evento para actualizar la lista de productos
socket.on('productListUpdate', (newProduct) => {
    const productList = document.getElementById('productList');
    const newItem = document.createElement('li');
    newItem.textContent = `${newProduct.name} - ${newProduct.price}`;
    productList.appendChild(newItem);
});

// Función para emitir un nuevo producto desde el front-end
function createNewProduct(product) {
    socket.emit('newProduct', product); // Emitir el nuevo producto al backend
}

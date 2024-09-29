const socket = io();

socket.on('productListUpdate', (newProduct) => {
    // Actualiza la lista de productos en la interfaz
    console.log('Nuevo producto agregado:', newProduct);
    // Aquí puedes implementar la lógica para actualizar la UI
});

socket.on('productDeleted', (productId) => {
    // Actualiza la lista de productos al eliminar uno
    console.log('Producto eliminado:', productId);
    // Aquí puedes implementar la lógica para actualizar la UI
});

function eliminarPedido(index) {
  // Recuperar el pedido para mostrar información en la confirmación
  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  const pedido = pedidos[index];
  
  if (!pedido) {
    alert("No s'ha trobat la comanda a eliminar");
    return;
  }
  
  // Crear mensaje de confirmación con detalles del pedido
  const mensaje = `Estàs segur/segura que vols eliminar aquesta comanda?\n\n` +
                 `ID: ${pedido.id}\n` +
                 `Data: ${pedido.date}\n` +
                 `Client: ${pedido.client}\n` +
                 `Total: ${pedido.total.toFixed(2)}€\n\n` +
                 `Esta acció no es pot desfer.`;
  
  // Mostrar cuadro de confirmación
  if (confirm(mensaje)) {
    // Si el usuario confirma, eliminar el pedido
    pedidos.splice(index, 1);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    
    // Mostrar mensaje de éxito
    alert("Comanda eliminada correctament ✅");
    
    // Refrescar la lista
    mostrarPedidos();
  } else {
    // Si el usuario cancela, mostrar mensaje (opcional)
    console.log("Eliminació cancel·lada per l'usuari");
  }
}


function eliminarPedido(index) {
  // Recuperar el pedido para mostrar información en la confirmación
  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  let pedido = pedidos[index];
  
  if (!pedido) {
    alert("No s'ha trobat la comanda a eliminar");
    return;
  }
  
  // Crear mensaje de confirmación con detalles del pedido
  let mensaje = `Estàs segur/segura que vols eliminar aquesta comanda?\n\n` +
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
    
    //Elimina directament la fila 
    let taula = document.querySelector("#listaPedidos table");
    let fila = taula.getElementsByTagName("tr") [index +1];
    if (fila && fila.parentNode) {
     fila.parentNode.removeChild(fila);
   }

    // Mostrar mensaje de éxito
    alert("Comanda eliminada correctament ✅");
    
    // Refrescar la lista
    mostrarPedidos();
  } else {
    // Si el usuario cancela, mostrar mensaje 
    console.log("Eliminació cancel·lada per l'usuari");
  }
}


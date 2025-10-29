//  ELIMINAR UNA COMANDA 
function eliminarPedido(index) {
  // Recuperem totes les comandes desades al localStorage
  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  // Obtenim la comanda concreta que volem eliminar
  let pedido = pedidos[index];

  // Si no es troba la comanda, mostrem un missatge d’error
  if (!pedido) {
    alert("No s'ha trobat la comanda a eliminar");
    return;
  }
  // Creem un missatge de confirmació amb detalls de la comanda
  let mensaje = `Estàs segur/segura que vols eliminar aquesta comanda?\n\n` +
                `ID: ${pedido.id}\n` +
                `Data: ${pedido.date}\n` +
                `Client: ${pedido.client}\n` +
                `Total: ${pedido.total.toFixed(2)}€\n\n` +
                `Esta acció no es pot desfer.`;

  // Confirmem amb l’usuari abans d’eliminar
  if (confirm(mensaje)) {
    // Si l’usuari confirma, eliminem la comanda de l’array
    pedidos.splice(index, 1);
    // Actualitzem el localStorage amb la nova llista de comandes
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    // Eliminem la fila corresponent del DOM (taula visual)
    let taula = document.querySelector("#listaPedidos table");
    // +1 perquè la primera fila és la capçalera
    let fila = taula.getElementsByTagName("tr")[index + 1];
    if (fila && fila.parentNode) {
      fila.parentNode.removeChild(fila);
    }

    // Mostrem un missatge d’èxit
    alert("Comanda eliminada correctament ✅");

    // Actualitzem visualment la taula amb les dades actualitzades
    mostrarPedidos();
  } else {
    // Si l’usuari cancel·la, informem per consola
    console.log("Eliminació cancel·lada per l'usuari");
  }
}

// MOSTRAR COMANDES 
function mostrarPedidos() {
  // Recuperem les comandes del localStorage
  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  // Seleccionem la taula existent
  let taula = document.querySelector("#listaPedidos table");

  // Esborrem totes les files menys la capçalera
  while (taula.rows.length > 1) {
    taula.deleteRow(1);
  }

  // Recorrem totes les comandes i les afegim una a una a la taula
  pedidos.forEach((pedido, i) => {
    let fila = document.createElement("tr");

    // Cel·la amb l’ID
    let celId = document.createElement("td");
    celId.appendChild(document.createTextNode(pedido.id));

    // Cel·la amb la data
    let celData = document.createElement("td");
    celData.appendChild(document.createTextNode(pedido.date));

    // Cel·la amb el nom del client
    let celClient = document.createElement("td");
    celClient.appendChild(document.createTextNode(pedido.client));

    // Cel·la amb el total
    let celTotal = document.createElement("td");
    celTotal.appendChild(document.createTextNode(`${pedido.total.toFixed(2)}€`));

    // Cel·la amb el botó d’acció “Eliminar”
    let celAccions = document.createElement("td");
    let botoEliminar = document.createElement("button");
    botoEliminar.textContent = "Eliminar";
    // Assignem l’esdeveniment per eliminar aquesta comanda concreta
    botoEliminar.onclick = () => eliminarPedido(i);
    celAccions.appendChild(botoEliminar);

    // Afegim totes les cel·les a la fila
    fila.appendChild(celId);
    fila.appendChild(celData);
    fila.appendChild(celClient);
    fila.appendChild(celTotal);
    fila.appendChild(celAccions);

    // Finalment, afegim la fila a la taula
    taula.appendChild(fila);
  });
}

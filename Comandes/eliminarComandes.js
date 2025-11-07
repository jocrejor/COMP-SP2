//  ELIMINAR UNA COMANDA
function eliminarPedido(index) {
  //  Recuperem totes les comandes guardades al localStorage.
  // Si no n’hi ha cap, retornem un array buit.
  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  //  Obtenim la comanda concreta que volem eliminar segons l’índex indicat.
  let pedido = pedidos[index];

  //  Comprovem si la comanda realment existeix.
  // Si no es troba, mostrem un missatge d’error i eixim de la funció.
  if (!pedido) {
    alert("No s'ha trobat la comanda a eliminar");
    return;
  }

  //  Creem un missatge de confirmació personalitzat amb informació de la comanda.
  // S’utilitzen “template literals” (cometes invertides) per inserir valors de variables.
  let mensaje = `Estàs segur/segura que vols eliminar aquesta comanda?\n\n` +
                `ID: ${pedido.id}\n` +
                `Data: ${pedido.datetime}\n` +
                `Client: ${pedido.client}\n` +
                `Total: ${pedido.total.toFixed(2)}€\n\n` +
                `Esta acció no es pot desfer.`;

  //  Mostrem un diàleg de confirmació a l’usuari.
  // Només si prem “Acceptar” s’executarà el bloc intern.
  if (confirm(mensaje)) {

    //  Si l’usuari confirma, eliminem la comanda de l’array amb splice().
    // splice(index, 1) → elimina un element a partir de la posició indicada.
    pedidos.splice(index, 1);

    //  Actualitzem el localStorage amb la nova llista (sense la comanda eliminada).
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    //  Eliminem també la fila corresponent del DOM (taula visual de comandes).
    // Busquem la taula principal dins del contenidor amb id="listaPedidos".
    let taula = document.querySelector("#listaPedidos table");

    //  Cada fila (<tr>) de la taula correspon a una comanda.
    // La primera fila és la capçalera, per això fem “index + 1”.
    let fila = taula.getElementsByTagName("tr")[index + 1];

    //  Si trobem la fila i té un pare, l’eliminem del DOM.
    if (fila && fila.parentNode) {
      fila.parentNode.removeChild(fila);
    }

    //  Mostrem un missatge informant que s’ha eliminat correctament.
    alert("Comanda eliminada correctament ");

    //  Tornem a cridar la funció que mostra totes les comandes actualitzades.
    mostrarPedidos();

  } else {
    //  Si l’usuari cancel·la l’acció, simplement ho indiquem a la consola.
    console.log("Eliminació cancel·lada per l'usuari");
  }
}

//  MOSTRAR COMANDES EN TAULA

function mostrarPedidos() {
  //  Recuperem totes les comandes desades al localStorage.
  // Si no n’hi ha, s’obté un array buit.
  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

  //  Seleccionem la taula HTML existent dins del contenidor amb id="listaPedidos".
  let taula = document.querySelector("#listaPedidos table");

  //  Eliminem totes les files anteriors, menys la primera (capçalera).
  // Això serveix per "netejar" la taula abans d’actualitzar-la.
  while (taula.rows.length > 1) {
    taula.deleteRow(1); // Esborra la segona fila repetidament fins que només queda la primera
  }

  //  Recorrem totes les comandes i les afegim una a una a la taula.
  pedidos.forEach((pedido, i) => {
    //  Creem una nova fila <tr> per a la comanda actual.
    let fila = document.createElement("tr");

    // 🧱 Creació de cada cel·la (columna)
    //  Cel·la amb l’ID de la comanda
    let celId = document.createElement("td");
    celId.appendChild(document.createTextNode(pedido.id));

    //  Cel·la amb la data de la comanda
    let celData = document.createElement("td");
    celData.appendChild(document.createTextNode(pedido.datetime));

    //  Cel·la amb el nom del client
    let celClient = document.createElement("td");
    celClient.appendChild(document.createTextNode(pedido.client));

    //  Cel·la amb el total (formatat amb dos decimals + símbol d’euro)
    let celTotal = document.createElement("td");
    celTotal.appendChild(document.createTextNode(`${pedido.total.toFixed(2)}€`));

    //  Cel·la amb el botó d’acció “Eliminar”
    let celAccions = document.createElement("td");

    //  Creem el botó per eliminar aquesta comanda
    let botoEliminar = document.createElement("button");
    botoEliminar.textContent = "Eliminar"; // Text visible del botó

    //  Assignem l’esdeveniment onclick perquè, en prémer, cride a eliminarPedido()
    // i li passe com a paràmetre l’índex de la comanda actual (i)
    botoEliminar.onclick = () => eliminarPedido(i);

    // Afegim el botó dins de la cel·la d’accions
    celAccions.appendChild(botoEliminar);

    //  Afegim totes les cel·les a la fila
    fila.appendChild(celId);
    fila.appendChild(celData);
    fila.appendChild(celClient);
    fila.appendChild(celTotal);
    fila.appendChild(celAccions);

    //  Finalment, afegim la fila a la taula
    taula.appendChild(fila);
  });
}

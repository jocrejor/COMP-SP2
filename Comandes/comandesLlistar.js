//  CÀRREGA DE DADES DES DE LA "BBDD" 
function carregarDades() {
  // Comprova si les dades globals Order i Orderdetail estan disponibles
  if (!Order || !Orderdetail) {
    console.error("Les dades Order o Orderdetail no estan disponibles.");
    return;
  }

  // Construeix una llista de comandes a partir de les dades base (BBDD simulada)
  let comandesBase = Order.map(o => {
    // Cerca els detalls de cada comanda segons el seu ID
    let productes = Orderdetail
      .filter(d => d.order_id === o.id)
      .map(d => ({
        producte: `Producte ${d.product_id}`,
        quantitat: d.quantity,
        preu: d.price,
        descompte: d.discount
      }));

    // Retorna l’objecte comanda amb totes les seves dades
    return {
      id: o.id,
      data: o.date,
      client: `Client ${o.client_id}`,
      pagament: o.payment,
      enviament: o.shipping_amount,
      productes: productes
    };
  });

  // Recupera les comandes guardades localment (afegides per l’usuari)
  let comandesLocal = JSON.parse(localStorage.getItem("comandes")) || [];
  let idsBase = comandesBase.map(c => c.id);

  // Combina les comandes base amb les noves (sense duplicar IDs)
  let comandesTotals = [
    ...comandesBase,
    ...comandesLocal.filter(c => !idsBase.includes(c.id))
  ];

  // Desa totes les comandes actualitzades al localStorage
  localStorage.setItem("comandes", JSON.stringify(comandesTotals));
  console.log("Comandes carregades (base + noves). Total:", comandesTotals.length);
}

//  MOSTRAR COMANDES 
function mostrarComandes() {
  let container = document.getElementById("listaPedidos");

  // Neteja el contingut del contenidor abans de tornar a generar-lo
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Recupera totes les comandes del localStorage
  let comandes = JSON.parse(localStorage.getItem("comandes")) || [];

  // Si no hi ha comandes, mostra un missatge i surt
  if (comandes.length === 0) {
    let missatge = document.createElement("p");
    missatge.textContent = "No hi ha comandes registrades.";
    container.appendChild(missatge);
    return;
  }

  // Crea una taula per mostrar totes les comandes
  let taula = document.createElement("table");
  taula.setAttribute("border", "1");
  taula.setAttribute("cellpadding", "5");
  taula.setAttribute("cellspacing", "0");

  // Crea la capçalera de la taula
  let cap = document.createElement("tr");
  let capçaleres = ["#", "Data", "Client", "Forma de pagament", "Enviament (€)", "Productes", "Accions"];
  capçaleres.forEach(text => {
    let th = document.createElement("th");
    th.textContent = text;
    cap.appendChild(th);
  });
  taula.appendChild(cap);

  // Recorre totes les comandes per afegir-les a la taula
  comandes.forEach((c, index) => {
    let fila = document.createElement("tr");

    // Número de comanda
    let tdIndex = document.createElement("td");
    tdIndex.textContent = index + 1;
    fila.appendChild(tdIndex);

    // Data de la comanda
    let tdData = document.createElement("td");
    tdData.textContent = c.data || "N/A";
    fila.appendChild(tdData);

    // Client
    let tdClient = document.createElement("td");
    tdClient.textContent = c.client || "N/A";
    fila.appendChild(tdClient);

    // Forma de pagament
    let tdPagament = document.createElement("td");
    tdPagament.textContent = c.pagament || "N/A";
    fila.appendChild(tdPagament);

    // Import d’enviament
    let tdEnviament = document.createElement("td");
    tdEnviament.textContent = (+c.enviament || 0).toFixed(2);
    fila.appendChild(tdEnviament);

    //  Subtaula amb els productes de la comanda
    let tdProductes = document.createElement("td");
    let subTaula = document.createElement("table");
    subTaula.setAttribute("border", "1");
    subTaula.setAttribute("cellpadding", "2");
    subTaula.setAttribute("cellspacing", "0");

    // Capçalera de la subtaula
    let capProductes = document.createElement("tr");
    ["Producte", "Quantitat", "Preu", "Descompte (%)"].forEach(text => {
      let th = document.createElement("th");
      th.textContent = text;
      capProductes.appendChild(th);
    });
    subTaula.appendChild(capProductes);

    // Calcula i mostra cada producte amb el seu subtotal
    let total = 0;
    (c.productes || []).forEach(p => {
      let f = document.createElement("tr");
      let subtotal = p.quantitat * p.preu * (1 - (p.descompte || 0) / 100);
      total += subtotal;

      let dades = [
        p.producte,
        p.quantitat,
        `${p.preu.toFixed(2)}€`,
        `${(p.descompte || 0).toFixed(2)}%`
      ];

      dades.forEach(valor => {
        let td = document.createElement("td");
        td.textContent = valor;
        f.appendChild(td);
      });

      subTaula.appendChild(f);
    });

    // Suma el cost d’enviament al total de la comanda
    total += c.enviament || 0;

    // Mostra el total final
    let totalText = document.createElement("b");
    totalText.textContent = `Total: ${total.toFixed(2)}€`;

    // Afegeix la subtaula i el total a la cel·la de productes
    tdProductes.appendChild(subTaula);
    tdProductes.appendChild(totalText);
    fila.appendChild(tdProductes);

    // --- Accions disponibles per cada comanda ---
    let tdAccions = document.createElement("td");
    tdAccions.style.textAlign = "center";

    // Botó per visualitzar la comanda
    let botoVisualitzar = document.createElement("button");
    botoVisualitzar.textContent = "Visualitzar";
    botoVisualitzar.classList.add("visualitzar");
    botoVisualitzar.addEventListener("click", () => visualitzarComanda(index));

    // Botó per modificar la comanda
    let botoModificar = document.createElement("button");
    botoModificar.textContent = "Modificar";
    botoModificar.classList.add("modificar");
    botoModificar.addEventListener("click", () => modificarComanda(index));

    // Botó per eliminar la comanda
    let botoEliminar = document.createElement("button");
    botoEliminar.textContent = "Eliminar";
    botoEliminar.classList.add("eliminar");
    botoEliminar.addEventListener("click", () => eliminarComanda(index));

    // Afegeix els botons a la cel·la d’accions
    tdAccions.appendChild(botoVisualitzar);
    tdAccions.appendChild(document.createTextNode(" "));
    tdAccions.appendChild(botoModificar);
    tdAccions.appendChild(document.createTextNode(" "));
    tdAccions.appendChild(botoEliminar);

    fila.appendChild(tdAccions);
    taula.appendChild(fila);
  });

  // Mostra la taula completa al contenidor principal
  container.appendChild(taula);
}
//  ACCIONS 
// Desa l’índex de la comanda per visualitzar-la i redirigeix a la pàgina corresponent
function visualitzarComanda(index) {
  localStorage.setItem("comandaVisualitzar", index);
  window.location.href = "visualitzarComanda.html";
}
// Desa l’índex per editar la comanda i obre la pàgina de modificació
function modificarComanda(index) {
  localStorage.setItem("comandaEditar", index);
  window.location.href = "modificarComanda.html";
}
// Elimina una comanda després de confirmar-ho amb l’usuari
function eliminarComanda(index) {
  let comandes = JSON.parse(localStorage.getItem("comandes")) || [];
  if (!confirm("Segur que vols eliminar aquesta comanda?")) return;
  comandes.splice(index, 1); // Elimina la comanda seleccionada
  localStorage.setItem("comandes", JSON.stringify(comandes));
  mostrarComandes(); // Actualitza la vista
}
//  MAIN 
// Quan el document estigui carregat, s’executen aquestes accions inicials
document.addEventListener("DOMContentLoaded", () => {
  carregarDades(); // Carrega dades base i locals
  mostrarComandes(); // Mostra totes les comandes

  // Afegeix comportament al botó “Afegir comanda”
  let botoAfegir = document.getElementById("afegirPedido");
  if (botoAfegir) {
    botoAfegir.addEventListener("click", () => {
      window.location.href = "altaComanda.html";
    });
  }
});

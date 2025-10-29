// FUNCIÓ PRINCIPAL: MOSTRAR COMANDA
function mostrarComanda() {
  // Recuperem l'índex de la comanda a visualitzar del localStorage
  let index = localStorage.getItem("comandaVisualitzar");
  let detalleContainer = document.getElementById("detallePedido");
  detalleContainer.innerHTML = ""; // Netejar el contingut previ

  // Si no hi ha cap comanda seleccionada, mostrem missatge
  if (index === null) {
    let p = document.createElement("p");
    p.textContent = "No hi ha cap comanda seleccionada.";
    detalleContainer.appendChild(p);
    return;
  }
  // Recuperem totes les comandes del localStorage
  let comandes = JSON.parse(localStorage.getItem("comandes")) || [];
  let comanda = comandes[index];

  // Si no es troba la comanda, mostrem missatge d’error
  if (!comanda) {
    let p = document.createElement("p");
    p.textContent = "Comanda no trobada.";
    detalleContainer.appendChild(p);
    return;
  }

  // MOSTRAR INFORMACIÓ BÀSICA DE LA COMANDA
  let infoBàsica = [
    { label: "Data", value: comanda.data },
    { label: "Client", value: comanda.client },
    { label: "Tipus de pagament", value: comanda.pagament },
    { label: "Enviament", value: (+comanda.enviament || 0).toFixed(2) }
  ];

  // Afegim cada dada com un paràgraf al contenidor
  infoBàsica.forEach(info => {
    let p = document.createElement("p");
    p.textContent = `${info.label}: ${info.value || "N/A"}`;
    detalleContainer.appendChild(p);
  });

  // CREAR TAULA DE PRODUCTES
  let taula = document.createElement("table");
  taula.setAttribute("border", "1");
  taula.setAttribute("cellpadding", "5");
  taula.setAttribute("cellspacing", "0");

  // Crear capçalera de la taula
  let cap = document.createElement("tr");
  ["Producte", "Quantitat", "Preu (€)", "Descompte (%)", "Subtotal (€)"].forEach(text => {
    let th = document.createElement("th");
    th.textContent = text;
    cap.appendChild(th);
  });
  taula.appendChild(cap);

  // Afegim les files dels productes i calculem el total
  let total = 0;
  (comanda.productes || []).forEach(p => {
    let fila = document.createElement("tr");

    // Calculem el subtotal per producte
    let subtotal = p.quantitat * p.preu * (1 - (p.descompte || 0) / 100);
    total += subtotal;

    // Dades a mostrar per cada producte
    let dades = [
      p.producte,
      p.quantitat,
      p.preu.toFixed(2),
      (p.descompte || 0).toFixed(2),
      subtotal.toFixed(2)
    ];

    // Creem les cel·les i les afegim a la fila
    dades.forEach(valor => {
      let td = document.createElement("td");
      td.textContent = valor;
      fila.appendChild(td);
    });

    taula.appendChild(fila);
  });

  // Afegim el cost d’enviament al total
  total += +comanda.enviament || 0;

  // MOSTRAR TOTAL FINAL
  let filaTotal = document.createElement("tr");

  // Cel·la amb el text "Total:"
  let tdTotal = document.createElement("td");
  tdTotal.setAttribute("colspan", "4");
  tdTotal.style.textAlign = "right";
  tdTotal.textContent = "Total:";

  // Cel·la amb el valor total
  let tdTotalValor = document.createElement("td");
  tdTotalValor.textContent = total.toFixed(2);

  // Afegim les dues cel·les a la fila total
  filaTotal.appendChild(tdTotal);
  filaTotal.appendChild(tdTotalValor);
  taula.appendChild(filaTotal);

  // Afegim la taula completa al contenidor principal
  detalleContainer.appendChild(taula);
}
// EVENT PRINCIPAL: CARREGAR I GESTIONAR EL BOTÓ DE TORNAR
document.addEventListener("DOMContentLoaded", () => {
  mostrarComanda(); // Mostrar la comanda seleccionada

  // Configurar el botó "Tornar" per anar a la llista de comandes
  let botoTornar = document.getElementById("tornar");
  botoTornar.addEventListener("click", () => {
    window.location.href = "comandesLlistar.html";
  });
});

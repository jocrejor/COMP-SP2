// visualitzaComanda.js

function mostrarComanda() {
  let index = localStorage.getItem("comandaVisualitzar");
  let detalleContainer = document.getElementById("detallePedido");
  detalleContainer.innerHTML = ""; 

  if (index === null) {
    let p = document.createElement("p");
    p.textContent = "No hi ha cap comanda seleccionada.";
    detalleContainer.appendChild(p);
    return;
  }

  let comandes = JSON.parse(localStorage.getItem("comandes")) || [];
  let comanda = comandes[index];

  if (!comanda) {
    let p = document.createElement("p");
    p.textContent = "Comanda no trobada.";
    detalleContainer.appendChild(p);
    return;
  }

  // Mostrar informació bàsica
  let infoBàsica = [
    { label: "Data", value: comanda.data },
    { label: "Client", value: comanda.client },
    { label: "Tipus de pagament", value: comanda.pagament },
    { label: "Enviament", value: (+comanda.enviament || 0).toFixed(2) }
  ];

  infoBàsica.forEach(info => {
    let p = document.createElement("p");
    p.textContent = `${info.label}: ${info.value || "N/A"}`;
    detalleContainer.appendChild(p);
  });

  // Crear taula de productes
  let taula = document.createElement("table");
  taula.setAttribute("border", "1");
  taula.setAttribute("cellpadding", "5");
  taula.setAttribute("cellspacing", "0");

  let cap = document.createElement("tr");
  ["Producte", "Quantitat", "Preu (€)", "Descompte (%)", "Subtotal (€)"].forEach(text => {
    let th = document.createElement("th");
    th.textContent = text;
    cap.appendChild(th);
  });
  taula.appendChild(cap);

  let total = 0;
  (comanda.productes || []).forEach(p => {
    let fila = document.createElement("tr");
    let subtotal = p.quantitat * p.preu * (1 - (p.descompte || 0) / 100);
    total += subtotal;

    let dades = [
      p.producte,
      p.quantitat,
      p.preu.toFixed(2),
      (p.descompte || 0).toFixed(2),
      subtotal.toFixed(2)
    ];

    dades.forEach(valor => {
      let td = document.createElement("td");
      td.textContent = valor;
      fila.appendChild(td);
    });

    taula.appendChild(fila);
  });

  total += +comanda.enviament || 0;

  // Mostrar total
  let filaTotal = document.createElement("tr");
  let tdTotal = document.createElement("td");
  tdTotal.setAttribute("colspan", "4");
  tdTotal.style.textAlign = "right";
  tdTotal.textContent = "Total:";
  let tdTotalValor = document.createElement("td");
  tdTotalValor.textContent = total.toFixed(2);
  filaTotal.appendChild(tdTotal);
  filaTotal.appendChild(tdTotalValor);
  taula.appendChild(filaTotal);

  detalleContainer.appendChild(taula);
}

// Tornar a la llista
document.addEventListener("DOMContentLoaded", () => {
  mostrarComanda();

 let botoTornar = document.getElementById("tornar");
  botoTornar.addEventListener("click", () => {
    window.location.href = "comandesLlistar.html";
  });
});

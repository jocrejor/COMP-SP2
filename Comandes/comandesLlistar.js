// ------------------- MOSTRAR COMANDES -------------------
function mostrarComandes() {
  const container = document.getElementById("listaPedidos");

  // Eliminar contingut anterior
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // Recuperar comandes
  const comandes = JSON.parse(localStorage.getItem("comandes")) || [];

  // Si no hi ha comandes, mostrar missatge
  if (comandes.length === 0) {
    const missatge = document.createElement("p");
    missatge.textContent = "No hi ha comandes registrades.";
    container.appendChild(missatge);
    return;
  }

  // Crear taula
  const taula = document.createElement("table");
  taula.setAttribute("border", "1");
  taula.setAttribute("cellpadding", "5");
  taula.setAttribute("cellspacing", "0");

  // Capçalera
  const cap = document.createElement("tr");
  const capçaleres = ["#", "Data", "Client", "Forma de pagament", "Enviament (€)", "Productes", "Accions"];
  capçaleres.forEach(text => {
    const th = document.createElement("th");
    th.textContent = text;
    cap.appendChild(th);
  });
  taula.appendChild(cap);

  // Files de comandes
  comandes.forEach((c, index) => {
    const fila = document.createElement("tr");

    // Columna #
    const tdIndex = document.createElement("td");
    tdIndex.textContent = index + 1;
    fila.appendChild(tdIndex);

    // Data
    const tdData = document.createElement("td");
    tdData.textContent = c.data || "N/A";
    fila.appendChild(tdData);

    // Client
    const tdClient = document.createElement("td");
    tdClient.textContent = c.client || "N/A";
    fila.appendChild(tdClient);

    // Pagament
    const tdPagament = document.createElement("td");
    tdPagament.textContent = c.pagament || "N/A";
    fila.appendChild(tdPagament);

    // Enviament
    const tdEnviament = document.createElement("td");
    tdEnviament.textContent = (+c.enviament || 0).toFixed(2);
    fila.appendChild(tdEnviament);

    // Productes
    const tdProductes = document.createElement("td");

    const subTaula = document.createElement("table");
    subTaula.setAttribute("border", "1");
    subTaula.setAttribute("cellpadding", "2");
    subTaula.setAttribute("cellspacing", "0");

    // Capçalera productes
    const capProductes = document.createElement("tr");
    ["Producte", "Quantitat", "Preu", "Descompte (%)"].forEach(text => {
      const th = document.createElement("th");
      th.textContent = text;
      capProductes.appendChild(th);
    });
    subTaula.appendChild(capProductes);

    // Files de productes
    let total = 0;
    (c.productes || []).forEach(p => {
      const f = document.createElement("tr");
      const subtotal = p.quantitat * p.preu * (1 - (p.descompte || 0) / 100);
      total += subtotal;

      const dades = [
        p.producte,
        p.quantitat,
        `${p.preu.toFixed(2)}€`,
        `${(p.descompte || 0).toFixed(2)}%`
      ];

      dades.forEach(valor => {
        const td = document.createElement("td");
        td.textContent = valor;
        f.appendChild(td);
      });

      subTaula.appendChild(f);
    });

    total += c.enviament || 0;

    const totalText = document.createElement("b");
    totalText.textContent = `Total: ${total.toFixed(2)}€`;

    tdProductes.appendChild(subTaula);
    tdProductes.appendChild(totalText);
    fila.appendChild(tdProductes);

    // Accions
    const tdAccions = document.createElement("td");
    tdAccions.style.textAlign = "center";

    const botoVisualitzar = document.createElement("button");
    botoVisualitzar.textContent = "Visualitzar";
    botoVisualitzar.addEventListener("click", () => visualitzarComanda(index));

    const botoModificar = document.createElement("button");
    botoModificar.textContent = "Modificar";
    botoModificar.addEventListener("click", () => modificarComanda(index));

    const botoEliminar = document.createElement("button");
    botoEliminar.textContent = "Eliminar";
    botoEliminar.addEventListener("click", () => eliminarComanda(index));

    tdAccions.appendChild(botoVisualitzar);
    tdAccions.appendChild(document.createTextNode(" "));
    tdAccions.appendChild(botoModificar);
    tdAccions.appendChild(document.createTextNode(" "));
    tdAccions.appendChild(botoEliminar);

    fila.appendChild(tdAccions);

    taula.appendChild(fila);
  });

  container.appendChild(taula);
}

// ------------------- VISUALITZAR COMANDA -------------------
function visualitzarComanda(index) {
  localStorage.setItem("comandaVisualitzar", index);
  window.location.href = "visualitzarComanda.html";
}

// ------------------- MODIFICAR COMANDA -------------------
function modificarComanda(index) {
  localStorage.setItem("comandaEditar", index);
  window.location.href = "modificarComanda.html";
}

// ------------------- ELIMINAR COMANDA -------------------
function eliminarComanda(index) {
  const comandes = JSON.parse(localStorage.getItem("comandes")) || [];
  if (!confirm("Segur que vols eliminar aquesta comanda?")) return;
  comandes.splice(index, 1);
  localStorage.setItem("comandes", JSON.stringify(comandes));
  mostrarComandes();
}

// ------------------- MAIN -------------------
document.addEventListener("DOMContentLoaded", () => {
  mostrarComandes();

  const botoAfegir = document.getElementById("afegirPedido");
  if (botoAfegir) {
    botoAfegir.addEventListener("click", () => {
      window.location.href = "altaComanda.html";
    });
  }
});

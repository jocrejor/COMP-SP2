document.addEventListener("DOMContentLoaded", main);

function main() {
  const tbody = document.querySelector("#taulaComparador tbody");

  function carregarComparadorsBbdd() {
    if (typeof Comparator !== "undefined" && Array.isArray(Comparator)) {
      return Comparator;
    }
    return [];
  }

  const params = new URLSearchParams(window.location.search);
  const comparadorId = params.get("id");

  function mostrarTaula() {
    const comparadors = carregarComparadorsBbdd();

    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);

    const comparador = comparadors.find(c => c.id == comparadorId);

    if (!comparador) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 4;
      td.textContent = "Comparador no trobat.";
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    const tr = document.createElement("tr");
    const camps = [
      comparador.id,
      comparador.session_id,
      comparador.user_agent,
      comparador.client_id,
    ];

    camps.forEach(valor => {
      const td = document.createElement("td");
      td.textContent = valor ?? "-";
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  }

  mostrarTaula(); 
  
}

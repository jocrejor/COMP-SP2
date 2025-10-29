document.addEventListener("DOMContentLoaded", function () {
  const tbody = document.querySelector("#taulaClient tbody");

  function obtenirClientPerId(id) {
    if (typeof Client === "undefined") return null;
    return Client.find(c => c.id == id);
  }

  // Obtenir ID de la URL
  const params = new URLSearchParams(window.location.search);
  const clientId = params.get("id");

  const client = obtenirClientPerId(clientId);

  if (!client) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 2;
    td.textContent = "Client no trobat.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  // Mostrar totes les dades del CLient 
  Object.entries(client).forEach(([clau, valor]) => {
    const tr = document.createElement("tr");
    const tdClau = document.createElement("td");
    const tdValor = document.createElement("td");
    tdClau.textContent = clau;
    tdValor.textContent = valor;
    tr.appendChild(tdClau);
    tr.appendChild(tdValor);
    tbody.appendChild(tr);
  });
});

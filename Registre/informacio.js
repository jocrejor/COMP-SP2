document.addEventListener("DOMContentLoaded", mostrarClients);

function mostrarClients() {
  let clients = JSON.parse(localStorage.getItem("client") || "[]");
  let contenedor = document.getElementById("taulaClients");
  contenedor.innerHTML = "";

  if (clients.length === 0) {
    contenedor.innerHTML = "<p>No hi ha registres guardats.</p>";
    return;
  }

  let taula = document.createElement("table");

  // Capçalera de la taula
  let thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Nom</th>
      <th>Cognoms</th>
      <th>Tipus Tax ID</th>
      <th>Tax ID</th>
      <th>Data de Naixement</th>
      <th>Telèfon</th>
      <th>Usuari</th>
      <th>Email</th>
      <th>Adreça</th>
      <th>Codi Postal</th>
      <th>País</th>
      <th>Província</th>
      <th>Ciutat</th>
      <th>Accions</th>
    </tr>
  `;
  taula.appendChild(thead);

  // Cos de la taula
  let tbody = document.createElement("tbody");
  clients.forEach((client, index) => {
    let fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${client.id}</td>
      <td>${client.name}</td>
      <td>${client.surnames}</td>
      <td>${client.taxidtype || ""}</td>
      <td>${client.taxid || ""}</td>
      <td>${client.birthdate || ""}</td>
      <td>${client.phone}</td>
      <td>${client.user_name}</td>
      <td>${client.email}</td>
      <td>${client.address || ""}</td>
      <td>${client.cp || ""}</td>
      <td>${client.country || ""}</td>
      <td>${client.province || ""}</td>
      <td>${client.city || ""}</td>
      <td>
        <button onclick="modificarClient(${index})">Modificar</button>
        <button onclick="canviarPassword(${index})">Canviar Contrasenya</button>
      </td>
    `;
    tbody.appendChild(fila);
  });

  taula.appendChild(tbody);
  contenedor.appendChild(taula);
}

function modificarClient(index) {
  let clients = JSON.parse(localStorage.getItem("client") || "[]");
  let client = clients[index];

  client.id = prompt("ID:", client.id) || client.id;
  client.name = prompt("Nom:", client.name) || client.name;
  client.surnames = prompt("Cognoms:", client.surnames) || client.surnames;
  client.taxidtype = prompt("Tipus Tax ID:", client.taxidtype || "") || client.taxidtype;
  client.taxid = prompt("Tax ID:", client.taxid || "") || client.taxid;
  client.birthdate = prompt("Data de Naixement (YYYY-MM-DD):", client.birthdate || "") || client.birthdate;
  client.phone = prompt("Telèfon:", client.phone || "") || client.phone;
  client.user_name = prompt("Usuari:", client.user_name || "") || client.user_name;
  client.email = prompt("Email:", client.email || "") || client.email;
  client.address = prompt("Adreça:", client.address || "") || client.address;
  client.cp = prompt("Codi Postal:", client.cp || "") || client.cp;
  client.country = prompt("País:", client.country || "") || client.country;
  client.province = prompt("Província:", client.province || "") || client.province;
  client.city = prompt("Ciutat:", client.city || "") || client.city;

  clients[index] = client;
  localStorage.setItem("client", JSON.stringify(clients));
  alert("Client modificat correctament!");
  mostrarClients();
}

function canviarPassword(index) {
  let clients = JSON.parse(localStorage.getItem("client") || "[]");
  let client = clients[index];

  let novaPass = prompt("Introdueix la nova contrasenya:");
  let repetirPass = prompt("Repeteix la nova contrasenya:");

  if (!novaPass || !repetirPass) {
    alert("Has d’omplir els dos camps!");
    return;
  }

  if (novaPass !== repetirPass) {
    alert("Les contrasenyes no coincideixen!");
    return;
  }

  // Validació de seguretat
  let passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  if (!passRegex.test(novaPass)) {
    alert("La contrasenya ha de tenir mínim 8 caràcters, una majúscula, un número i un símbol");
    return;
  }

  client.password = novaPass;
  clients[index] = client;
  localStorage.setItem("client", JSON.stringify(clients));

  alert("Contrasenya actualitzada correctament!");
  mostrarClients();
}

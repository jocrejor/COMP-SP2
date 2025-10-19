document.addEventListener("DOMContentLoaded", main);

function main(){
  mostrarClients();
}

function mostrarClients() {

  // Carrega les dades de la BBDD local
  if(!localStorage.getItem("client")){
      localStorage.setItem("client", JSON.stringify(Client));
  }

  let clients = JSON.parse(localStorage.getItem("client") || "[]");
  let taulaClients = document.getElementById("taulaClients");
  taulaClients.innerHTML = "";

  if (clients.length === 0) {
    taulaClients.textContent = "No hi ha registres guardats.";
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
      <th>Identificació fiscal</th>
      <th>Nombre</th>
      <th>Data de naixement</th>
      <th>Telèfon</th>
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
      <td>${client.surname}</td>
      <td>${client.taxidtype || ""}</td>
      <td>${client.taxid || ""}</td>
      <td>${client.birth_date || ""}</td>
      <td>${client.phone}</td>
      <td>${client.email}</td>
      <td>${client.address || ""}</td>
      <td>${client.cp || ""}</td>
      <td>${client.country_id || ""}</td>
      <td>${client.province_id || ""}</td>
      <td>${client.city_id || ""}</td>
      <td>
        <button onclick="./registre/registreModificar.html(${index})">Modificar</button>
        <button onclick="./registre/registreEliminar.html(${index})">Esborrar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });

  taula.appendChild(tbody);
  taulaClients.appendChild(taula);
}

// Funció per esborrar un client
function esborrar(){

}

// Funció per modificar un client
/*function modificarClient(index) {
  let clients = JSON.parse(localStorage.getItem("client") || "[]");
  let client = clients[index];

  client.id = prompt("ID:", client.id) || client.id;
  client.name = prompt("Nom:", client.name) || client.name;
  client.surname = prompt("Cognoms:", client.surname) || client.surname;
  client.taxidtype = prompt("Tipus Tax ID:", client.taxidtype || "") || client.taxidtype;
  client.taxid = prompt("Tax ID:", client.taxid || "") || client.taxid;
  client.birth_date = prompt("Data de Naixement (YYYY-MM-DD):", client.birth_date || "") || client.birth_date;
  client.phone = prompt("Telèfon:", client.phone || "") || client.phone;
  client.user_name = prompt("Usuari:", client.user_name || "") || client.user_name;
  client.email = prompt("Email:", client.email || "") || client.email;
  client.address = prompt("Adreça:", client.address || "") || client.address;
  client.cp = prompt("Codi Postal:", client.cp || "") || client.cp;
  client.country_id = prompt("País:", client.country_id || "") || client.country_id;
  client.province_id = prompt("Província:", client.province_id || "") || client.province_id;
  client.city_id = prompt("Ciutat:", client.city_id || "") || client.city_id;

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
}*/

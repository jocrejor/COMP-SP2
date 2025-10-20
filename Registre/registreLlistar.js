document.addEventListener("DOMContentLoaded", main);

function main(){
  const clients = carregaClients();
  generaTaula(clients);

  // Creem el event per a crear usuari
  let botoCrear = document.getElementById("crearClient");
  botoCrear.addEventListener("click", () => {
    window.location.href="./registre/registreCrear.html";
  });
}

function carregaClients (){
  // Carrega les dades de la BBDD local
  if(!localStorage.getItem("client")){
      localStorage.setItem("client", JSON.stringify(Client));
  }

  let clients = JSON.parse(localStorage.getItem("client") || "[]");
  let taulaClients = document.getElementById("taulaClients");
  taulaClients.textContent = "";

  if (clients.length === 0) {
    taulaClients.appendChild(document.createTextNode("No hi ha registres guardats."));

  }    
  return clients;
}

// Funció per generar la taula i les dades
function generaTaula (clients){
  let taula = document.createElement("table");
  let tHead = document.createElement("thead");
  let trHead = document.createElement("tr");

  // Dades de la capçalera de la taula
  let columnes = [
    "ID", "Nom", "Cognoms", "Identificació fiscal", "Nombre", 
    "Data de naixement", "Telèfon", "Email", "Adreça", 
    "Codi Postal", "País", "Província", "Ciutat", "Accions"
  ];

  columnes.forEach(col => {
    let th = document.createElement("th");
    th.appendChild(document.createTextNode(col));
    trHead.appendChild(th);
  });

    tHead.appendChild(trHead);
    taula.appendChild(tHead);

  // Cos de la taula
  let tbody = document.createElement("tbody");
  
  clients.forEach((client, index) => {
    let tr = document.createElement("tr");
    
    // Fila del id de la taula
    let tdId = document.createElement("td");
    tdId.appendChild(document.createTextNode(client.id));
    tr.appendChild(tdId);

    // Fila del name de la taula
    let tdName = document.createElement("td");
    tdName.appendChild(document.createTextNode(client.name));
    tr.appendChild(tdName);

    // Fila del surname de la taula
    let tdSurname = document.createElement("td");
    tdSurname.appendChild(document.createTextNode(client.surname));;
    tr.appendChild(tdSurname);

    // Fila del tipus de document de la taula
    let tdTaxidtype = document.createElement("td");
    tdTaxidtype.appendChild(document.createTextNode(client.taxidtype));
    tr.appendChild(tdTaxidtype);

    // Fila del nombre del document de la taula
    let tdTaxid = document.createElement("td");
    tdTaxid.appendChild(document.createTextNode(client.taxid));
    tr.appendChild(tdTaxid);

    // Fila del aniversari de la taula
    let tdBirth_date = document.createElement("td");
    tdBirth_date.appendChild(document.createTextNode(client.birth_date));
    tr.appendChild(tdBirth_date);

    // Fila del telèfon de la taula
    let tdPhone = document.createElement("td");
    tdPhone.appendChild(document.createTextNode(client.phone));
    tr.appendChild(tdPhone);

    // Fila del email de la taula
    let tdEmail = document.createElement("td");
    tdEmail.appendChild(document.createTextNode(client.email));
    tr.appendChild(tdEmail);

    // Fila del adreça de la taula
    let tdAddress = document.createElement("td");
    tdAddress.appendChild(document.createTextNode(client.address));
    tr.appendChild(tdAddress);

    // Fila del cp de la taula
    let tdCp = document.createElement("td");
    tdCp.appendChild(document.createTextNode(client.cp));
    tr.appendChild(tdCp);

    // Fila del ciutat de la taula
    let tdCountry_id = document.createElement("td");
    tdCountry_id.appendChild(document.createTextNode(client.country_id));
    tr.appendChild(tdCountry_id);

    // Fila del provincia de la taula
    let tdProvince_id = document.createElement("td");
    tdProvince_id.appendChild(document.createTextNode(client.province_id));
    tr.appendChild(tdProvince_id);

    // Fila del ciutat de la taula
    let tdCity_id = document.createElement("td");
    tdCity_id.appendChild(document.createTextNode(client.city_id));
    tr.appendChild(tdCity_id);

    // Fila d'accions de la taula
        let tdAccions = document.createElement("td");

        let botoModificar = document.createElement("button");
        botoModificar.type = "button";
        botoModificar.appendChild(document.createTextNode("Modificar"));
        botoModificar.addEventListener("click", () =>{
          window.location.href = `./registre/registreModificar.html?index=${index}`;
        });

        let botoEsborrar = document.createElement("button");
        botoEsborrar.type = "button";
        botoEsborrar.appendChild(document.createTextNode("Eliminar"));
        botoEsborrar.addEventListener("click", () => {
          window.location.href = `./registre/registreEliminar.html?index=${index}`;
        });

        // Afegim els botons a la taula
        tdAccions.appendChild(botoModificar);
        tdAccions.appendChild(botoEsborrar);
        tr.appendChild(tdAccions);

        tbody.appendChild(tr);
      });  
      taula.appendChild(tbody);
      taulaClients.appendChild(taula);
}

/*const visualitzarLlista = document.getElementById("llista");
  visualitzarLlista.innerHTML = "";
  let aux = "";
  llista.forEach((item, index) => {
    aux +=
      "<li><button onclick='esborrarPais(" +
      index +
      ")'>Esborrar</button><button onclick='actualitzar(" +
      index +
      ")'>Modificar</button>" +
      item.country +
      "<a href='./provincia/provinciaLocalitzacio.html?country=" +
      item.country +
      "'><button>Provincia</button></a></li>";
  });

  visualitzarLlista.innerHTML = aux;*/




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

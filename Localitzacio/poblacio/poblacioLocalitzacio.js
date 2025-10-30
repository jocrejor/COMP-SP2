document.addEventListener("DOMContentLoaded", main);

let accio = "Afegir";
let countryId = null;
let provinceId = null;
let countryName = "";
let provinceName = "";
let ciutatsFiltrades = [];

function main() {
  const params = new URLSearchParams(window.location.search);
  countryId = Number(params.get("country_id")) || null;
  provinceId = Number(params.get("province_id")) || null;
  provinceName = params.get("province") ? decodeURIComponent(params.get("province")) : "(Desconeguda)";

  // Llegim Country i City des de localStorage si existeixen
  if (localStorage.getItem("Country")) {
    window.Country = JSON.parse(localStorage.getItem("Country"));
  }
  if (localStorage.getItem("City")) {
    window.City = JSON.parse(localStorage.getItem("City"));
  }

  // Nom del país
  if (countryId) {
    const paisTrobat = Country.find(c => c.id === countryId);
    if (paisTrobat) countryName = paisTrobat.name;
  }

  document.getElementById("id_country").textContent = "País seleccionat: " + (countryName || "(Desconegut)");
  document.getElementById("id_province").textContent = "Província seleccionada: " + provinceName;

  if (!provinceId) {
    alert("No s'ha pogut determinar la província seleccionada.");
    return;
  }

  // Filtrar ciutats de la província actual
  ciutatsFiltrades = City.filter(c => c.province_id === provinceId);

  mostrarLlista(ciutatsFiltrades);

  const boto = document.getElementById("afegir");
  boto.textContent = accio;

  boto.addEventListener("click", () => {
    if (!validarCiutat()) return;

    if (accio === "Afegir") {
      crearPoblacio();
    } else {
      actualitzarPoblacio();
      accio = "Afegir";
      boto.textContent = accio;
    }

    document.getElementById("city").value = "";
    document.getElementById("index").value = "-1";
    mostrarLlista(ciutatsFiltrades);
  });
}

// 🧱 Mostrar llista
function mostrarLlista(array) {
  const llista = document.getElementById("llista");
  llista.innerHTML = "";

  if (array.length === 0) {
    llista.innerHTML = "<li>(No hi ha cap població)</li>";
    return;
  }

  array.forEach((city, index) => {
    const li = document.createElement("li");

    const btnDel = document.createElement("button");
    btnDel.textContent = "🗑️";
    btnDel.addEventListener("click", () => esborrarPoblacio(index));

    const btnEdit = document.createElement("button");
    btnEdit.textContent = "✏️";
    btnEdit.addEventListener("click", () => prepararActualitzar(index));

    li.appendChild(btnDel);
    li.appendChild(btnEdit);
    li.appendChild(document.createTextNode(" " + city.name));

    llista.appendChild(li);
  });
}

// ➕ Crear nova població
function crearPoblacio() {
  const nom = document.getElementById("city").value.trim();
  const newId = City.length ? Math.max(...City.map(c => c.id)) + 1 : 1;

  const nova = {
    id: newId,
    province_id: provinceId,
    name: nom
  };

  City.push(nova);
  ciutatsFiltrades.push(nova);

  localStorage.setItem("City", JSON.stringify(City));
}

// ✏️ Preparar per editar
function prepararActualitzar(index) {
  const ciutat = ciutatsFiltrades[index];
  document.getElementById("index").value = index;
  document.getElementById("city").value = ciutat.name;
  accio = "Actualitzar";
  document.getElementById("afegir").textContent = accio;

  // Mostrar només la ciutat seleccionada
  mostrarLlista([ciutat]);
}

// 🔄 Actualitzar ciutat
function actualitzarPoblacio() {
  const index = Number(document.getElementById("index").value);
  const nouNom = document.getElementById("city").value.trim();

  if (index < 0 || !ciutatsFiltrades[index]) return;

  const idCiutat = ciutatsFiltrades[index].id;

  // Actualitzem dins ciutatsFiltrades
  ciutatsFiltrades[index].name = nouNom;

  // Actualitzem dins City (array global)
  const cityGlobal = City.find(c => c.id === idCiutat);
  if (cityGlobal) cityGlobal.name = nouNom;

  // Guardem canvis
  localStorage.setItem("City", JSON.stringify(City));
}

// 🗑️ Eliminar ciutat
function esborrarPoblacio(index) {
  const idEliminar = ciutatsFiltrades[index].id;

  // Esborrem del global
  const idxGlobal = City.findIndex(c => c.id === idEliminar);
  if (idxGlobal !== -1) City.splice(idxGlobal, 1);

  // Esborrem del filtrat
  ciutatsFiltrades.splice(index, 1);

  // Guardem
  localStorage.setItem("City", JSON.stringify(City));

  mostrarLlista(ciutatsFiltrades);
}

// 🧩 Validació
function validarCiutat() {
  const input = document.getElementById("city");
  const nom = input.value.trim().toLowerCase();

  if (nom === "") {
    document.getElementById("mensajeError").textContent = "Has d’introduïr una ciutat.";
    return false;
  }

  if (input.validity.patternMismatch) {
    document.getElementById("mensajeError").textContent = "Ha de tindre una mida de 3 a 30 caràcters.";
    return false;
  }

  // Evitem duplicats
  const indexActual = Number(document.getElementById("index").value);
  const duplicada = ciutatsFiltrades.some((c, i) => i !== indexActual && c.name.toLowerCase() === nom);
  if (duplicada) {
    document.getElementById("mensajeError").textContent = "La ciutat ja existeix en esta província.";
    return false;
  }

  document.getElementById("mensajeError").textContent = "";
  return true;
}
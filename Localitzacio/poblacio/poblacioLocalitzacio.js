// Esperem que el DOM estiga carregat
document.addEventListener("DOMContentLoaded", main);

let accio = "Afegir";
let countryId = null;
let provinceId = null;
let countryName = "";
let provinceName = "";
let ciutatsFiltrades = [];

function main() {
  // Llegim els paràmetres de la URL
  const params = new URLSearchParams(window.location.search);
  countryId = Number(params.get("country_id")) || null;
  provinceId = Number(params.get("province_id")) || null;
  provinceName = params.get("province") ? decodeURIComponent(params.get("province")) : "(Desconeguda)";

  // Busquem el nom del país (per mostrar-lo)
  if (countryId) {
    const paisTrobat = Country.find(c => c.id === countryId);
    if (paisTrobat) countryName = paisTrobat.name;
  }

  // Mostrem els títols
  document.getElementById("id_country").textContent = "País seleccionat: " + (countryName || "(Desconegut)");
  document.getElementById("id_province").textContent = "Província seleccionada: " + provinceName;

  // Si no tenim provinceId, parem
  if (!provinceId) {
    alert("No s'ha pogut determinar la província seleccionada.");
    return;
  }

  // Filtrar les ciutats de la província seleccionada
  ciutatsFiltrades = City.filter(c => c.province_id === provinceId);

  mostrarLlista(ciutatsFiltrades);

  const afegirButton = document.getElementById("afegir");
  afegirButton.textContent = accio;

  // Listener per al botó Afegir / Actualitzar
  afegirButton.addEventListener("click", () => {
    if (!validarCiutat()) return;

    if (accio === "Afegir") {
      crearPoblacio();
    } else {
      actualitzarPoblacio();
      accio = "Afegir";
      afegirButton.textContent = accio;
    }

    // Netejar formulari i tornar a mostrar totes les ciutats
    document.getElementById("city").value = "";
    document.getElementById("index").value = "-1";
    mostrarLlista(ciutatsFiltrades);
  });
}

// Mostrar la llista de ciutats filtrades
function mostrarLlista(array) {
  const visualitzarLlista = document.getElementById("llista");
  visualitzarLlista.innerHTML = "";

  if (array.length === 0) {
    visualitzarLlista.innerHTML = "<li>(No hi ha cap població)</li>";
    return;
  }

  let html = "";
  array.forEach((city, index) => {
    html += `
      <li>
        <button onclick="esborrarPoblacio(${index})">🗑️</button>
        <button onclick="prepararActualitzar(${index})">✏️</button>
        ${city.name}
      </li>
    `;
  });

  visualitzarLlista.innerHTML = html;
}

// Crear una nova població dins de la província actual
function crearPoblacio() {
  const cityName = document.getElementById("city").value.trim();
  let newId = City.length ? Math.max(...City.map(c => c.id)) + 1 : 1;

  const novaCity = {
    id: newId,
    province_id: provinceId,
    name: cityName
  };

  City.push(novaCity);
  ciutatsFiltrades.push(novaCity);
  localStorage.setItem("City", JSON.stringify(City));
}

// Actualitzar una població existent
function actualitzarPoblacio() {
  const index = document.getElementById("index").value;
  const cityName = document.getElementById("city").value.trim();

  ciutatsFiltrades[index].name = cityName;
  const cityId = ciutatsFiltrades[index].id;

  const cityGeneral = City.find(c => c.id === cityId);
  if (cityGeneral) cityGeneral.name = cityName;

  localStorage.setItem("City", JSON.stringify(City));
}

// Esborrar una població de debò
function esborrarPoblacio(index) {
  const idAEliminar = ciutatsFiltrades[index].id;

  // Esborrem del City global
  const idxGeneral = City.findIndex(c => c.id === idAEliminar);
  if (idxGeneral !== -1) City.splice(idxGeneral, 1);

  // Esborrem del filtre local
  ciutatsFiltrades.splice(index, 1);

  // Guardem canvis
  localStorage.setItem("City", JSON.stringify(City));

  // Tornem a mostrar
  mostrarLlista(ciutatsFiltrades);
}

// Quan cliquem “Modificar”
function prepararActualitzar(index) {
  document.getElementById("index").value = index;
  document.getElementById("city").value = ciutatsFiltrades[index].name;
  accio = "Actualitzar";
  document.getElementById("afegir").textContent = accio;

  // 🧩 Mostrem només la ciutat seleccionada per editar
  const ciutatSeleccionada = [ciutatsFiltrades[index]];
  mostrarLlista(ciutatSeleccionada);
}

// Validar el nom de la ciutat
function validarCiutat() {
  let city = document.getElementById("city");
  let nom = city.value.trim().toLowerCase();

  if (nom === "") {
    document.getElementById("mensajeError").textContent = "Has d’introduïr una ciutat.";
    return false;
  }

  if (city.validity.patternMismatch) {
    document.getElementById("mensajeError").textContent = "Ha de tindre una mida de 3 a 30 caràcters.";
    return false;
  }

  // Evitem duplicats dins de la mateixa província
  const indexActual = document.getElementById("index").value;
  for (let i = 0; i < ciutatsFiltrades.length; i++) {
    if (i != indexActual && ciutatsFiltrades[i].name.toLowerCase() === nom) {
      document.getElementById("mensajeError").textContent = "La ciutat ja existeix en esta província.";
      return false;
    }
  }

  document.getElementById("mensajeError").textContent = "";
  return true;
}

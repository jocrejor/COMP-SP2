// Esperem que el DOM estiga carregat
document.addEventListener("DOMContentLoaded", main);

let accio = "Afegir";
let countryId = null;
let provinceId = null;
let countryName = "";
let provinceName = "";
let ciutatsFiltrades = [];

async function main() {
  // Llegim els paràmetres de la URL
  const params = new URLSearchParams(window.location.search);
  countryId = Number(params.get("country_id")) || null;
  provinceId = Number(params.get("province_id")) || null;
  provinceName = params.get("province") ? decodeURIComponent(params.get("province")) : "(Desconeguda)";

  // Busquem el nom del país
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

  // 🔍 Filtre en temps real amb la lupa
  const buscarInput = document.getElementById("buscar");
  buscarInput.addEventListener("input", () => {
    const text = buscarInput.value.toLowerCase();
    const filtrades = ciutatsFiltrades.filter(c => c.name.toLowerCase().includes(text));
    mostrarLlista(filtrades);
  });
}

// Mostrar la llista de ciutats filtrades
function mostrarLlista(array) {
    const visualitzarLlista = document.getElementById("llista");
    visualitzarLlista.innerHTML = "";

    let html = "";
    array.forEach((city, index) => {
        html += `
            <li>
                <button onclick="esborrarPoblacio(${index})">🗑️ Esborrar</button>
                <button onclick="prepararActualitzar(${index})">✏️ Modificar</button>
                ${city.name}
            </li>
        `;
    });

    visualitzarLlista.innerHTML = html;
}

// Crear una nova població dins de la província actual
// Función para comprobar el tamaño de los datos en localStorage
function getStorageSize() {
    const keys = Object.keys(localStorage);
    let total = 0;
    keys.forEach(key => {
        total += localStorage.getItem(key).length;
    });
    return total;
}

// Función para crear una nueva población
function crearPoblacio() {
    const cityName = document.getElementById("city").value.trim();

    // Generar un nuevo ID basado en el último ID en el array de City
    const newId = City.length > 0 ? City[City.length - 1].id + 1 : 1;

    const novaCity = {
        id: newId,
        province_id: provinceId,
        name: cityName
    };

    // Añadir la nueva ciudad a las listas
    City.push(novaCity);
    ciutatsFiltrades.push(novaCity);

    // Intentamos guardar en localStorage
    try {
        // Antes de guardar, verificamos si el tamaño de los datos excederá el límite
        const dataToSave = JSON.stringify(City);
        const dataSize = getStorageSize();
        const dataSizeAfterAdding = dataSize + dataToSave.length;

        if (dataSizeAfterAdding > 5 * 1024 * 1024) {  // 5 MB es el límite de localStorage
            console.log("LocalStorage lleno. Limpiando el almacenamiento...");

            // Limpiar el almacenamiento eliminando todos los elementos del localStorage relacionados con "City"
            localStorage.removeItem("City");

            // Luego, se guardan solo las nuevas ciudades (sin borrar las definidas en Location.js)
            localStorage.setItem("City", JSON.stringify(City));
        } else {
            // Si no se excede el límite, guardamos normalmente
            localStorage.setItem("City", JSON.stringify(City));
        }
    } catch (e) {
        console.error("Error al guardar en localStorage", e);
    }

    // Llamar a alguna función para actualizar la vista si es necesario
    mostrarLlista(ciutatsFiltrades);
}





// Actualitzar una població existent
function actualitzarPoblacio() {
    const index = document.getElementById("index").value;
    const cityName = document.getElementById("city").value.trim();

    // Actualizar el nombre de la ciudad en las listas
    ciutatsFiltrades[index].name = cityName;
    const cityId = ciutatsFiltrades[index].id;

    const cityGeneral = City.find(c => c.id === cityId);
    if (cityGeneral) cityGeneral.name = cityName;

    // Intentar guardar en localStorage
    try {
        localStorage.setItem("City", JSON.stringify(City));  // Intentar guardar
    } catch (e) {
        // Si hay un error de QuotaExceededError, eliminamos el primer elemento
        if (e.name === 'QuotaExceededError') {
            console.log("LocalStorage lleno. Eliminando el primer elemento...");

            // Eliminar el primer elemento de City y ciutatsFiltrades
            City.shift();
            ciutatsFiltrades.shift();

            // Intentar guardar nuevamente después de eliminar el primer elemento
            localStorage.setItem("City", JSON.stringify(City));
        } else {
            console.error("Error al guardar en localStorage", e);
        }
    }

    // Actualizar la vista
    mostrarLlista(ciutatsFiltrades);
}




// Esborrar una població de debò
function esborrarPoblacio(index) {
    const poblacioNom = ciutatsFiltrades[index].name;

    // Finestra emergent de confirmació
    const confirmar = confirm(`Vols eliminar la població "${poblacioNom}"?`);

    if (confirmar) {
        // Si l'usuari prem "Acceptar", eliminem
        const idAEliminar = ciutatsFiltrades[index].id;

        // Eliminar de la llista global de ciutats
        const idxGeneral = City.findIndex(c => c.id === idAEliminar);
        if (idxGeneral !== -1) City.splice(idxGeneral, 1);

        // Eliminar de la llista local filtrada
        ciutatsFiltrades.splice(index, 1);

        // Guardem els canvis en localStorage

        // Tornem a mostrar la llista actualitzada
        mostrarLlista(ciutatsFiltrades);

        // Mostrem alerta de confirmació
        alert(`La població "${poblacioNom}" s'ha eliminat correctament.`);
    } else {
        // Si prem "Cancel·lar", no fem res
        alert(`S'ha cancel·lat l'eliminació de la població "${poblacioNom}".`);
    }
}


// Quan cliquem “Modificar”
function prepararActualitzar(index) {
    document.getElementById("index").value = index;
    document.getElementById("city").value = ciutatsFiltrades[index].name;
    accio = "Actualitzar";
    document.getElementById("afegir").textContent = accio;
}

// Validar el nom de la ciutat
function validarCiutat() {
    let city = document.getElementById("city");
    let nom = city.value.trim().toLowerCase();

    if (nom === "") {
        document.getElementById("mensajeError").textContent = "Has d'introduïr una ciutat.";
        return false;
    }

    if (city.validity.patternMismatch) {
        document.getElementById("mensajeError").textContent = "Ha de tindre una mida de 3 a 30 caràcters.";
        return false;
    }

    // Evitem duplicats dins de la mateixa província
    const indexActual = document.getElementById("index").value;
    if (ciutatsFiltrades.some((ciutat, i) => i != indexActual && ciutat.name.toLowerCase() === nom)) {
        document.getElementById("mensajeError").textContent = "La ciutat ja existeix en esta província.";
        return false;
    }

    document.getElementById("mensajeError").textContent = "";
    return true;
}
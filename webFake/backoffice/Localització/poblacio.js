// Esperem que el DOM estiga carregat
document.addEventListener("DOMContentLoaded", main);

// Variables globals
let accio = "Afegir";
let countryId = null;
let provinceId = null;
let countryName = "";
let provinceName = "";
let ciutatsFiltrades = [];

// Funció principal que s'executa quan es carrega la pàgina
async function main() {
    // Llegim els paràmetres de la URL
    llegirParametresURL();
    
    // Mostrem els títols amb la informació del context
    mostrarInformacioContext();
    
    // Si no tenim provinceId, parem l'execució
    if (!provinceId) {
        alert("No s'ha pogut determinar la província seleccionada.");
        return;
    }
    
    // Filtrar les ciutats de la província seleccionada
    ciutatsFiltrades = City.filter(c => c.province_id === provinceId);
    mostrarLlista(ciutatsFiltrades);
    
    // Configurem el botó d'afegir/actualitzar
    configurarBotoAfegir();
    
    // Configurem el cercador
    configurarCercador();
}

// --- FUNCIONS D'INICIALITZACIÓ ---

// Llegeix els paràmetres de la URL
function llegirParametresURL() {
    const params = new URLSearchParams(window.location.search);
    countryId = Number(params.get("country_id")) || null;
    provinceId = Number(params.get("province_id")) || null;
    provinceName = params.get("province") ? decodeURIComponent(params.get("province")) : "(Desconeguda)";
    
    // Busquem el nom del país
    if (countryId) {
        const paisTrobat = Country.find(c => c.id === countryId);
        if (paisTrobat) countryName = paisTrobat.name;
    }
}

// Mostra la informació del context (país i província)
function mostrarInformacioContext() {
    document.getElementById("id_country").textContent = "País seleccionat: " + (countryName || "(Desconegut)");
    document.getElementById("id_province").textContent = "Província seleccionada: " + provinceName;
}

// Configura el botó d'afegir/actualitzar
function configurarBotoAfegir() {
    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;
    
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
        netejarFormulari();
        mostrarLlista(ciutatsFiltrades);
    });
}

// Configura el cercador de poblacions
function configurarCercador() {
    const buscarInput = document.getElementById("buscar");
    buscarInput.addEventListener("input", () => {
        const text = buscarInput.value.toLowerCase();
        const filtrades = ciutatsFiltrades.filter(c => c.name.toLowerCase().includes(text));
        mostrarLlista(filtrades);
    });
}

// --- FUNCIONS DE GESTIÓ DE POBLACIONS ---

// Mostra la llista de ciutats a la pàgina
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

// Crea una nova població dins de la província actual
function crearPoblacio() {
    const cityName = document.getElementById("city").value.trim();
    
    // Generar un nou ID basat en l'últim ID en l'array de City
    const newId = City.length > 0 ? City[City.length - 1].id + 1 : 1;
    
    const novaCity = {
        id: newId,
        province_id: provinceId,
        name: cityName
    };
    
    // Afegir la nova ciutat a les llistes
    City.push(novaCity);
    ciutatsFiltrades.push(novaCity);
    
    // Guardar en localStorage amb gestió de quota
    guardarEnLocalStorage();
    
    // Actualitzar la vista
    mostrarLlista(ciutatsFiltrades);
}

// Actualitza una població existent
function actualitzarPoblacio() {
    const index = document.getElementById("index").value;
    const cityName = document.getElementById("city").value.trim();
    
    // Actualitzar el nom de la ciutat en les llistes
    ciutatsFiltrades[index].name = cityName;
    const cityId = ciutatsFiltrades[index].id;
    
    const cityGeneral = City.find(c => c.id === cityId);
    if (cityGeneral) cityGeneral.name = cityName;
    
    // Intentar guardar en localStorage
    try {
        localStorage.setItem("City", JSON.stringify(City));
    } catch (e) {
        // Si hi ha un error de QuotaExceededError, eliminem el primer element
        if (e.name === 'QuotaExceededError') {
            console.log("LocalStorage ple. Eliminant el primer element...");
            
            // Eliminar el primer element de City i ciutatsFiltrades
            City.shift();
            ciutatsFiltrades.shift();
            
            // Intentar guardar novament després d'eliminar el primer element
            localStorage.setItem("City", JSON.stringify(City));
        } else {
            console.error("Error al guardar en localStorage", e);
        }
    }
    
    // Actualitzar la vista
    mostrarLlista(ciutatsFiltrades);
}

// Esborra una població
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
        localStorage.setItem("City", JSON.stringify(City));
        
        // Tornem a mostrar la llista actualitzada
        mostrarLlista(ciutatsFiltrades);
        
        // Mostrem alerta de confirmació
        alert(`La població "${poblacioNom}" s'ha eliminat correctament.`);
    } else {
        // Si prem "Cancel·lar", no fem res
        alert(`S'ha cancel·lat l'eliminació de la població "${poblacioNom}".`);
    }
}

// Prepara la interfície per actualitzar una població
function prepararActualitzar(index) {
    document.getElementById("index").value = index;
    document.getElementById("city").value = ciutatsFiltrades[index].name;
    accio = "Actualitzar";
    document.getElementById("afegir").textContent = accio;
}

// --- FUNCIONS AUXILIARS ---

// Valida el nom de la ciutat abans d'afegir-la o actualitzar-la
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

// Neteja els camps del formulari
function netejarFormulari() {
    document.getElementById("city").value = "";
    document.getElementById("index").value = "-1";
}

// Funció per comprovar la mida dels dades en localStorage
function getStorageSize() {
    const keys = Object.keys(localStorage);
    let total = 0;
    keys.forEach(key => {
        total += localStorage.getItem(key).length;
    });
    return total;
}

// Funció per guardar en localStorage amb gestió de quota
function guardarEnLocalStorage() {
    try {
        // Abans de guardar, verifiquem si la mida de les dades excedirà el límit
        const dataToSave = JSON.stringify(City);
        const dataSize = getStorageSize();
        const dataSizeAfterAdding = dataSize + dataToSave.length;
        
        if (dataSizeAfterAdding > 5 * 1024 * 1024) {  // 5 MB és el límit de localStorage
            console.log("LocalStorage ple. Netejant l'emmagatzematge...");
            
            // Netejar l'emmagatzematge eliminant tots els elements del localStorage relacionats amb "City"
            localStorage.removeItem("City");
            
            // Després, es guarden només les noves ciutats (sense esborrar les definides en Location.js)
            localStorage.setItem("City", JSON.stringify(City));
        } else {
            // Si no s'excedeix el límit, guardem normalment
            localStorage.setItem("City", JSON.stringify(City));
        }
    } catch (e) {
        console.error("Error al guardar en localStorage", e);
    }
}
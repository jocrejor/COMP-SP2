// Esperem que el DOM estiga carregat
document.addEventListener("DOMContentLoaded", main);

// Variables globals
let accio = "Afegir";
let countryId = null;
let countryName = "";
let provinciesFiltrades = [];

// Funció principal que s'executa quan es carrega la pàgina
async function main() {
    // Llegim els paràmetres de la URL
    llegirParametresURL();
    
    // Mostrem la informació del context
    mostrarInformacioContext();
    
    // Si no tenim countryId, parem l'execució
    if (!countryId) {
        alert("No s'ha pogut determinar el país seleccionat.");
        return;
    }
    
    // Filtrar províncies del país seleccionat
    provinciesFiltrades = Province.filter(p => p.country_id === countryId);
    mostrarLlista(provinciesFiltrades);
    
    // Configurem el botó d'afegir/actualitzar
    configurarBotoAfegir();
    
    // Configurem el cercador
    configurarCercador();
}

// --- FUNCIONS D'INICIALITZACIÓ ---

// Llegeix els paràmetres de la URL
function llegirParametresURL() {
    const params = new URLSearchParams(window.location.search);
    countryName = params.get("country");
    countryId = Number(params.get("id")) || null;
    
    // Si no tenim country_id, intentem trobar-lo pel nom
    if (!countryId && countryName) {
        const paisTrobat = Country.find(c => c.name.toLowerCase() === countryName.toLowerCase());
        if (paisTrobat) countryId = paisTrobat.id;
    }
}

// Mostra la informació del context (país seleccionat)
function mostrarInformacioContext() {
    document.getElementById("id").textContent = "País seleccionat: " + (countryName || "(Desconegut)");
}

// Configura el botó d'afegir/actualitzar
function configurarBotoAfegir() {
    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;
    
    afegirButton.addEventListener("click", () => {
        if (!validarProvincia()) return;
        
        if (accio === "Afegir") {
            crearProvincia();
        } else {
            actualitzarProvincia();
            accio = "Afegir";
            afegirButton.textContent = accio;
        }
        
        // Netejar formulari i tornar a mostrar la llista
        netejarFormulari();
        mostrarLlista(provinciesFiltrades);
    });
}

// Configura el cercador de províncies
function configurarCercador() {
    const buscarInput = document.getElementById("buscar");
    buscarInput.addEventListener("input", () => {
        const text = buscarInput.value.toLowerCase();
        const filtrades = provinciesFiltrades.filter(p => p.name.toLowerCase().includes(text));
        mostrarLlista(filtrades);
    });
}

// --- FUNCIONS DE GESTIÓ DE PROVÍNCIES ---

// Mostra la llista de províncies a la pàgina
function mostrarLlista(array) {
    const visualitzarLlista = document.getElementById("llista");
    visualitzarLlista.innerHTML = "";
    
    let html = "";
    array.forEach((prov, index) => {
        html += `
            <li>
                <button onclick="esborrarProvincia(${index})">🗑️ Esborrar</button>
                <button onclick="prepararActualitzar(${index})">✏️ Modificar</button>
                <a href="./poblacio.html?country_id=${countryId}&province_id=${prov.id}&province=${encodeURIComponent(prov.name)}">
                    <button>Poblacions</button>
                </a>
                ${prov.name}
            </li>
        `;
    });
    
    visualitzarLlista.innerHTML = html;
}

// Crea una nova província
function crearProvincia() {
    const provinceName = document.getElementById("province").value.trim();
    let newId = Province.length ? Math.max(...Province.map(p => p.id)) + 1 : 1;
    
    const novaProv = {
        id: newId,
        country_id: countryId,
        name: provinceName
    };
    
    Province.push(novaProv);
    provinciesFiltrades.push(novaProv);
    localStorage.setItem("Province", JSON.stringify(Province));
}

// Actualitza una província existent
function actualitzarProvincia() {
    const index = document.getElementById("index").value;
    const provinceName = document.getElementById("province").value.trim();
    
    provinciesFiltrades[index].name = provinceName;
    const provId = provinciesFiltrades[index].id;
    
    const provGeneral = Province.find(p => p.id === provId);
    if (provGeneral) provGeneral.name = provinceName;
    
    localStorage.setItem("Province", JSON.stringify(Province));
}

// Esborra una província
function esborrarProvincia(index) {
    const provinciaNom = provinciesFiltrades[index].name;
    const provinciaId = provinciesFiltrades[index].id;
    
    // Finestra emergent de confirmació
    const confirmar = confirm(`Vols eliminar la província "${provinciaNom}"?`);
    
    if (confirmar) {
        // Si l'usuari prem "Acceptar", eliminem
        const idAEliminar = provinciesFiltrades[index].id;
        
        // Eliminar de la llista global de províncies
        const idxGeneral = Province.findIndex(p => p.id === idAEliminar);
        if (idxGeneral !== -1) Province.splice(idxGeneral, 1);
        
        // Eliminar de la llista local filtrada
        provinciesFiltrades.splice(index, 1);
        
        // Guardar els canvis en localStorage
        localStorage.setItem("Province", JSON.stringify(Province));
        
        // Tornar a mostrar la llista actualitzada
        mostrarLlista(provinciesFiltrades);
        
        // Mostrar alerta de confirmació
        alert(`La província "${provinciaNom}" s'ha eliminat correctament.`);
    } else {
        // Si prem "Cancel·lar", no fem res
        alert(`S'ha cancel·lat l'eliminació de "${provinciaNom}".`);
    }
}

// Prepara la interfície per actualitzar una província
function prepararActualitzar(index) {
    document.getElementById("index").value = index;
    document.getElementById("province").value = provinciesFiltrades[index].name;
    accio = "Actualitzar";
    document.getElementById("afegir").textContent = accio;
}

// --- FUNCIONS AUXILIARS ---

// Valida el nom de la província abans d'afegir-la o actualitzar-la
function validarProvincia() {
    let province = document.getElementById("province");
    let nom = province.value.trim().toLowerCase();
    
    if (nom === "") {
        document.getElementById("mensajeError").textContent = "Has d'introduïr una província.";
        return false;
    }
    
    if (province.validity.patternMismatch) {
        document.getElementById("mensajeError").textContent = "Ha de tindre una mida de 3 a 30 caràcters.";
        return false;
    }
    
    // Evitem duplicats dins del mateix país
    if (provinciesFiltrades.some(p => p.name.toLowerCase() === nom)) {
        document.getElementById("mensajeError").textContent = "La província ja existeix en este país.";
        return false;
    }
    
    document.getElementById("mensajeError").textContent = "";
    return true;
}

// Neteja els camps del formulari
function netejarFormulari() {
    document.getElementById("province").value = "";
    document.getElementById("index").value = "-1";
}
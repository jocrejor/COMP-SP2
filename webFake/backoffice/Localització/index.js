// Esperem que el DOM estiga carregat
document.addEventListener("DOMContentLoaded", main);

// Variables globals
let accio = "Afegir";
let paisosFiltrats = [];

// Funció principal que s'executa quan es carrega la pàgina
async function main() {
    // --- Carreguem les dades inicials des de localStorage ---
    carregarDadesInicials();

    // Inicialitzem la llista de països filtrats
    paisosFiltrats = [...Country];
    mostrarLlista(paisosFiltrats);

    // Configurem el botó d'afegir/actualitzar
    configurarBotoAfegir();

    // Configurem el cercador (si existeix)
    configurarCercador();
}

// --- FUNCIONS D'INICIALITZACIÓ ---

// Carrega les dades inicials des de localStorage
function carregarDadesInicials() {
    if (localStorage.getItem("Country")) {
        Country = JSON.parse(localStorage.getItem("Country"));
    } else if (typeof Country === "undefined") {
        Country = [];
        localStorage.setItem("Country", JSON.stringify(Country));
    }
}

// Configura el botó d'afegir/actualitzar
function configurarBotoAfegir() {
    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;

    afegirButton.addEventListener("click", () => {
        if (!validarPais()) return;

        if (accio === "Afegir") {
            crearPais();
        } else {
            actualitzarPais();
            accio = "Afegir";
            afegirButton.textContent = accio;
        }

        // Netejar camps després de l'acció
        netejarCamps();
        mostrarLlista(paisosFiltrats);
    });
}

// Configura el cercador de països
function configurarCercador() {
    const buscarInput = document.getElementById("buscar");
    if (buscarInput) {
        buscarInput.addEventListener("input", () => {
            const text = buscarInput.value.toLowerCase();
            const filtrats = paisosFiltrats.filter(p =>
                p.name.toLowerCase().includes(text)
            );
            mostrarLlista(filtrats);
        });
    }
}

// --- FUNCIONS DE GESTIÓ DE PAÏSOS ---

// Mostra la llista de països a la pàgina
function mostrarLlista(array) {
    const visualitzarLlista = document.getElementById("llista");
    visualitzarLlista.innerHTML = "";

    let html = "";
    array.forEach((pais, index) => {
        html += `
            <li>
                <button onclick="esborrarPais(${index})">🗑️ Esborrar</button>
                <button onclick="prepararActualitzar(${index})">✏️ Modificar</button>
                <a href="./provincia.html?id=${pais.id}&country=${encodeURIComponent(pais.name)}">
                    <button>🏙️ Províncies</button>
                </a>
                ${pais.name}
            </li>
        `;
    });

    visualitzarLlista.innerHTML = html;
}

// Crea un nou país
function crearPais() {
    const nomPais = document.getElementById("country").value.trim();
    const nouId = Country.length ? Math.max(...Country.map(p => p.id)) + 1 : 1;

    const nouPais = {
        id: nouId,
        name: nomPais
    };

    Country.push(nouPais);
    paisosFiltrats.push(nouPais);

    localStorage.setItem("Country", JSON.stringify(Country));
    mostrarLlista(paisosFiltrats);
}

// Actualitza un país existent
function actualitzarPais() {
    const index = document.getElementById("index").value;
    const nomPais = document.getElementById("country").value.trim();

    paisosFiltrats[index].name = nomPais;
    const paisId = paisosFiltrats[index].id;

    const paisGeneral = Country.find(p => p.id === paisId);
    if (paisGeneral) paisGeneral.name = nomPais;

    localStorage.setItem("Country", JSON.stringify(Country));
    mostrarLlista(paisosFiltrats);
}

// Esborra un país
function esborrarPais(index) {
    const paisNom = paisosFiltrats[index].name;

    // Finestra emergent de confirmació
    const confirmar = confirm(`Vols eliminar el país "${paisNom}"?`);

    if (confirmar) {
        // Si l'usuari prem "Acceptar", eliminem
        const idAEliminar = paisosFiltrats[index].id;
        const idxGeneral = Country.findIndex(p => p.id === idAEliminar);
        if (idxGeneral !== -1) Country.splice(idxGeneral, 1);
        paisosFiltrats.splice(index, 1);

        localStorage.setItem("Country", JSON.stringify(Country));
        mostrarLlista(paisosFiltrats);

        // Mostrem alerta de confirmació
        alert(`El país "${paisNom}" s'ha eliminat correctament.`);
    } else {
        // Si prem "Cancel·lar", no fem res
        alert(`S'ha cancel·lat l'eliminació de "${paisNom}".`);
    }
}

// Prepara la interfície per actualitzar un país
function prepararActualitzar(index) {
    document.getElementById("index").value = index;
    document.getElementById("country").value = paisosFiltrats[index].name;
    accio = "Actualitzar";
    document.getElementById("afegir").textContent = accio;
}

// --- FUNCIONS AUXILIARS ---

// Valida el país abans d'afegir-lo o actualitzar-lo
function validarPais() {
    let input = document.getElementById("country");
    let nom = input.value.trim().toLowerCase();

    if (nom === "") {
        document.getElementById("mensajeError").textContent = "Has d'introduïr un país.";
        return false;
    }

    if (input.validity.patternMismatch) {
        document.getElementById("mensajeError").textContent = "Ha de tindre una mida de 3 a 30 caràcters.";
        return false;
    }

    if (paisosFiltrats.some(p => p.name.toLowerCase() === nom)) {
        document.getElementById("mensajeError").textContent = "El país ja existeix.";
        return false;
    }

    document.getElementById("mensajeError").textContent = "";
    return true;
}

// Neteja els camps del formulari
function netejarCamps() {
    document.getElementById("country").value = "";
    document.getElementById("index").value = "-1";
}
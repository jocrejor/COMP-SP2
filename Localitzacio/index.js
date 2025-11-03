// Esperem que el DOM estiga carregat
document.addEventListener("DOMContentLoaded", main);

let accio = "Afegir";
let paisosFiltrats = [];

async function main() {
    // --- Carreguem dades inicials ---
    if (localStorage.getItem("Country")) {
        Country = JSON.parse(localStorage.getItem("Country"));
    } else if (typeof Country === "undefined") {
        Country = [];
        localStorage.setItem("Country", JSON.stringify(Country));
    }

    // Inicialitzem la llista de països filtrats
    paisosFiltrats = [...Country];
    mostrarLlista(paisosFiltrats);

    // Botó Afegir / Actualitzar
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

        // Netejar camps
        document.getElementById("country").value = "";
        document.getElementById("index").value = "-1";

        mostrarLlista(paisosFiltrats);
    });

    // 🔍 Cercador en temps real (opcional)
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

// Mostrar la llista de països
function mostrarLlista(array) {
    const visualitzarLlista = document.getElementById("llista");
    visualitzarLlista.innerHTML = "";

    let html = "";
    array.forEach((pais, index) => {
        html += `
            <li>
                <button onclick="esborrarPais(${index})">🗑️ Esborrar</button>
                <button onclick="prepararActualitzar(${index})">✏️ Modificar</button>
                ${pais.name}
                <a href="./provincia/provinciaLocalitzacio.html?id=${pais.id}&country=${encodeURIComponent(pais.name)}">
                    <button>Províncies</button>
                </a>
            </li>
        `;
    });

    visualitzarLlista.innerHTML = html;
}

// Crear nou país
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

// Actualitzar país
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

// Esborrar país
function esborrarPais(index) {
    const idAEliminar = paisosFiltrats[index].id;
    const idxGeneral = Country.findIndex(p => p.id === idAEliminar);
    if (idxGeneral !== -1) Country.splice(idxGeneral, 1);
    paisosFiltrats.splice(index, 1);

    localStorage.setItem("Country", JSON.stringify(Country));
    mostrarLlista(paisosFiltrats);
}

// Quan cliquem "Modificar"
function prepararActualitzar(index) {
    document.getElementById("index").value = index;
    document.getElementById("country").value = paisosFiltrats[index].name;
    accio = "Actualitzar";
    document.getElementById("afegir").textContent = accio;
}

// Validar país
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

// Esperem que el DOM estiga carregat
document.addEventListener("DOMContentLoaded", main);

let accio = "Afegir";
let paisosFiltrats = [];

async function main() {
    // Carreguem dades de localStorage o de Location.js
    if (localStorage.getItem("Country")) {
        Country = JSON.parse(localStorage.getItem("Country"));
    } else if (typeof Country === "undefined") {
        Country = [];
    } else {
        localStorage.setItem("Country", JSON.stringify(Country));
    }

    paisosFiltrats = [...Country]; // Copiem per mostrar

    mostrarLlista(paisosFiltrats);

    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;

    // 🔘 Botó Afegir / Actualitzar
    afegirButton.addEventListener("click", () => {
        if (!validarPais()) return;

        if (accio === "Afegir") {
            crearPais();
        } else {
            actualitzarPais();
            accio = "Afegir";
            afegirButton.textContent = accio;
        }

        // 🧹 Netejar camps
        document.getElementById("country").value = "";
        document.getElementById("index").value = "-1";

        mostrarLlista(paisosFiltrats);
    });
}

// 🧭 Mostrar la llista de països
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

// ➕ Crear nou país
function crearPais() {
    const nom = document.getElementById("country").value.trim();
    const nouId = Country.length ? Math.max(...Country.map(p => p.id)) + 1 : 1;

    const nouPais = {
        id: nouId,
        name: nom
    };

    Country.push(nouPais);
    paisosFiltrats.push(nouPais);

    localStorage.setItem("Country", JSON.stringify(Country));
}

// ✏️ Actualitzar país
function actualitzarPais() {
    const index = document.getElementById("index").value;
    const nom = document.getElementById("country").value.trim();

    paisosFiltrats[index].name = nom;
    const idPais = paisosFiltrats[index].id;

    const paisGeneral = Country.find(p => p.id === idPais);
    if (paisGeneral) paisGeneral.name = nom;

    localStorage.setItem("Country", JSON.stringify(Country));
}

// 🗑️ Esborrar país
function esborrarPais(index) {
    if (!confirm("Estàs segur que vols eliminar aquest país?")) return;

    const idAEliminar = paisosFiltrats[index].id;

    // Eliminar del conjunt general
    const idxGeneral = Country.findIndex(p => p.id === idAEliminar);
    if (idxGeneral !== -1) Country.splice(idxGeneral, 1);
    paisosFiltrats.splice(index, 1);

    localStorage.setItem("Country", JSON.stringify(Country));
    mostrarLlista(paisosFiltrats);
}

// 🧱 Preparar per actualitzar
function prepararActualitzar(index) {
    document.getElementById("index").value = index;
    document.getElementById("country").value = paisosFiltrats[index].name;
    accio = "Actualitzar";
    document.getElementById("afegir").textContent = accio;
}

// ✅ Validar país
function validarPais() {
    let input = document.getElementById("country");
    let nom = input.value.trim().toLowerCase();

    if (nom === "") {
        document.getElementById("mensajeError").textContent =
            "Has d'introduïr un país.";
        return false;
    }

    if (input.validity.patternMismatch) {
        document.getElementById("mensajeError").textContent =
            "Ha de tindre una mida de 3 a 30 caràcters.";
        return false;
    }

    if (paisosFiltrats.some(p => p.name.toLowerCase() === nom)) {
        document.getElementById("mensajeError").textContent =
            "El país ja existeix.";
        return false;
    }

    document.getElementById("mensajeError").textContent = "";
    return true;
}

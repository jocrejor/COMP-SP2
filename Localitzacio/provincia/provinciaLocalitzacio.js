// Esperem que el DOM estiga carregat
document.addEventListener("DOMContentLoaded", main);

let accio = "Afegir";
let countryId = null;
let countryName = "";
let provinciesFiltrades = [];

async function main() {
    // Obtenim els paràmetres de la URL
    const params = new URLSearchParams(window.location.search);
    countryName = params.get("country");
    countryId = Number(params.get("id")) || null;

    // Mostrem el país seleccionat
    document.getElementById("id").textContent = "País seleccionat: " + (countryName || "(Desconegut)");

    // Si no tenim country_id, intentem trobar-lo pel nom
    if (!countryId && countryName) {
        const paisTrobat = Country.find(c => c.name.toLowerCase() === countryName.toLowerCase());
        if (paisTrobat) countryId = paisTrobat.id;
    }

    if (!countryId) {
        alert("No s'ha pogut determinar el país seleccionat.");
        return;
    }

    // Filtrar províncies del país seleccionat
    provinciesFiltrades = Province.filter(p => p.country_id === countryId);

    mostrarLlista(provinciesFiltrades);

    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;

    // Listener del botó Afegir
    afegirButton.addEventListener("click", () => {
        if (!validarProvincia()) return;

        if (accio === "Afegir") crearProvincia();
        else {
            actualitzarProvincia();
            accio = "Afegir";
            afegirButton.textContent = accio;
        }

        document.getElementById("province").value = "";
        document.getElementById("index").value = "-1";
        mostrarLlista(provinciesFiltrades);
    });

    // 🔍 Filtre en temps real amb la lupa
    const buscarInput = document.getElementById("buscar");
    buscarInput.addEventListener("input", () => {
        const text = buscarInput.value.toLowerCase();
        const filtrades = provinciesFiltrades.filter(p => p.name.toLowerCase().includes(text));
        mostrarLlista(filtrades);
    });
}

// Mostrar la llista de províncies filtrades
function mostrarLlista(array) {
    const visualitzarLlista = document.getElementById("llista");
    visualitzarLlista.innerHTML = "";

    let html = "";
    array.forEach((prov, index) => {
        html += `
            <li>
                <button onclick="esborrarProvincia(${index})">🗑️</button>
                <button onclick="prepararActualitzar(${index})">✏️</button>
                ${prov.name}
                <a href="../poblacio/poblacioLocalitzacio.html?country_id=${countryId}&province_id=${prov.id}&province=${encodeURIComponent(prov.name)}">
                    <button>🏙️ Poblacions</button>
                </a>
            </li>
        `;
    });

    visualitzarLlista.innerHTML = html;
}

// Crear nova província
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

// Actualitzar província
function actualitzarProvincia() {
    const index = document.getElementById("index").value;
    const provinceName = document.getElementById("province").value.trim();

    provinciesFiltrades[index].name = provinceName;
    const provId = provinciesFiltrades[index].id;

    const provGeneral = Province.find(p => p.id === provId);
    if (provGeneral) provGeneral.name = provinceName;

    localStorage.setItem("Province", JSON.stringify(Province));
}

// Esborrar província
function esborrarProvincia(index) {
    const idAEliminar = provinciesFiltrades[index].id;
    const idxGeneral = Province.findIndex(p => p.id === idAEliminar);
    if (idxGeneral !== -1) Province.splice(idxGeneral, 1);
    provinciesFiltrades.splice(index, 1);

    localStorage.setItem("Province", JSON.stringify(Province));
    mostrarLlista(provinciesFiltrades);
}

// Quan cliquem "Modificar"
function prepararActualitzar(index) {
    document.getElementById("index").value = index;
    document.getElementById("province").value = provinciesFiltrades[index].name;
    accio = "Actualitzar";
    document.getElementById("afegir").textContent = accio;
}

// Validar nom
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

    if (provinciesFiltrades.some(p => p.name.toLowerCase() === nom)) {
        document.getElementById("mensajeError").textContent = "La província ja existeix en este país.";
        return false;
    }

    document.getElementById("mensajeError").textContent = "";
    return true;
}

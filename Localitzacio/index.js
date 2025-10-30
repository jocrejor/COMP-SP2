// Iniciem l'aplicació quan el DOM estiga completament carregat
document.addEventListener("DOMContentLoaded", main);
let countryArray = [];
let accio = "Afegir";     // Estat actual del botó

async function main() {
    // Carreguem les dades de Location.js i les sincronitzem amb localStorage
    carregarDades();
    
    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;

    mostrarLlista();

    // Si encara no existeix un ID automàtic al localStorage, el creem
    if (!localStorage.getItem("countryLastId")) {
        localStorage.setItem("countryLastId", "0");
    }

    // Listener del botó Afegir/Modificar
    afegirButton.addEventListener("click", () => {
        let validarPais = validarNomPais(); // Comprovem que el país siga vàlid

        if (validarPais === false) {
            return; // Si no és vàlid, parem l'execució
        } else {
            if (accio === "Afegir") {
                crearPais(); // Mode afegir nou país
            } else {
                actualitzarPais(); // Mode actualitzar país existent
                accio = "Afegir"; // Tornem a l'estat inicial
                afegirButton.textContent = accio;
            }
        }

        // Netejem el formulari després d'afegir o actualitzar
        document.getElementById("country").value = "";
        document.getElementById("index").value = "-1";

        // Tornem a mostrar la llista actualitzada
        mostrarLlista();
    });
}

// Funció per carregar i sincronitzar les dades
function carregarDades() {
    // Intentem carregar de localStorage
    const dadesLocalStorage = localStorage.getItem("localitzacioPais");
    
    if (dadesLocalStorage) {
        countryArray = JSON.parse(dadesLocalStorage);
    } else {
        // Si no hi ha dades a localStorage, carreguem de Location.js
        // Asumim que Location.js defineix una variable global 'Country'
        if (typeof Country !== 'undefined') {
            countryArray = [...Country]; // Fem una còpia
            localStorage.setItem("localitzacioPais", JSON.stringify(countryArray));
            
            // Establim l'ID màxim basat en les dades de Location.js
            if (countryArray.length > 0) {
                const maxId = Math.max(...countryArray.map(pais => pais.id));
                localStorage.setItem("countryLastId", maxId.toString());
            }
        } else {
            countryArray = [];
        }
    }
}

// Funció per crear un nou país i guardar-lo al localStorage
function crearPais() {
    const country = document.getElementById("country").value;
    if (country === "") {
        alert("El país no pot estar buit");
        return;
    }

    // Recuperem l'últim ID i incrementem-lo per assignar un ID únic
    let nuevoId = Number(localStorage.getItem("countryLastId")) + 1;

    // Objecte que representa un país amb ID i nom
    let objetoCountry = {
        id: nuevoId,
        name: country, // Canviat de 'country' a 'name' per consistència
    };

    // Afegim el país a l'array i l'actualitzem al localStorage
    countryArray.push(objetoCountry);
    localStorage.setItem("localitzacioPais", JSON.stringify(countryArray));
    localStorage.setItem("countryLastId", nuevoId.toString());
}

// Actualitzar país existent
function actualitzarPais() {
    const countryName = document.getElementById("country").value.trim();
    const index = parseInt(document.getElementById("index").value, 10);

    // Comprovem que l'índex sigui vàlid
    if (index >= 0 && index < countryArray.length) {
        // Actualitzem el nom del país
        countryArray[index].name = countryName;

        // Guardem l’array actualitzat a localStorage
        localStorage.setItem("localitzacioPais", JSON.stringify(countryArray));
    } else {
        console.error("Índex de país invàlid:", index);
    }
}


// Funció per mostrar la llista de països a la pàgina
function mostrarLlista() {
    const visualitzarLlista = document.getElementById("llista");
    visualitzarLlista.innerHTML = "";
    let aux = "";

    // Per a cada país, creem un element <li> amb botons per Esborrar, Modificar i accedir a Província
    countryArray.forEach((item, index) => {
        aux +=
            "<li><button onclick='esborrarPais(" +
            index +
            ")'>🗑️ Esborrar</button><button onclick='actualitzar(" +
            index +
            ")'>✏️ Modificar</button>" +
            item.name +
            "<a href='./provincia/provinciaLocalitzacio.html?id=" + 
            item.id + "&country=" + encodeURIComponent(item.name) + 
            "'><button>Provincia</button></a></li>";

    });

    // Pintem la llista generada dins del <ol>
    visualitzarLlista.innerHTML = aux;
}

// Carrega el país seleccionat per a modificar-lo
function actualitzar(index) {
    document.getElementById("index").value = index; // Guardem l'índex actual
    document.getElementById("country").value = countryArray[index].name; // Mostrem el valor al camp de text
    accio = "Actualitzar"; // Canviem l'estat del botó
    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;
}

// Funció per eliminar un país de la llista
function esborrarPais(index) {
    if (confirm("Estàs segur que vols eliminar aquest país?")) {
        countryArray.splice(index, 1); // Eliminem 1 element en la posició indicada
        localStorage.setItem("localitzacioPais", JSON.stringify(countryArray)); // Guardem la nova llista
        mostrarLlista(); // Actualitzem la vista
    }
}

// Funció per validar el nom del país abans d'afegir o modificar
function validarNomPais() {
    let country = document.getElementById("country");

    // Eliminem espais i convertim a minúscules per evitar duplicats amb majúscules diferents
    let countrySenseEspai = country.value.trim();

    // Validem que el camp no estiga buit
    if (countrySenseEspai === "") {
        document.getElementById("mensajeError").textContent =
            "Has d'introduïr un país.";
        return false;
    }

    // Validem que complisca amb el patró
    if (country.validity.patternMismatch) {
        document.getElementById("mensajeError").textContent =
            "Ha de tindre una mida de 3 a 30 caracters i només lletres";
        return false;
    }

    // Comprovem que el país no estiga duplicat (ignorant majúscules/minúscules)
    let indexActual = document.getElementById("index").value;
    for (let i = 0; i < countryArray.length; i++) {
        if (i != indexActual && 
            countryArray[i].name.toLowerCase() === countrySenseEspai.toLowerCase()) {
            document.getElementById("mensajeError").textContent =
                "El país ja està a la llista";
            return false;
        }
    }
    
    // Si tot és correcte, netegem el missatge d'error
    document.getElementById("mensajeError").textContent = " ";
    return true;
}
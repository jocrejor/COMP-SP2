// Iniciem l'aplicació quan el DOM estiga completament carregat
document.addEventListener("DOMContentLoaded", main);
let countryArray;
let llista = new Array(); // Array on guardarem la llista de països
let accio = "Afegir";     // Estat actual del botó (Afegir o Actualitzar)

async function main() {

    countryArray =  JSON.parse(localStorage.getItem("localitzacioPais")) || localStorage.setItem("localitzacioPais",JSON.stringify(Country)); 
    
    console.log(countryArray)
    
    
    
    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;

    mostrarLlista();

    // Si encara no existeix un ID automàtic al localStorage, el creem
    if (!localStorage.getItem("countryLastId")) {
        localStorage.setItem("countryLastId", 0);
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

// Funció per crear un nou país i guardar-lo al localStorage
function crearPais() {
    const country = document.getElementById("country").value;
    if (country === "") {
        alert("El país no pot estar buit");
        return;
    }

    // Recuperem l'últim ID i incrementem-lo per assignar un ID únic
    let nuevoCountry = Number(localStorage.getItem("countryLastId")) || 0;
    nuevoCountry++;

    // Objecte que representa un país amb ID i nom
    let objetoCountry = {
        id: nuevoCountry,
        country: country,
    };

    // Afegim el país a l'array i l'actualitzem al localStorage
    llista.push(objetoCountry);
    localStorage.setItem("localitzacioPais", JSON.stringify(llista));
    localStorage.setItem("countryLastId", nuevoCountry);
}

// Funció per actualitzar un país existent
function actualitzarPais() {
    const country = document.getElementById("country").value;
    const index = document.getElementById("index").value;

    // Actualitzem el país a la posició indicada pel camp ocult "index"
    // Mantenim l'ID original per no perdre'l
    llista[index] = { 
        id: llista[index].id, 
        country: country 
    };
    localStorage.setItem("localitzacioPais", JSON.stringify(llista));
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
            item.id +
            ")'>Esborrar</button><button onclick='actualitzar(" +
            item.id +
            ")'>Modificar</button>" +
            item.name +
            "<a href='./provincia/provinciaLocalitzacio.html?id=" + 
            item.id + "&country=" + encodeURIComponent(item.name) + 
            "'><button>Provincia</button></a>"

    });

    // Pintem la llista generada dins del <ol>
    visualitzarLlista.innerHTML = aux;
}

// Carrega el país seleccionat per a modificar-lo
function actualitzar(index) {
    console.log(llista[index]);
    document.getElementById("index").value = index; // Guardem l'índex actual
    document.getElementById("country").value = llista[index].country; // Mostrem el valor al camp de text
    accio = "Actualitzar"; // Canviem l'estat del botó
    const afegirButton = document.getElementById("afegir");
    afegirButton.textContent = accio;
}

// Funció per eliminar un país de la llista
function esborrarPais(index) {
    llista.splice(index, 1); // Eliminem 1 element en la posició indicada
    localStorage.setItem("localitzacioPais", JSON.stringify(llista)); // Guardem la nova llista
    mostrarLlista(); // Actualitzem la vista
}

// Funció per validar el nom del país abans d'afegir o modificar
function validarNomPais() {
    let country = document.getElementById("country");

    // Eliminem espais i convertim a minúscules per evitar duplicats amb majúscules diferents
    let countrySenseEspai = country.value.trim().toLowerCase();

    // Validem que el camp no estiga buit
    if (countrySenseEspai === "") {
        document.getElementById("mensajeError").textContent =
            "Has d'introduïr un país.";
        return false;
    }

    // Validem que complisca amb el patró
    if (country.validity.patternMismatch) {
        document.getElementById("mensajeError").textContent =
            "Ha de tindre una mida de 3 a 30 caracters";
        return false;
    }

    // Comprovem que el país no estiga duplicat
    let indexActual = document.getElementById("index").value;
    for (let i = 0; i < llista.length; i++) {
        if (i != indexActual && llista[i].country.toLowerCase() === countrySenseEspai) {
            document.getElementById("mensajeError").textContent =
                "El país ja està a la llista";
            return false;
        }
    }
    
    // Si tot és correcte, netegem el missatge d'error
    document.getElementById("mensajeError").textContent = " ";
    return true;
}